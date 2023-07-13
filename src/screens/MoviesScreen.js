import React, { useEffect, useState } from 'react';
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
  );
};

export default MoviesScreen;
