import React, { useEffect, useState } from "react";
import { Carousel, Col, Row } from "react-bootstrap";
import "../../styles/carousel.css";
import axios from "axios";

const CarouselComponent = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/movies")
      .then((response) => {
        const moviesData = response.data;
        setMovies(moviesData);
      })
      .catch((error) => {
        console.error("Error fetching movies", error);
      });
  }, []);

  return (
    <div className="carousel-container">
      <Carousel interval={3000} pause="hover" fade>
        {movies.map((movie) => (
          <Carousel.Item style={{ height: "550px" }} key={movie.movieId}>
            <img
              className="carousel-image"
              src={movie.movieBanner}
              alt="First slide"
            />
            <div className="carousel-box">
              <Row>
                <Col xs={8}>
                  <Row>
                    <Col xs={4}>
                      <h2 className="box-title">Title</h2>
                      <h1 className="box-info">{movie.movieName}</h1>
                    </Col>
                    <Col xs={2}>
                      <h2 className="box-title">Release</h2>
                      <h1 className="box-info">{movie.releaseDate}</h1>
                    </Col>
                    <Col xs={2}>
                      <h2 className="box-title">Director</h2>
                      <h1 className="box-info">{movie.director}</h1>
                    </Col>
                  </Row>
                </Col>
                <Col xs={4}>
                  <a className="box-link">Book Now</a>
                </Col>
              </Row>
              {/* Additional content or components */}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
