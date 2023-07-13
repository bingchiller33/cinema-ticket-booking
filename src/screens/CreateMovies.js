/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, FormGroup, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
const CreateMovie = () => {
    const navigate = useNavigate();
    const [id, setID] = useState(0);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [banner, setBanner] = useState("");
    const [actor, setActor] = useState("");
    const [director, setDirector] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("");
    const [category, setCategory] = useState([]);
    const [description, setDescription] = useState("");
    const [trailer, setTrailer] = useState("");
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8889/movies")
            .then((resp) => resp.json())
            .then((data) => {
                setMovie(data);
            });
    }, []);


    const handleCategoryChange = (e) => {
        const value = e.target.value;

        setCategory(prevState => {
            // if the checkbox is checked
            if (e.target.checked) {
                // add the checkbox value to the state
                return [...prevState, value];
            } else {
                // if the checkbox is unchecked
                // remove the checkbox value from the state
                return prevState.filter(category => category !== value);
            }
        });
    };


    const cate = ['Animated', 'Fantasy', 'Gangster', 'Science Fiction', 'Western', 'Sports', 'Mystery', 'Romantic Drama', 'Courtroom Drama', 'Epic'];
    const handlesubmit = (e) => {
        e.preventDefault();
        const empdata = { id, name, image, banner, actor, director, date, duration, category, description, trailer };
        if (name.length === 0 || image.length === 0 || banner.length === 0 || actor.length === 0 || director.length === 0 || date.length === 0 || duration.length === 0 || category.length === 0 || description.length === 0 || trailer.length === 0) {
            alert('Please fill all fields');
        } else {
            fetch("http://localhost:8889/movies", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ ...empdata, views: 0 }),
            })
                .then(() => {
                    alert("Create film successfully.");
                    navigate("/crud");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    return (
        <Row>
            <Col md={8} style={{ margin: '0 auto' }}>
                <Card>
                    <Card.Header style={{ textAlign: "center" }}><h1>Create Film</h1></Card.Header>
                    <Card.Body>
                        <Form onSubmit={handlesubmit}>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Name
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {name.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter name of film
                                    </label>
                                )}

                            </Form.Group>


                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Image
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                                {image.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter image of film
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Banner
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={banner}
                                    onChange={(e) => setBanner(e.target.value)}
                                />
                                {banner.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter banner of film
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Actor
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={actor}
                                    onChange={(e) => setActor(e.target.value)}
                                />
                                {actor.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter actor of film
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Director
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={director}
                                    onChange={(e) => setDirector(e.target.value)}
                                />
                                {director.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter director of film
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Date
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                {date.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please pick date of film
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Duration
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                {duration.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please pick date of duration
                                    </label>
                                )}
                            </Form.Group>


                            <Col>
                                <label style={{ fontWeight: 'bold' }}>Category<span style={{ color: 'red' }}>*</span></label><br></br><br></br>

                                {
                                    cate.map((m) => (

                                        <label key={m} style={{ marginRight: '20px' }}>
                                            <input
                                                type="checkbox"
                                                value={m}
                                                // checked={checkboxValues.includes(m)} // Kiểm tra giá trị từ API
                                                onChange={handleCategoryChange} style={{ accentColor: 'blue' }}
                                            />
                                            {m}
                                        </label>
                                    ))
                                }
                            </Col><br></br>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Description
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {description.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please enter of description
                                    </label>
                                )}
                            </Form.Group>

                            <Form.Group style={{ marginBottom: '20px' }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Trailer
                                    <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    value={trailer}
                                    onChange={(e) => setTrailer(e.target.value)}
                                />
                                {trailer.length === 0 && (
                                    <label style={{ color: "red" }}>
                                        Please pick date of trailer
                                    </label>
                                )}
                            </Form.Group>


                            <br />
                            <FormGroup>
                                <Button type="submit">Create</Button>
                            </FormGroup>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <Link to={"/crud"}>Back to List</Link>
                    </Card.Footer>
                </Card>
            </Col>
        </Row>



    );
};
export default CreateMovie;