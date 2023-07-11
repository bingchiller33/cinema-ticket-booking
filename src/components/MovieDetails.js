import React, { useState, useEffect } from 'react';
import ListShowtimes from './ListShowtimes';

export default function MovieDetails() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

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

  const handleDeleteShowtime = async (showtimeId) => {
    try {
      const updatedShowtimes = selectedMovie.showtimes.filter(
        (showtime) => showtime.id !== showtimeId
      );
      const updatedMovie = { ...selectedMovie, showtimes: updatedShowtimes };
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
            <>
              <h3>Showtimes:</h3>
              {selectedMovie.showtimes.length > 0 ? (
                <ListShowtimes
                  showtimes={selectedMovie.showtimes}
                  onUpdateShowtimes={handleUpdateShowtimes}
                  onDeleteShowtime={handleDeleteShowtime}
                />
              ) : (
                <p>No showtimes available</p>
              )}
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
