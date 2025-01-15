function NotFoundLayout() {
    return (
        <>
            <Row><Col>Error: page not found!</Col></Row>
            <Row><Col> <img src="/GitHub404.png" alt="page not found" className="my-3" style={{display: 'block'}}/>
            </Col></Row>
            <Row><Col> <Link to="/" className="btn btn-primary mt-2 my-5">Homepage</Link> </Col></Row>
        </>
    );
}

export default NotFoundLayout