import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../styles/card.css";
import Slider from "react-slick";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardComponent = ({ apiUrl, heading }) => {
  const [movies, setMovies] = useState([]);
  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          color: "red",
          fontSize: "50px",
          cursor: "pointer",
        }}
        onClick={onClick}
      ></div>
    );
  };

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          color: "blue",
          fontSize: "50px",
          cursor: "pointer",
        }}
        onClick={onClick}
      ></div>
    );
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
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
    <Container style={{ marginBottom: "50px" }}>
      <h1 style={{ margin: "30px 0px 30px" }}>{heading}</h1>
      <Slider {...settings}>
        {movies.map((item) => (
          <div key={item.id} className="card-card">
            <Link  to={"/detail/" + item.id}>
              <div className="card-top">
                <img src={item.movieImage} alt={item.movieName} />
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default CardComponent;
