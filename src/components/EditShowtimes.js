import React, { useState, useEffect } from 'react';

export default function MovieDetails() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [editedShowtimes, setEditedShowtimes] = useState([]);
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

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setEditedShowtimes([]);
  };

  const handleShowtimeChange = (showtimeIndex, timeIndex, editedTime) => {
    setEditedShowtimes((prevState) => {
      const newState = [...prevState];
      newState[showtimeIndex] = { timeIndex, editedTime };
      return newState;
    });
  };

  const handleSaveTime = (showtimeIndex) => {
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
    handleUpdateShowtimes(updatedShowtimes);
    setEditedShowtimes([]);
  };

  const handleCancelEdit = () => {
    setEditedShowtimes([]);
  };

  const handleDeleteTime = (showtimeIndex, timeIndex) => {
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
    handleUpdateShowtimes(updatedShowtimes);
    setEditedShowtimes([]);
  };

  const handleAddTime = () => {
    if (newTime) {
      const updatedShowtimes = selectedMovie.showtimes.map((showtime) => {
        if (showtime.date === selectedDate) {
          return {
            ...showtime,
            times: [...showtime.times, newTime],
          };
        }
        return showtime;
      });
      handleUpdateShowtimes(updatedShowtimes);
      setNewTime('');
    }
  };

  const handleUpdateShowtimes = async (showtimes) => {
    try {
      const updatedMovie = { ...selectedMovie, showtimes };
      await fetch(`http://localhost:9999/movies/${selectedMovie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMovie),
      });
      setSelectedMovie(updatedMovie);
    } catch (error) {
      console.log(error);
    }
  };

  // Helper function to convert time strings to Date objects
  const convertToDateTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes);
  };

  return (
    <div>
      <h2>Movie Details</h2>
      {movies.length > 0 ? (
        <div>
          <h3>Select a movie:</h3>
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <button onClick={() => handleSelectMovie(movie)}>{movie.movieName}</button>
              </li>
            ))}
          </ul>
          {selectedMovie && (
            <div>
              <h3>Select Date</h3>
              <select value={selectedDate} onChange={handleDateChange}>
                <option value="">Choose...</option>
                {selectedMovie.showtimes.map((showtime, index) => (
                  <option key={showtime.date} value={showtime.date}>
                    {showtime.date}
                  </option>
                ))}
              </select>

              {selectedDate && (
              <div>
                <h3>Showtimes for {selectedDate}</h3>
                {selectedMovie.showtimes
                  .filter((showtime) => showtime.date === selectedDate)
                  .map((showtime, showtimeIndex) => {
                    const isEditing = editedShowtimes[showtimeIndex] !== undefined;

                    // Sort times array
                    const sortedTimes = showtime.times.sort((a, b) => {
                      const timeA = convertToDateTime(a);
                      const timeB = convertToDateTime(b);
                      if (timeA < timeB) return -1;
                      if (timeA > timeB) return 1;
                      return 0;
                    });

                    return (
                      <div key={showtime.date}>
                        {sortedTimes.map((time, timeIndex) => (
                          <div key={time}>
                            {isEditing && editedShowtimes[showtimeIndex]?.timeIndex === timeIndex ? (
                              <div>
                                <input
                                  type="time"
                                  value={editedShowtimes[showtimeIndex]?.editedTime || ''}
                                  onChange={(e) => {
                                    const editedTime = e.target.value;
                                    handleShowtimeChange(showtimeIndex, timeIndex, editedTime);
                                  }}
                                />
                                <button onClick={() => handleSaveTime(showtimeIndex)}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                              </div>
                            ) : (
                              <div>
                                {time}
                                <button onClick={() => handleShowtimeChange(showtimeIndex, timeIndex, time)}>Edit</button>
                                <button onClick={() => handleDeleteTime(showtimeIndex, timeIndex)}>Delete</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            )}



              <h3>Add Showtime</h3>
              <div>
                <label>Date:</label>
                <input type="date" value={selectedDate} onChange={handleDateChange} />
              </div>
              <div>
                <label>Time:</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </div>
              <button onClick={handleAddTime}>Add</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
