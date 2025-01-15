import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = (props) => {

  const navigate = useNavigate();

  const handleLogout = () => {
    props.logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        <Navbar.Brand href="/">Guessing Game</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {props.user ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">{props.user.email}</span>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="me-3"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <span className="text-light">Guest</span>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderComponent;
