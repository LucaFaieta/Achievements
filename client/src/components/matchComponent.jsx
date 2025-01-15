import React, { useState,useEffect,useContext} from "react";
import { Container, Row, Col, Card, Button, Form, Alert,Modal} from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import FeedbackContext from '../contexts/FeedbackContext';


const GuessingGame = (props) => {
  const { n } = useParams();
  const difficulty = Number(n);
  
    const navigate = useNavigate();
  // Game states
  //const [response,setResponse] = useState(null);
  const [secretNumber, setSecretNumber] = useState(null);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameStatus, setGameStatus] = useState(""); // won lost 
  const [endGame,setEndGame] = useState(false);
  const [newAchi,setNewAchi] = useState([]);
  const [showAchievementModal,setShowAchievementModal] = useState(false);
  const [range,setRange] = useState(0);
  const {setFeedbackFromError} = useContext(FeedbackContext);
  



  useEffect(() => {

            const fetchAchi = async () =>{
              const match = {
                "won": gameStatus === "won" ? true : false,
                "difficulty": difficulty,
                "nGuess": 4*difficulty - remainingAttempts,
                "number": secretNumber
              };
              const results = await API.newAchi(match).catch(e => setFeedbackFromError(e));
              //props.setAchi([...results.achi]);
              if(results.newAchi.length > 0){
                setNewAchi([...results.newAchi]);
                setShowAchievementModal(true);
              }
            }

    if (!endGame && feedback === ""){
    startGame(); // Start the game when the page loads
    }else if (endGame){
        fetchAchi();
        setEndGame(false);
        props.setRefresh(true);
    }
    /*return () => {
      setEndGame(false);};*/
  }, [endGame]);

  const closeModal = () => setShowAchievementModal(false);

  const startGame = () =>{
    const max = 10**difficulty;
    console.log(max);
    setRange(max);
    const attempts = 4 * difficulty;

    //setSecretNumber(Math.floor(Math.random() * max) + 1);
    setSecretNumber(5);
    setRemainingAttempts(attempts);
    setFeedback("");
    setGuess("");
  
  }
  const handleGuess = () => {
    const numericGuess = Number(guess);
    setRemainingAttempts((prev) => prev - 1);



    if (numericGuess < 1 || numericGuess > 10 ** difficulty) {
      setFeedback(`Please enter a number between 1 and ${10 ** difficulty}.`);
      
      return;
    }

     if (numericGuess === secretNumber) {
      setFeedback("🎉 Congratulations! You guessed the number!");
      setGameStatus("won");
      setEndGame(true);
      return;
    }

    

     if (remainingAttempts - 1 <= 0) {
      setFeedback(`You lost! The secret number was ${secretNumber}.`);
      setGameStatus("lost");
      setEndGame(true);
      return;
    }

     if (numericGuess < secretNumber) {
      setFeedback("Too low! Try again.");
    } else {
      setFeedback("Too high! Try again.");
    }

    
  };

  const resetGame = () => {
    setGameStatus("");
    setNewAchi([]);
    setFeedback("");
    setGuess("");
    closeModal();
    startGame();
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              Guessing Game
            </Card.Header>
            <Card.Body>

        { gameStatus === "" &&(
                <>
                  <Alert variant="info">
                    Guess the secret number between 1 and {range}.
                    
                    You have {remainingAttempts} attempts remaining.
                  </Alert>
                  <Form>
                    <Form.Group controlId="guessInput" className="mb-3">
                      <Form.Label>Enter your guess:</Form.Label>
                      <Form.Control
                        type="number"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                      />
                    </Form.Group>
                    <Button variant="primary" onClick={handleGuess}>
                      Submit Guess
                    </Button>
                  </Form>
                  {feedback && <Alert variant="secondary" className="mt-3">{feedback}</Alert>}
                </>
              )}

              {(gameStatus === "won" || gameStatus === "lost") && (
                <>
                  <Alert variant={gameStatus === "won" ? "success" : "danger"}>
                    {feedback}
                    
                  </Alert>
                  <Button variant="warning" onClick={() => navigate("/")} className="me-1">
                       Home
                    </Button>
                    <Button variant="success" onClick={() => resetGame()} className="ms-1">
                    Play Again
                  </Button>
                </>
                
              )}
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* New Achievements Modal */}
      <Modal show={showAchievementModal} onHide={closeModal}>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title >🎉 Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
        These are your new achievements:
          {newAchi.map((ach, index) => (
            <Card key={index} className="mb-2">
              <Card.Body>
                <Card.Title>
                  {ach.icon} {ach.name}
                </Card.Title>
                <Card.Text>{ach.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>

        <Modal.Footer>
        <Button variant="warning" onClick={() => navigate("/")} className="me-1">
                       Home
                    </Button>
                    <Button variant="success" onClick={() => resetGame()} className="ms-1">
                    Play Again
                  </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GuessingGame;
