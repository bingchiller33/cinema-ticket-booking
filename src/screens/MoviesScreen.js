import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Col, Image, Row } from 'react-bootstrap'

const MoviesScreen = () => {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8889/movies")
      .then((resp) => resp.json())
      .then((data) => {
        setMovie(data);
      });
  }, []);

  return (
    <Row>
      <Col md={10} className='container' style={{ margin: '0 auto' }}>
        <Row>
          {
            movie.map(m => (
              <Col md={2}>
                <Row><Image src={m.movieImage} alt='movies' ></Image></Row>
                <Row>Name : {m.movieName}</Row>
                <Row>Actor : {m.actor}</Row>
                <Row>Director : {m.director}</Row>
                <Row>ReleaseDate : {m.releaseDate}</Row>
              </Col>

            ))
          }
        </Row>
      </Col>
    </Row>
=======
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/movies.css'
import DefaultTemplate from '../templates/DefaultTemplate';
const MoviesScreen = () => { 
  const [movie, setMovie] = useState([])
  const [status, setStatus] = useState('All')
  const [searchMovie, setSearchMovie] = useState('')
  useEffect(() => {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let currentTime = `${year}-${month}-${day}`
    fetch('http://localhost:9999/movies')
      .then(res => res.json())
      .then(data => setMovie(data.filter(d => {
        let date1 = new Date(currentTime)
        let date = d.releaseDate.split('-')
        let date2 = new Date(`${date[2]}-${date[1]}-${date[0]}`)
        if (status === 'Movie is playing') {
          return date2.getTime() < date1.getTime() && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase())
        } else if (status === 'Movie coming soon') {
          return date2.getTime() > date1.getTime() && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase())
        }
        return true && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase())
      })
      ))
  }, [status, searchMovie])   
  const handleOnchangeSelect = (e) => {
    setStatus(e.target.value)
  }
  return (
    <DefaultTemplate>
      <Container>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}>
            <Container>
              <Row className='search_movie'>
                <Col xs={2} md={3}><h2>Search Movies</h2></Col>
                <Col xs={3} md={3}>
                  <Form.Group>
                    <Form.Select onChange={(e) => handleOnchangeSelect(e)}>
                      <option>All</option>
                      <option>Movie is playing</option>
                      <option>Movie coming soon</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={7} md={6}>
                  <Form.Group>
                    <Form.Control placeholder='Your movie...' value={searchMovie} onChange={(e) => setSearchMovie(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}>
            <Container>
              <Row>
                {
                  movie.map(m => (
                    <Col xs={3} key={m.id} className='pb-4'>
                      <Card key={m.id} className='card_container position-relative'>
                        <Link to={'/detail/' + m.id}><Card.Img className='card_movie_img' variant="top" src={m.movieImage} /></Link>
                        <Card.Body className="card-body_movie" id={m.id} style={{ height: '180px', maxHeight: 'none', minHeight: '0' }}>
                          <Card.Title className='card-body_title'><Link to={'/detail/' + m.id} className='movie_title'>{m.movieName}</Link></Card.Title>
                          <Card.Text className='card-text_component'><span>Duration:</span> {m.duration} minute</Card.Text>
                          <Card.Text className='card-text_component'><span>Category:</span> {m.category} minute</Card.Text>
                          <Card.Text className='card-text_component'><span>Premiere:</span> {m.releaseDate}</Card.Text>
                        </Card.Body>
                        <Container>
                          <Row className='pt-2 pb-4'>
                            <Col xs={12} className='text-center d-flex justify-content-around position-absolute' >
                              <Button><Link className='movie_detail_link' to={'/detail/' + m.id}>View Detail</Link></Button>
                              {/* <Button className={'btn-danger'}><Link className='movie_detail_link' to={'/booking/' + m.id}>Buy Ticket</Link></Button> */}
                            </Col>
                          </Row>
                        </Container>
                      </Card>
                    </Col>
                  ))
                }
              </Row>
            </Container>
          </Col>
          <Col xs={1}></Col>
        </Row>
      </Container>
    </DefaultTemplate>
>>>>>>> 10326a13800c80d1d1e04ac1b6d559783008c94d
  );
};

export default MoviesScreen;
