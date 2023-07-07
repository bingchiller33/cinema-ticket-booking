import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Container } from "react-bootstrap";

const DefaultTemplate = ({ children }) => {
  return (
    <div>
      <Header /> 
      <Container>
      <main>{children}</main> 
      </Container>
      <Footer />
    </div>
  );
};
export default DefaultTemplate;
