import {Col, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

function NotFoundLayout() {
    return (
        <>
           
            <Row className="d-flex justify-content-center align-items-center" ><Col xs = "auto"> <img src="/GitHub404.png" alt="page not found" className="my-3" style={{display: 'block'}}/>
            </Col></Row>
            <Row><Col> <Link to="/" className="btn btn-primary mt-2 my-5">Homepage</Link> </Col></Row>
        </>
    );
}

export default NotFoundLayout