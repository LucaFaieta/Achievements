import React, { useState,useEffect,useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import FeedbackContext from '../contexts/FeedbackContext';

const NonLoggedUserComponent = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [allAchi,setAllAchi] = useState([]);
  const navigate = useNavigate();
  const {setFeedbackFromError} = useContext(FeedbackContext);


  useEffect(() => {
  
    const fetchAchi = async () =>{
      const results = await API.allAchi().catch(e => setFeedbackFromError(e));
      setAllAchi([...results]);
      console.log(results);
    }

    fetchAchi();

}, []);
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({username:email, password:password}).then(() => navigate("/")).catch( (err) => {
        if(err.message === "Unauthorized")
            setError("Invalid username and/or password");
        else
            setError(err.message);
      });
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {/* Achievements Section */}
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center" style={{ fontSize: '1.5rem' }}>
              Gainable Achievements
            </Card.Header>
            <Card.Body>
              {allAchi.map((achievement, index) => (
                <Card key={index} className="shadow-sm mb-3">
                  <Card.Body className="d-flex align-items-center justify-content-between" style={{ fontSize: '1.7rem' }}>
 
                      {achievement.icon}
  
                    <div className="flex-grow-1">
                      <Card.Title className="flex-grow-1 fw-bold text-center" style={{ fontSize: '1.5rem' }}> {achievement.name}</Card.Title>
                      <Card.Text className="text-muted text-center"style={{ fontSize: '1.3rem' }}>{achievement.condition}</Card.Text>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Login Section */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white text-center">
              Login
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NonLoggedUserComponent;
