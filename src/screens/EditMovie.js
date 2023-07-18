import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
const EditMovie = () => {
    const { mid } = useParams();
    const navigate = useNavigate();
    const [id, setID] = useState(0);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [banner, setBanner] = useState("");
    const [actor, setActor] = useState("");
    const [director, setDirector] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState(0);
    const [category, setCategory] = useState([]);
    const [description, setDescription] = useState("");
    const [trailer, setTrailer] = useState("");
    const [priceticket, setPriceticket] = useState(0);

    useEffect(() => {
        fetch(" http://localhost:9999/movies/" + mid)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                setID(res.id);
                setName(res.name);
                setImage(res.image);
                setBanner(res.banner);
                setActor(res.actor);
                setDirector(res.director);
                setDate(res.date);
                setDuration(res.duration);
                setCategory(res.category);
                setDescription(res.description);
                setTrailer(res.trailer);
                setPriceticket(res.priceticket);
            })
            .catch((err) => {
                console.log(err.message);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const cate = ['Animated', 'Fantasy', 'Gangster', 'Science Fiction', 'Western', 'Sports', 'Mystery', 'Romantic Drama', 'Courtroom Drama', 'Epic'];

    const handlesubmit = (e) => {
        e.preventDefault();
        const empdata = { id, name, image, banner, actor, director, date, duration, category, description, trailer, priceticket };
        if (name.length === 0 || image.length === 0 || banner.length === 0 || actor.length === 0 || director.length === 0 || date.length === 0 || duration === 0 || category.length === 0 || description.length === 0 || trailer.length === 0 || priceticket === 0) {
            alert('Please fill all fields');
        }
        else {
            fetch(" http://localhost:9999/movies/" + mid, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(empdata),
            })
                .then(() => {
                    alert("Saved successfully.");
                    navigate("/crud");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

    };


    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        let updatedValues = [...category];
        if (e.target.checked) {
            // Nếu checkbox được chọn, thêm giá trị vào mảng
            updatedValues.push(value);
        } else {
            // Nếu checkbox được bỏ chọn, loại bỏ giá trị khỏi mảng
            updatedValues = updatedValues.filter((item) => item !== value);
        }

        setCategory(updatedValues);
    }

    return (
        <Row>
            <Col md={8} style={{ margin: '0 auto' }}> <Card>
                <Card.Header style={{ textAlign: "center" }}>
                    <h1>Edit Film</h1>
                </Card.Header>
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
                                onChange={(e) => setDate(e.target.value)}
                            />
                            {date.length === 0 && (
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
                                            onChange={handleCheckboxChange}
                                            checked={category.includes(m)} style={{ accentColor: 'blue' }}

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
                                onChange={(e) => setDate(e.target.value)}

                            />
                            {date.length === 0 && (
                                <label style={{ color: "red" }}>
                                    Please pick date of description
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

                        <Form.Group style={{ marginBottom: '20px' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>
                                PriceTicket
                                <span style={{ color: 'red' }}>*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={priceticket}
                                onChange={(e) => setPriceticket(e.target.value)}
                            />
                            {priceticket.length === 0 && (
                                <label style={{ color: "red" }}>
                                    Please enter price of ticket
                                </label>
                            )}
                        </Form.Group>

                        <Button type="submit">Submit</Button>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <Link to={"/crud"}>Back to List</Link>
                </Card.Footer>
            </Card></Col>
        </Row>

    );
}
export default EditMovie;