import React, { useState, useEffect } from 'react';

const ShowSeat = () => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('http://localhost:9999/seats?screen_id=1');
        const data = await response.json();
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    fetchSeats();
  }, []);

  const renderSeats = () => {
    // Group seats by row
    const seatsByRow = {};
    seats.forEach((seat) => {
      if (!seatsByRow[seat.row_id]) {
        seatsByRow[seat.row_id] = [];
      }
      seatsByRow[seat.row_id].push(seat);
    });

    // Sort seats within each row
    Object.values(seatsByRow).forEach((rowSeats) => {
      rowSeats.sort((a, b) => a.seat_number - b.seat_number);
    });

    // Render seats
    return Object.entries(seatsByRow).map(([rowId, rowSeats]) => (
      <div key={rowId} className="row">
        <span className="row-label">Row {rowId}</span>
        {rowSeats.map((seat) => (
          <span
            key={seat.id}
            className={`seat ${seat.status}`}
            style={{
              backgroundColor: seat.class === 'Economy' ? 'gray' : seat.class === 'VIP' ? 'orange' : 'white',
              textDecoration: seat.status === 'unavailable' ? 'line-through' : 'none',
            }}
          >
            {seat.status !== 'unavailable' && seat.seat_number}
          </span>
        ))}
      </div>
    ));
  };

  return (
    <div className="show-seat">
      <h2>Seats</h2>
      <div className="seat-container">{renderSeats()}</div>
    </div>
  );
};

export default ShowSeat;
