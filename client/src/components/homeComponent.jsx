import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PersonalPage = (props) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  

  const navigate = useNavigate();

  const {attained,toBe} = props;

  const onStartMatch = () => {
    const str = `/play/${selectedDifficulty}/`;
    navigate(str);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {/* Start Match */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm ">
            <Card.Header className="bg-primary text-white text-center">
              Start a New Match
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
              <Form>
                <Form.Group controlId="difficultySelect" className="mb-3">
                  <Form.Label>Select Difficulty Level (1 to 4):</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="4"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={onStartMatch}
                  disabled={selectedDifficulty < 1 || selectedDifficulty > 4}
                >
                  Start Match
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Attained Achievements */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm ">
            <Card.Header className="bg-success text-white text-center">
              Attained Achievements
            </Card.Header>
            <Card.Body>
            {toBe.length === 0 ? (
              <Col className="text-center">
                <Col className="spinner-border text-primary" role="status">
                  <Row className="visually-hidden">Loading...</Row>
                </Col>
                <Row className="text-muted mt-2" style={{ fontSize: '1.3rem' }}>Loading achievements...</Row>
              </Col>
            ) : (
              attained.map((achievement, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body className="text-center">
                    {achievement.icon}
                    <Card.Title className="fw-bold">{achievement.name}</Card.Title>
                    <Card.Text>{achievement.condition}</Card.Text>
                    <Card.Text>Times Gained: {Number(achievement.times_gained)}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            )}
          </Card.Body>

          </Card>
        </Col>

        {/* Next Achievements */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm ">
            <Card.Header className="bg-warning text-dark text-center">
              Next Achievements
            </Card.Header>
            <Card.Body>
                {toBe.length === 0 ? (
                  <Col className="text-center">
                    <Col className="spinner-border text-primary" role="status">
                      <Row className="visually-hidden">Loading...</Row>
                    </Col>
                    <Row className="text-muted mt-2" style={{ fontSize: '1.3rem' }}>Loading achievements...</Row>
                  </Col>
                ) : (
                  toBe.map((achievement, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body className="text-center">
                      {achievement.icon}
                        <Card.Title className="fw-bold">{achievement.name}</Card.Title>
                        <Card.Text>{achievement.condition}</Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalPage;
