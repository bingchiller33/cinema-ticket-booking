import React, { useEffect, useState } from 'react';
import { HandIndexThumb } from 'react-bootstrap-icons'
import { Button, Col, Container, Row, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultTemplate from '../templates/DefaultTemplate';
import '../styles/detailMovie.css'
const BookingScreen = () => {
  const { mid } = useParams()
  const navigate = useNavigate('')
  const [showtime, setShowtime] = useState([])
  const [movie, setMovie] = useState({})
  const [click, setClick] = useState(true)
  useEffect(() => {
    fetch('http://localhost:9999/movies/' + mid)
      .then(res => res.json())
      .then(data => setMovie(data))
  }, [mid])
  const handleClick = (e) => {
    setClick(e.target.innerText === "Detail" ? true : false)
  }
  useEffect(() => {
    fetch('http://localhost:9999/showdates?movieId=' + mid)
      .then(res => res.json())
      .then(data => setShowtime(data))
  }, [mid])
  const handleClickBuyTicket = (e) => {
    if (JSON.parse(localStorage.getItem('customer')) === null) {
      localStorage.setItem('login_yet', 'login_yet')
      navigate('/login')
    } else {
      if (showtime.length !== 0) {
        navigate('/booking/' + mid)
      }
    }
  }
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
            <Container id={'container_movie_detail'}>
              <Row>
                <Col xs={3}>
                  <img className='img_movie_detail' src={movie.movieImage} alt={movie.id} />
                </Col>
                <Col xs={9}>
                  <Row style={{ borderBottom: '2px solid #CCC' }}>
                    <Col xs={12}><h2>{movie.movieName}</h2></Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Table>
                        <tbody>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Actor:</td>
                            <td>{movie.actor}</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Director:</td>
                            <td>{movie.director}</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Category:</td>
                            <td>{movie.category}</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Duration:</td>
                            <td>{movie.duration} phút</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Director:</td>
                            <td>{movie.director}</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>ReleaseDate:</td>
                            <td>{movie.releaseDate}</td>
                          </tr>
                          <tr className='table_movie_detail'>
                            <td className='table_title_movie_detail'>Price:</td>
                            <td>{movie.price}$</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col>
                      <Button className={showtime.length === 0 ? 'd-none' : 'btn-danger'} onClick={(e) => handleClickBuyTicket(e)}>Buy Ticket</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className='p-3'>
                <Col xs={12} className={'d-flex justify-content-center'}>
                  <ul className='movie_detail_trailer text-center d-flex justify-content-center'>
                    <li className='movie_detail_1'><span onClick={(e) => handleClick(e)}>Detail{click ? <HandIndexThumb size={20} className={'pb-1'} /> : ''}</span></li>
                    <li className='movie_detail_2'><span onClick={(e) => handleClick(e)}>Trailer{click ? '' : <HandIndexThumb size={20} className={'pb-1'} />}</span></li>
                  </ul>
                </Col>
              </Row>
              <Row className='pt-2 pb-4'>
                <Col xs={12} id={'movie_description'} className={click ? '' : 'd-none'}>
                  <span>{movie.description}Keep in mind that the filter property may not be supported in older browsers or certain versions of some browsers. It's a good practice to test your code across different browsers to ensure compatibility.</span>
                </Col>
                <Col xs={12} id={'movie_trailer'} className={click ? 'd-flex justify-content-center d-none' : 'd-flex justify-content-center'}>
                  <iframe width="560" height="315" src="https://www.youtube.com/embed/shW9i6k8cB0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
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
