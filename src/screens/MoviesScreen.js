import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import CardComp from '../components/common/Card';
import '../styles/movies.css'
import DefaultTemplate from '../templates/DefaultTemplate';
const MoviesScreen = () => {
  const [movie, setMovie] = useState([])
  const [status, setStatus] = useState('All')
  const [searchMovie, setSearchMovie] = useState('')
  useEffect(() => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();
    var currentTime = `${year}-${month}-${day}`
    fetch('http://localhost:9999/movies')
      .then(res => res.json())
      .then(data => setMovie(data.filter(d => {
        var date1 = new Date(currentTime)
        var date2 = new Date(d.releaseDate)
        if (status === 'Movie is playing') {
          return (date2.getTime() < date1.getTime() && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase()))
        } else if (status === 'Movie coming soon') {
          return date2.getTime() > date1.getTime() && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase())
        }
        return true && d.movieName.toLowerCase().startsWith(searchMovie.toLowerCase())
      })
      ))
  }, [status, searchMovie])

console.log(searchMovie);

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
                    <Form.Control placeholder='Your movie...' value={searchMovie} onChange={(e)=> setSearchMovie(e.target.value)} />
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
                    <Col xs={3}>
                      <Card key={m.movieId} className='card_container'>
                        <Card.Img className='card_movie_img' variant="top" src={m.movieImage} />
                        <Card.Body className="card-body_movie">
                          <Card.Title className='card-body_title'>{m.movieName}</Card.Title>
                          <Card.Text className='card-text_component'><span>Actor:</span> {m.actor}</Card.Text>
                          <Card.Text className='card-text_component'><span>Duration:</span> {m.duration} minute</Card.Text>
                          <Card.Text className='card-text_component'><span>Category:</span> {m.category} minute</Card.Text>
                          <Card.Text className='card-text_component'><span>Premiere:</span> {m.releaseDate}</Card.Text> 
                        </Card.Body>
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
  );
};

export default MoviesScreen;
