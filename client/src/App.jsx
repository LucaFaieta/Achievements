
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody } from 'react-bootstrap/';
import { Route, Routes, Navigate } from 'react-router-dom';
import API from "./API.js";
import FeedbackContext from './contexts/FeedbackContext.js';
import NotFoundLayout from './components/notFound.jsx';
import Header from './components/Header.jsx';
import NonLoggedUserComponent from './components/Login.jsx';
import GuessingGame from './components/matchComponent.jsx';
import PersonalPage from './components/homeComponent.jsx';


function App() {



    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const[refresh,setRefresh] = useState(false);
    const [attained, setAttained] = useState([]);
    const [toBe, setToBe] = useState([]);



  useEffect(() => {
    // Checking if the user is already logged-in
    API.getUserInfo()
        .then(userA => {
            setLoggedIn(true);
            setUser({id : userA.id,email : userA.email});
            setRefresh(true);
        }).catch(e => {
            if(loggedIn)    // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
                setFeedbackFromError(e);
            setLoggedIn(false); setUser(null); setRefresh(false);
        }); 
}, []);

  
const handleLogin = async (credentials) => {
  const user = await API.logIn(credentials);
  setUser({id : user.id,email : user.email});  setLoggedIn(true); setRefresh(true);
};


const handleLogout = async () => {
  await API.logOut().catch(e => setFeedbackFromError(e));
  // clean up everything
  setLoggedIn(false); setUser(null); setRefresh(false);
};

  useEffect(() => {
    const fetchAchi = async () => {
      const results = await API.userAchi();
      setAttained([...results.achieved]);
      setToBe([...results.toAchieve]);
    };
    if (user){
    fetchAchi().catch(e => setFeedbackFromError(e));
    setRefresh(false);
  }
  }, [refresh]);



  const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); 
    };

  return (
    <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError}}>
            <div className="min-vh-100 d-flex flex-column">
                <Header logout = {handleLogout} user = {user}/>
                <Container fluid className="flex-grow-1 d-flex flex-column">
                    <Routes>
                        <Route
                            path="/" element={ /* If the user is not logged-in, redirect to log-in form*/
                                !loggedIn ? <Navigate replace to='/login' />
                                :<PersonalPage attained = {attained} toBe = {toBe}/>
                        }>
                            <Route path="*" element={<NotFoundLayout/>}/>
                            {<Route index element={
                                 <PersonalPage/>}/>}
                        </Route>
                        <Route path="/play/:n/" element={
                            !loggedIn ? <Navigate replace to='/login' />
                            : <GuessingGame setRefresh = {setRefresh}/>}/>
                        
                        
                        <Route path="/login" element={ /* If the user is ALREADY logged-in, redirect to root */
                            loggedIn ? <Navigate replace to='/' />
                            : <NonLoggedUserComponent onLogin={handleLogin}/>
                        } />
                    </Routes>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top-end"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
            </div>
            </FeedbackContext.Provider>
    );
  
}

export default App
