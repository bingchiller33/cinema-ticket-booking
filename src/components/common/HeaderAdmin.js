import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "../../styles/Header.css";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in by retrieving data from localStorage
    const userData = localStorage.getItem("customer");
    if (userData) {
      setLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setLoggedIn(false);
    setUser(null);
  };

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

        <Navbar.Toggle aria-controls="navbar-nav" />

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
              to="/showtimes"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Showtimes
            </NavLink>
          </Nav>
        </Navbar.Collapse>

        {loggedIn && user && (
          <Navbar.Collapse style={{ justifyContent: "right" }}>
            <Nav>
              <NavDropdown title={user.username} id="user-dropdown">
                {user.role === 3 && (
                  <NavDropdown.Item>
                    <Link
                      to={"/showtimes"}
                      style={{ textDecoration: "none", color: "#333" }}
                    >
                      Manage Showtimes
                    </Link>
                  </NavDropdown.Item>
                )}
                {user.role === 3 && (
                  <NavDropdown.Item>
                    <Link
                      to={"/manageseats"}
                      style={{ textDecoration: "none", color: "#333" }}
                    >
                      Manage Seats
                    </Link>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}

        {!loggedIn && (
          <Navbar.Collapse style={{ justifyContent: "right" }}>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active-link" : "link")}
            >
              Login
            </NavLink>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
