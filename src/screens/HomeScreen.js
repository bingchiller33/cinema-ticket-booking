import React from "react";
import { Container } from "react-bootstrap";
import CarouselComponent from "../components/common/CarouselComponent";
import CardComponent from "../components/common/CardComponent";
const HomeScreen = () => {
  return (
    <React.Fragment>
      <CarouselComponent />
      <CardComponent />
    </React.Fragment>
  );
};

export default HomeScreen;
