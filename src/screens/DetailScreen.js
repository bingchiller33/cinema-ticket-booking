import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import DefaultTemplate from '../templates/DefaultTemplate';
import '../styles/detailMovie.css'
const BookingScreen = () => {
  const { mid } = useParams()
  const [movie, setMovie] = useState({})
  useEffect(() => {
    fetch('http://localhost:9999/movies/' + mid)
      .then(res => res.json())
      .then(data => setMovie(data))
  }, [])
  console.log(movie);
  return (
    <DefaultTemplate>
      <Container>
        <Row>
          <Col xs={1}></Col>
          <Col xs={10}>
            <Container>
              <Row className='search_movie'>
                <Col xs={2} md={3}><h2>Movie Content</h2></Col>
              </Row>
            </Container>
          </Col>
          <Col xs={1}></Col>
        </Row>
        <Row>
          <Col xs={2}></Col>
          <Col xs={8}>
            <Container>
              <Row>
                <Col xs={3}>
                  <img className='img_movie_detail' src={movie.movieImage} alt={movie.id} />
                </Col>
                <Col xs={9}>
                  <Row style={{borderBottom: '2px solid #CCC'}}>
                    <Col xs={12}><h2>{movie.movieName}</h2></Col>
                  </Row>
                  <Row>
                    <Col>
                     {/* <ul>
                      <li><span>Actor:</span> {movie.actor}</li>
                      <li><span></span> {movie.director}</li>
                      <li><span></span> {movie.duration}</li>
                      <li><span></span> {movie.category}</li>
                      <li><span></span> {movie.releaseDate}</li>
                     </ul> */}
                     <Table>
                      <tbody> 
                        <tr>
                          <td className='table_title_movie_detail'>Actor:</td>
                          <td>{movie.actor}</td>
                        </tr>
                        <tr>
                          <td className='table_title_movie_detail'>Director:</td>
                          <td>{movie.director}</td>
                        </tr>
                        <tr>
                          <td className='table_title_movie_detail'>Category:</td>
                          <td>{movie.category}</td>
                        </tr>
                        <tr>
                          <td className='table_title_movie_detail'>Director:</td>
                          <td>laditomo</td>
                        </tr>
                        <tr>
                          <td className='table_title_movie_detail'>ReleaseDate:</td>
                          <td>{movie.releaseDate}</td>
                        </tr>
                      </tbody>
                     </Table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col xs={2}></Col>
        </Row>
      </Container>
    </DefaultTemplate>
  );
};

export default BookingScreen;
