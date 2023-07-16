import { useEffect, useState } from "react";
import { Col, Row, Table, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ListMovie = () => {
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8889/movies")
            .then((resp) => resp.json())
            .then((data) => {
                setMovie(data);
            });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Do you want this film ?")) {
            fetch("http://localhost:8889/movies/" + id, {
                method: "DELETE",
            })
                .then(() => {
                    alert("Delete success");
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };


    return (
        <Row>
            <Col md={11} style={{ margin: '0 auto' }}>
                <Row>
                    <Col style={{ textAlign: 'right' }}>
                        <Link to={"/create"} style={{ textDecoration: 'none', }}><Button className="btn btn-success">Create Movie</Button></Link>
                    </Col>
                </Row>

                <Row>
                    <Table>
                        <thead>
                            <tr style={{ fontWeight: 'bold' }}>
                                <th>Image</th>
                                <th>Banner</th>
                                <th>Name</th>
                                <th>Actor</th>
                                <th>Director</th>
                                <th>ReleaseDate</th>
                                <th>Duration</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Description</th>
                                <th>PriceTicket</th>
                                <th>CRUD</th>
                            </tr>


                        </thead>
                        <tbody>
                            {
                                movie.map(m => (
                                    <tr key={m.id}>
                                        <td><Image src={m.image} fluid style={{ maxWidth: '100px', maxHeight: '100px' }}></Image></td>
                                        <td><Image src={m.banner} fluid style={{ maxWidth: '100px', maxHeight: '100px' }}></Image></td>
                                        <td>{m.name}</td>
                                        <td>{m.actor}</td>
                                        <td>{m.director}</td>
                                        <td>{m.date}</td>
                                        <td>{m.duration}</td>
                                        <td>{m.category + ","}</td>
                                        <td>{m.description}</td>
                                        <td><a href={m.trailer}>{m.trailer}</a></td>
                                        <td>{m.priceticket}</td>
                                        <td>
                                            <Link to={"/edit/" + m.id}><Button>Edit</Button></Link>

                                            <Link onClick={() => handleDelete(m.id)}><Button className="btn btn-danger">Delete</Button></Link>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </Table>
                </Row>

            </Col>
        </Row>
    );
}

export default ListMovie;  