import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import "../../styles/Header.css";
const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>

        <Navbar.Brand as={Link} to="/" className="logo-img">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Square%2C_Inc_-_Square_Logo.jpg/1200px-Square%2C_Inc_-_Square_Logo.jpg"
            alt="Logo"
            height="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Responsive Navbar Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navbar Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Movies
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Poster
            </NavLink>
            {/* Logo */}
            {/* Add more links as needed */}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse style={{ justifyContent: 'right' }}>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : "link")}
          >
            Login
          </NavLink>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
