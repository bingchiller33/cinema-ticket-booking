import React, { useEffect, useState } from "react";
import { Card, Carousel, Col, Row } from "react-bootstrap";
import "../../styles/carousel.css";
import axios from "axios";
import { Link } from "react-router-dom";

const CarouselComponent = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/movies")
      .then((response) => {
        const moviesData = response.data;
        const sortedMovies = moviesData.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        );
        const newestMovies = sortedMovies.slice(0, 3);
        setMovies(newestMovies);
      })
      .catch((error) => {
        console.error("Error fetching movies", error);
      });
  }, []);

  return (
    <Carousel
      interval={3000}
      pause="hover"
      className="card-slider"
      controls={false}
      indicators={false}
    >
      {movies.map((card) => (
        <Carousel.Item key={card.movieId}>
          <Card>
            <Card.Img
              variant="top"
              src={card.movieBanner}
              alt="Card Image"
              style={{ height: "600px" }}
            />
            <Card.Body>
              <Row>
                <Col xs={8}>
                  <Row>
                    <Col xs={4}>
                      <Card.Title>Title</Card.Title>
                      <Card.Text>{card.movieName}</Card.Text>
                    </Col>
                    <Col xs={2}>
                      <Card.Title>Release Date</Card.Title>
                      <Card.Text>{card.releaseDate}</Card.Text>
                    </Col>
                    <Col xs={2}>
                      <Card.Title>Director</Card.Title>
                      <Card.Text>{card.director}</Card.Text>
                    </Col>
                  </Row>
                </Col>
                <Col xs={4}>
                  <Row>
                    <Col xs={12}>
                      <Card.Text>
                        <Link to="/movies">Click here for more details!</Link>
                      </Card.Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselComponent;
