import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/card.css";
import Slider from "react-slick";
import { Container, Row } from "react-bootstrap";

const CardComponent = ({ apiUrl, heading }) => {
  const [movies, setMovies] = useState([]);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
    <Container>
      <h1 style={{ margin: "30px 0px 30px" }}>{heading}</h1>
      <Slider {...settings}>
        {movies.map((item) => (
          <div className="card-card">
            <div className="card-top">
              <img src={item.movieImage} alt={item.movieName} />
              <h1>{item.movieName}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CardComponent;
