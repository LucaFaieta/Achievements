// imports
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult} from 'express-validator'; // validation middleware


import Achievements from './achievements.mjs';
import UserDao from './dao-users.mjs';
import achievementDao from './dao-achievement.mjs';
// init express
const app = new express();
const userDao = new UserDao();
const achiDao = new achievementDao();

/*** init express and set up the middlewares ***/
app.use(morgan('dev'));
app.use(express.json());


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: ' http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));


/*** Passport ***/

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password)
    if(!user)
      return callback(null, false, 'Incorrect username or password');

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name
    callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
    return callback(null, user); // this will be available in req.user

    // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});


/** Creating the session */
import session from 'express-session';

app.use(session({
  secret: "Chieti",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}




// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
    return msg;
};





/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json({ error: info});
        }
        // success, perform the login and extablish a login session
        req.login(user, (err) => {
          if (err)
            return next(err);

          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
          return res.json(req.user);
        });
    })(req, res, next);
  });

  // GET /api/sessions/current
  // This route checks whether the user is logged in or not.
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
  });

  // DELETE /api/session/current
  // This route is used for loggin out the current user.
  app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
  });



  const matchValidation = [
    check('won')
      .isBoolean()
      .withMessage('won must be a boolean.'),
  
    check('difficulty')
      .isInt({ min: 1, max: 4 })
      .withMessage('difficulty must be a number between 1 and 4.'),
  
    check('nGuess')
      .custom((nGuess, { req }) => {
        const difficulty = req.body.difficulty;
        if (typeof difficulty !== 'number') {
          throw new Error('difficulty must be defined and a number before validating "nGuess".');
        }
        if (nGuess < 1 || nGuess > 4 * difficulty) {
          throw new Error(`nGuess must be a number between 1 and ${4 * difficulty}.`);
        }
        return true;
      }),
  
    check('number')
      .custom((number, { req }) => {
        const difficulty = req.body.difficulty;
        if (typeof difficulty !== 'number') {
          throw new Error('difficulty must be defined and a number before validating "number".');
        }
        const maxNumber = 10 ** difficulty;
        if (number < 1 || number > maxNumber) {
          throw new Error(`number must be a number between 1 and ${maxNumber}.`);
        }
        return true;
      })
  ];

  let all_achi;
  const achievements = new Achievements();



app.get('/api/allAchi',
  async(req, res) => {
    try{
      all_achi = await achiDao.getAllAchi();
      const results = [...all_achi] ;
      res.json(results);
    }catch(e){
      res.status(500).json({error: `Database error retrieving the achievements: ${e}`});
    }
  }
);

app.get('/api/userAchi', isLoggedIn,
  async(req, res) => {
      try{
      const query = await achiDao.getUserAchi(req.user.id);
      const userAchi = query.filter(value => value.times_gained != 0);
      const gainable = query.filter(value => value.times_gained === 0 || value.repeatable === 1);
      res.json({"achieved":[...userAchi],"toAchieve":[...gainable]});
    }catch(e){
      res.status(500).json({error: `Database error during the placing of your bet: ${e}`});
    }
  }
);


app.put('/api/match', isLoggedIn,matchValidation,
  async (req, res) => {

      const invalidFields = validationResult(req);

      if (!invalidFields.isEmpty()) {
          return onValidationErrors(invalidFields, res);
      }
      try {
        const match = {"won":req.body.won,
                      "difficulty": Number(req.body.difficulty),
                      "nGuess": Number(req.body.nGuess),
                      "number": Number(req.body.number)};
          const history = await achiDao.matches_info(req.user.id,match.difficulty);
          const new_score = await achievements.add_match(history,match);
          await achiDao.updateMatchInfo(new_score,req.user.id);
          const userAchi = await achiDao.getUserAchi(req.user.id);
          const resu = await achievements.check_achi(new_score,achiDao,userAchi,req.user.id);
          const joined = await Promise.all(resu.new_achi.map(async (id) => {
            return await achiDao.achievemntFromId(id);
          }));
          const result = {"newAchi":joined};
          
          res.json(result);
      } catch (err) {
          res.status(503).json({error: `Database error retieving your achievement: ${err}`});
      }
  }
)
;

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));