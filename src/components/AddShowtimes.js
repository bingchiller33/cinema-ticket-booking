import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function AddShowtimes() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [date, setDate] = useState('');
  const [times, setTimes] = useState([]);
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9999/movies');
        setMovies(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleMovieChange = (event) => {
    setSelectedMovieId(event.target.value);
  };

  const handleAddTime = () => {
    if (newTime.trim() === '') {
      return;
    }

    setTimes([...times, newTime]);
    setNewTime('');
  };

  const handleRemoveTime = (index) => {
    const updatedTimes = [...times];
    updatedTimes.splice(index, 1);
    setTimes(updatedTimes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedMovie = movies.find((movie) => movie.id === parseInt(selectedMovieId));

    if (!selectedMovie) {
      return;
    }

    const updatedShowtimes = selectedMovie.showtimes
      ? [
          ...selectedMovie.showtimes,
          {
            date,
            times,
          },
        ]
      : [
          {
            date,
            times,
          },
        ];

    const updatedMovie = {
      ...selectedMovie,
      showtimes: updatedShowtimes,
    };

    try {
      await axios.put(`http://localhost:9999/movies/${selectedMovie.id}`, updatedMovie);

      setSelectedMovieId('');
      setDate('');
      setTimes([]);
      setNewTime('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Add Showtimes</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formMovie">
          <Form.Label>Select Movie</Form.Label>
          <Form.Control as="select" value={selectedMovieId} onChange={handleMovieChange}>
            <option value="">Choose...</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.movieName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {selectedMovieId && (
          <div>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Times</Form.Label>
              <div>
                {times.map((time, index) => (
                  <div key={index}>
                    {time}
                    <Button variant="danger" size="sm" onClick={() => handleRemoveTime(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <Form.Control
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
                <Button variant="primary" onClick={handleAddTime}>
                  Add Time
                </Button>
              </div>
            </Form.Group>
            <Button variant="success" type="submit">
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}
