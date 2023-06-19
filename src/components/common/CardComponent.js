import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/card.css";
import Slider from "react-slick";
import { Container } from "react-bootstrap";

const CardComponent = () => {
  const [movies, setMovies] = useState([]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
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
        <h1 style={{margin: "30px 0px 30px"}}>Upcoming Premieres</h1>
      <Slider {...settings}>
        {movies.map((item) => (
          <div className="card">
            <div className="card-top">
              <img src={item.movieImage} alt={item.movieName} />
              <h1>{item.movieName}</h1>
            </div>
            <div className="card-bottom">
              <h3>{item.director}</h3>
              <span className="card-last-line">{item.releaseDate}</span>
            </div>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CardComponent;
