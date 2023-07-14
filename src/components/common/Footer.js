import React from "react";
import "../../styles/Footer.css";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg={3} xs={6}>
            <ul>
              <li>
                <h1 className="footer_title">Introduction</h1>
                <ul>
                  <li>
                    <Link to="/">About Us</Link>
                  </li>
                  <li>
                    <Link to="/">Terms</Link>
                  </li>
                  <li>
                    <Link to="/">Process Rules</Link>
                  </li>
                  <li>
                    <Link to="/">Security Policies</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </Col>
          <Col lg={3} xs={6}>
            <ul>
              <li>
                <h1 className="footer_title">Movies</h1>
                <ul>
                  <li>
                    <Link to="/">Categories</Link>
                  </li>
                  <li>
                    <Link to="/">Comment</Link>
                  </li>
                  <li>
                    <Link to="/">Blog</Link>
                  </li>
                  <li>
                    <Link to="/">Monthly Movie</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </Col>
          <Col lg={3} xs={6}>
            <ul>
              <li>
                <h1 className="footer_title">Support</h1>
                <ul>
                  <li>
                    <Link to="/">Support</Link>
                  </li>
                  <li>
                    <Link to="/">Sale & Services</Link>
                  </li>
                  <li>
                    <Link to="/">Ticket Price</Link>
                  </li>
                  <li>
                    <Link to="/">Career</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </Col>
          <Col lg={3} xs={6}>
            <ul>
              <li>
                <h1 className="footer_title">Connect to Us</h1>
                <ul>
                  <div className="icon_container">
                    <a href="/">
                      <Facebook />
                    </a>
                    <a href="/">
                      <Youtube />
                    </a>
                    <a href="/">
                      <Instagram />
                    </a>
                  </div>
                </ul>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
