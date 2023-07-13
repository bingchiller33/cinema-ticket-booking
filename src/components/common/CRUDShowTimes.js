import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Modal, Form } from "react-bootstrap";
import "../../styles/showtimes.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CRUDShowTimes() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDates, setShowDates] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("nowShowing");
  const [editedShowtime, setEditedShowtime] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const fetchMoviesAndShowtimes = async () => {
      try {
        const responseMovies = await fetch("http://localhost:9999/movies");
        const dataMovies = await responseMovies.json();

        const responseShowDates = await fetch("http://localhost:9999/showdates");
        const dataShowDates = await responseShowDates.json();

        const responseShowtimes = await fetch("http://localhost:9999/showtimes");
        const dataShowtimes = await responseShowtimes.json();

        setMovies(dataMovies);
        setShowDates(dataShowDates);
        setShowtimes(dataShowtimes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMoviesAndShowtimes();
  }, []);

  const handleShowModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setEditedShowtime(null);
  };

  const handleShowtimeChange = (showtimeId, newTime, dateId) => {
    setEditedShowtime({ showtimeId, newTime, dateId });
  };

  const handleSaveTime = async () => {
    if (!editedShowtime) return;

    try {
      const response = await fetch(`http://localhost:9999/showtimes/${editedShowtime.showtimeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: editedShowtime.newTime, dateId: editedShowtime.dateId }),
      });
      if (!response.ok) throw new Error("Failed to update showtime");

      const updatedShowtime = await response.json();
      setShowtimes(showtimes.map((showtime) => (showtime.id === updatedShowtime.id ? updatedShowtime : showtime)));
      setEditedShowtime(null);
      toast.success("Update showtime successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteTime = async (showtimeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this showtime?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:9999/showtimes/${showtimeId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete showtime");

      setShowtimes(showtimes.filter((showtime) => showtime.id !== showtimeId));
      toast.success("Delete showtime successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddTime = async () => {
    if (!selectedMovie || !newDate || !newTime) return;

    let showDate = showDates.find(
      (showDate) => showDate.movieId === selectedMovie.id && showDate.date === newDate
    );

    if (!showDate) {
      try {
        const [day, month, year] = newDate.split("-").map(Number);
        const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const response = await fetch("http://localhost:9999/showdates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId: selectedMovie.id, date: formattedDate }),
        });
        if (!response.ok) throw new Error("Failed to add new showdate");

        showDate = await response.json();
        setShowDates([...showDates, showDate]);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    const existingShowtime = showtimes.find(
      (showtime) => showtime.dateId === showDate.id && showtime.time === newTime
    );
    if (existingShowtime) {
      toast.error("Showtime already exists for the selected showdate.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/showtimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateId: showDate.id, time: newTime }),
      });
      if (!response.ok) throw new Error("Failed to add new showtime");

      const newShowtime = await response.json();
      setShowtimes([...showtimes, newShowtime]);
      toast.success("Add showtime successfully!");
    } catch (error) {
      console.log(error);
    }

    setNewTime("");
  };

  const filteredMovies = movies.filter((movie) => {
    const [day, month, year] = movie.releaseDate.split("-").map(Number);
    const releaseDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    if (currentTab === "nowShowing") {
      return releaseDate <= currentDate;
    } else {
      return releaseDate > currentDate;
    }
  });

  const groupShowtimesByDate = (showtimes) => {
    return showtimes.reduce((grouped, showtime) => {
      const date = showDates.find((showDate) => showDate.id === showtime.dateId).date;
      if (grouped[date]) {
        grouped[date].push(showtime);
      } else {
        grouped[date] = [showtime];
      }
      return grouped;
    }, {});
  };

  return (
    <div className="main">
      <div className="movie-select">
        <div className="movie-select-top my-3">
          <Container className="text-center">
            <Button
              variant="primary"
              onClick={() => setCurrentTab("nowShowing")}
              className={currentTab === "nowShowing" ? "active" : ""}
            >
              Now Showing
            </Button>{" "}
            <Button
              variant="primary"
              onClick={() => setCurrentTab("comingSoon")}
              className={currentTab === "comingSoon" ? "active" : ""}
            >
              Coming Soon
            </Button>
          </Container>
        </div>
        <div className="movie-select-main">
          <Container>
            <Row>
              {filteredMovies.map((movie) => (
                <Col xs={3} key={movie.id}>
                  <div className="movie-select-item" onClick={() => handleShowModal(movie)}>
                    <div className="movie-select-img" style={{ backgroundImage: `url(${movie.movieImage})` }}></div>
                    <div className="movie-select-content">
                      <h3 className="movie-select-title">{movie.movieName}</h3>
                      <p>Premiere: {movie.releaseDate}</p>
                      <p>Duration: {movie.duration} minutes</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Showtimes for {selectedMovie?.movieName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </Form.Group>
            <Button className="my-2" onClick={handleAddTime}>
              Add time
            </Button>
          </Form>
          {selectedMovie &&
            Object.entries(groupShowtimesByDate(showtimes.filter((showtime) => showDates.find((showDate) => showDate.id === showtime.dateId && showDate.movieId === selectedMovie.id))))
              .sort((a, b) => {
                const dateA = a[0].split("-").reverse().join("");
                const dateB = b[0].split("-").reverse().join("");
                return dateA.localeCompare(dateB);
              })
              .map(([date, dateShowtimes]) => (
                <div key={date}>
                  <h5>{date}</h5>
                  {dateShowtimes.map((showtime) => (
                    <Form.Group key={showtime.id}>
                      {editedShowtime?.showtimeId === showtime.id ? (
                        <>
                          <Form.Control type="time" value={editedShowtime?.newTime} onChange={(e) => handleShowtimeChange(showtime.id, e.target.value, showtime.dateId)} />
                          <Button onClick={handleSaveTime}>Save</Button>
                          <Button onClick={() => setEditedShowtime(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Form.Label>{showtime.time}</Form.Label>
                          <Button
                            variant="success"
                            className="mx-2 my-2"
                            onClick={() => handleShowtimeChange(showtime.id, showtime.time, showtime.dateId)}
                          >
                            Edit
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteTime(showtime.id)}>
                            Delete
                          </Button>
                        </>
                      )}
                    </Form.Group>
                  ))}
                </div>
              ))}
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
