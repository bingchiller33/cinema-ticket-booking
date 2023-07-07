import { Button, Card, Col } from "react-bootstrap";
const CardComp = ({ img }) => {
    return (
        <Col md={4}>
            <Card style={{ width: '14rem'}}>
                <Card.Img variant="top" src={img} style={{height: '14rem'}} />
                <Card.Body className="card-body_movie">
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        Some quick example text to Some quick example text to Some quick example text to
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default CardComp;