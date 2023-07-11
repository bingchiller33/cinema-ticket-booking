  import { useState, useEffect } from "react";
  import { Container, Button, Row, Col, Modal, Form } from "react-bootstrap";
  import "../../styles/showtimes.css"

  // Hàm định dạng ngày dạng d-m-y
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to convert time strings to Date objects
  const convertToDateTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes);
  };

  export default function CRUDShowTimes() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentTab, setCurrentTab] = useState("nowShowing");
    const [editedShowtimes, setEditedShowtimes] = useState([]);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch('http://localhost:9999/movies');
          const data = await response.json();
          setMovies(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMovies();
    }, []);

    const handleShowModal = (movie) => {
      setSelectedMovie(movie);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedMovie(null);
      setEditedShowtimes([]);
    };

    const handleShowtimeChange = (showtimeIndex, timeIndex, editedTime) => {
      setEditedShowtimes((prevState) => {
        const newState = [...prevState];
        newState[showtimeIndex] = { timeIndex, editedTime };
        return newState;
      });
    };

    const handleSaveTime = async (showtimeIndex) => {
      const updatedShowtimes = selectedMovie.showtimes.map((showtime, index) => {
        if (index === showtimeIndex) {
          const newTimes = showtime.times.map((time, timeIndex) => {
            if (editedShowtimes[showtimeIndex]?.timeIndex === timeIndex) {
              return editedShowtimes[showtimeIndex]?.editedTime;
            }
            return time;
          });
          return {
            ...showtime,
            times: newTimes,
          };
        }
        return showtime;
      });
      await handleUpdateShowtimes(updatedShowtimes);
      setEditedShowtimes([]);
    };

    const handleCancelEdit = (showtimeIndex) => {
      setEditedShowtimes((prevState) => {
        const newState = [...prevState];
        delete newState[showtimeIndex];
        return newState;
      });
    };

    const handleDeleteTime = async (showtimeIndex, timeIndex) => {
      const updatedShowtimes = selectedMovie.showtimes.map((showtime, index) => {
        if (index === showtimeIndex) {
          const newTimes = showtime.times.filter((time, index) => index !== timeIndex);
          return {
            ...showtime,
            times: newTimes,
          };
        }
        return showtime;
      });
      const filteredShowtimes = updatedShowtimes.filter(showtime => showtime.times.length > 0); // Filter out showtimes with no times
      await handleUpdateShowtimes(filteredShowtimes);
      setEditedShowtimes([]);
    };

    const handleAddTime = async () => {
      const updatedShowtimes = selectedMovie.showtimes.map((showtime) => {
        if (showtime.date === newDate) {
          return {
            ...showtime,
            times: [...showtime.times, newTime],
          };
        }
        return showtime;
      });
      await handleUpdateShowtimes(updatedShowtimes);
      setNewTime('');
    };

    const handleUpdateShowtimes = async (showtimes) => {
      try {
        const updatedMovie = { ...selectedMovie, showtimes };
        await fetch(`http://localhost:9999/movies/${selectedMovie.movieId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedMovie),
        }); 
        setSelectedMovie(updatedMovie);
        setMovies(movies.map(movie => movie.movieId === updatedMovie.movieId ? updatedMovie : movie)); // Update the movies state
      } catch (error) {
        console.log(error);
      }
    };

    // Lọc danh sách phim theo loại (Phim Đang Chiếu hoặc Phim Sắp Chiếu)
    const filteredMovies = movies.filter((movie) => {
      const releaseDate = new Date(movie.releaseDate);
      const currentDate = new Date();

      if (currentTab === "nowShowing") {
        return releaseDate <= currentDate;
      } else {
        return releaseDate > currentDate;
      }
    });

    return (
      <div className="main">
        <div className="movie-select">
          <div className="movie-select-top my-3">
            <Container className="text-center">
              <Button
                variant="primary"
                onClick={() => setCurrentTab("nowShowing")}
              >
                Now Showing
              </Button>{" "}
              
              <Button
                variant="primary"
                onClick={() => setCurrentTab("comingSoon")}
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
                      <div
                        className="movie-select-img"
                        style={{
                          backgroundImage: `url(${movie.movieImage})`,
                        }}
                      ></div>
                      <div className="movie-select-content">
                        <h3 className="movie-select-title">{movie.movieName}</h3>
                        <p>Premiere: {formatDate(movie.releaseDate)}</p>
                        <p>Duration: {movie.movieTime} minutes</p>
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
              <Button className="my-2" onClick={handleAddTime}>Add time</Button>
            </Form>
            {selectedMovie?.showtimes.map((showtime, showtimeIndex) => (
              <div key={showtimeIndex}>
                <h5>{showtime.date}</h5>
                {showtime.times.map((time, timeIndex) => (
                  <Form.Group key={timeIndex}>
                    {editedShowtimes[showtimeIndex]?.timeIndex === timeIndex ? (
                      <>
                        <Form.Control type="time" value={editedShowtimes[showtimeIndex]?.editedTime} onChange={(e) => handleShowtimeChange(showtimeIndex, timeIndex, e.target.value)} />
                        <Button onClick={() => handleSaveTime(showtimeIndex)}>Save</Button>
                        <Button onClick={() => handleCancelEdit(showtimeIndex)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Form.Label>{time}</Form.Label>
                        <Button variant="success" className="mx-2 my-2" onClick={() => handleShowtimeChange(showtimeIndex, timeIndex, time)}>Edit</Button>
                        <Button variant="success" onClick={() => handleDeleteTime(showtimeIndex, timeIndex)}>Delete</Button>
                      </>
                    )}
                  </Form.Group>
                ))}
              </div>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
