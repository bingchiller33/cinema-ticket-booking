import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Modal, Form, InputGroup } from "react-bootstrap";
import "../../styles/showtimes.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CRUDShowTimes() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDates, setShowDates] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editedShowtime, setEditedShowtime] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShowDate, setSelectedShowDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:9999/rooms");
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);

  const handleShowModal = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
    setSelectedShowDate(null);
    setSelectedRoom(null);
    setNewTime("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setEditedShowtime(null);
    setSelectedShowDate(null);
    setSelectedRoom(null);
  };

  const handleShowtimeChange = (showtimeId, newTime, roomId, dateId) => {
    console.log("Edited Showtime:", {
      showtimeId,
      newTime,
      roomId,
      dateId,
    });
  
    setEditedShowtime((prevEditedShowtime) => ({
      ...prevEditedShowtime,
      showtimeId,
      newTime,
      roomId,
      dateId,
    }));
  };
  
  


  const handleSaveTime = async () => {
    if (!editedShowtime) return;
  
    try {
      const { showtimeId, newTime, roomId, dateId } = editedShowtime; // Lấy ra roomId và dateId từ editedShowtime
  
      const response = await fetch(`http://localhost:9999/showtimes/${showtimeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time: newTime, roomId, dateId }), // Bao gồm cả roomId và dateId trong body
      });
      if (!response.ok) throw new Error("Failed to update showtime");
  
      const updatedShowtime = await response.json();
      setShowtimes(showtimes.map((showtime) => (showtime.id === updatedShowtime.id ? updatedShowtime : showtime)));
      setEditedShowtime(null);
      toast.success("Showtime updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleDeleteTime = async (showtimeId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this showtime?");
      if (!confirmDelete) return;

      const response = await fetch(`http://localhost:9999/showtimes/${showtimeId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete showtime");

      setShowtimes(showtimes.filter((showtime) => showtime.id !== showtimeId));
      toast.success("Showtime deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMovies = movies.filter((movie) => {
    return movie.movieName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDateSelect = (selectedDateId) => {
    setSelectedShowDate(showDates.find((date) => date.id === selectedDateId));
  };

  const fetchShowtimesByDateId = async (dateId) => {
    try {
      const response = await fetch(`http://localhost:9999/showtimes?dateId=${dateId}`);
      const data = await response.json();
      setShowtimes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedShowDate) {
      fetchShowtimesByDateId(selectedShowDate.id);
    }
  }, [selectedShowDate]);

  const isDuplicateShowDate = (formattedDate) => {
    return showDates.some((showDate) => showDate.movieId === selectedMovie.id && showDate.date === formattedDate);
  };

  const isDuplicateShowtime = () => {
    return showtimes.some(
      (showtime) =>
        showtime.dateId === selectedShowDate.id &&
        showtime.time === newTime &&
        showtime.roomId === selectedRoom.id
    );
  };

  const handleAddShowDate = async () => {
    if (!selectedMovie || !newDate) return;

    try {
      const formattedDate = new Date(newDate).toLocaleDateString("en-GB").split("/").join("-");

      if (isDuplicateShowDate(formattedDate)) {
        toast.error("Show Date already exists for the selected movie.");
        return;
      }

      const response = await fetch("http://localhost:9999/showdates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: selectedMovie.id, date: formattedDate }),
      });
      if (!response.ok) throw new Error("Failed to add new show date");

      const newShowDate = await response.json();
      setShowDates([...showDates, newShowDate]);
      toast.success("Show Date added successfully!");
    } catch (error) {
      console.log(error);
    }

    setNewDate("");
  };

  const handleAddTime = async () => {
    if (!selectedShowDate || !newTime || !selectedRoom) return;

    if (isDuplicateShowtime()) {
      toast.error("Showtime already exists for the selected showdate and room.");
      return;
    }

    try {
      const response = await fetch("http://localhost:9999/showtimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateId: selectedShowDate.id,
          time: newTime,
          roomId: selectedRoom.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to add new showtime");

      const newShowtime = await response.json();
      setShowtimes([...showtimes, newShowtime]);
      toast.success("Showtime added successfully!");
    } catch (error) {
      console.log(error);
    }

    setNewTime("");
    setSelectedRoom(null);
  };
  showtimes.sort((a, b) => {
    if (a.time < b.time) return -1;
    if (a.time > b.time) return 1;
    if (a.roomId < b.roomId) return -1;
    if (a.roomId > b.roomId) return 1;
    return 0;
  });

  return (
    <div className="main">
      <div className="movie-select">
        <div className="movie-select-top my-3">
          <Container className="text-center">
            <InputGroup>
              <Form.Control type="text" placeholder="Search by movie title" value={searchQuery} onChange={handleSearch} />
            </InputGroup>
          </Container>
        </div>
        <div className="movie-select-main">
          <Container>
            <Row>
              {filteredMovies.map((movie) => (
                <Col xs={3} key={movie.id}>
                  <div className="movie-select-item">
                    <div className="movie-select-content">
                      <h3 className="movie-select-title fs-4">{movie.movieName}</h3>
                      <Button onClick={() => handleShowModal(movie)}>Edit</Button>
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
              <Form.Label>Add Show Date</Form.Label>
              <Row>
                <Col>
                  <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </Col>
                <Col>
                  <Button onClick={handleAddShowDate}>Add Show Date</Button>
                </Col>
              </Row>
            </Form.Group>
            {selectedMovie && (
              <>
                <Form.Group>
                  <Form.Label>Select Show Date</Form.Label>
                  <Form.Control as="select" value={selectedShowDate?.id} onChange={(e) => handleDateSelect(Number(e.target.value))}>
                    <option value="">Select Show Date</option>
                    {showDates
                      .filter((showDate) => showDate.movieId === selectedMovie.id)
                      .map((showDate) => (
                        <option key={showDate.id} value={showDate.id}>
                          {showDate.date}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                {selectedShowDate && (
                  <>
                    <Form.Label>Time</Form.Label>
                    {showtimes.map((showtime) => {
                      const room = rooms.find((room) => room.id === showtime.roomId);

                      return (
                        <Form.Group key={showtime.id}>
                          {editedShowtime?.showtimeId === showtime.id ? (
                            <>
                              <Row>
                              <Col>
                                <Form.Control
                                  type="time"
                                  value={editedShowtime?.newTime}
                                  onChange={(e) => handleShowtimeChange(showtime.id, e.target.value, showtime.roomId, showtime.dateId)}
                                />
                              </Col>
                              <Col>
                                <Form.Control
                                  as="select"
                                  value={editedShowtime?.newRoomId}
                                  onChange={(e) => handleShowtimeChange(showtime.id, showtime.time, Number(e.target.value), showtime.dateId)}
                                >
                                  <option value="">Select Room</option>
                                  {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                      {room.roomName}
                                    </option>
                                  ))}
                                </Form.Control>
                              </Col>
                              <Col>
                                  <Button onClick={handleSaveTime}>Save</Button>
                                  <Button onClick={() => setEditedShowtime(null)}>Cancel</Button>
                                </Col>
                              </Row>
                            </>
                          ) : (
                            <>
                              <Row>
                                <Col xs={3} className="text-center mt-2">
                                  <span>{showtime.time}</span>
                                </Col>
                                <Col xs={3} className="text-center mt-2">
                                  {room ? (
                                    <span>{room.roomName}</span>
                                  ) : (
                                    <span>No room assigned</span>
                                  )}
                                </Col>
                                <Col xs={6}>
                                <Button
                                  variant="success"
                                  className="mx-2 my-2"
                                  onClick={() => handleShowtimeChange(showtime.id, showtime.time, showtime.roomId, showtime.dateId)}
                                >
                                  Edit
                                </Button>


                                <Button variant="danger" onClick={() => handleDeleteTime(showtime.id)}>
                                    Delete
                                  </Button>
                                </Col>
                              </Row>
                            </>
                          )}
                        </Form.Group>
                      );
                    })}
                    <Form.Group>
                      <Form.Label>Add Show Time</Form.Label>
                      <Row>
                        <Col>
                          <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                        </Col>
                        <Col>
                          <Form.Control as="select" value={selectedRoom?.id} onChange={(e) => setSelectedRoom(rooms.find((room) => room.id === Number(e.target.value)))}>
                            <option value="">Select Room</option>
                            {rooms.map((room) => (
                              <option key={room.id} value={room.id}>
                                {room.roomName}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                        <Col>
                          <Button onClick={handleAddTime}>Add Time</Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                )}
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
