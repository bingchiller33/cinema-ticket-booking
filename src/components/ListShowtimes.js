// Thêm số rạp vào giờ chiếu
// Thêm ghế đã đặt vào giờ chiếu
// Sửa edit, create theo db đã sửa
import React, { useState } from 'react';

export default function ListShowtimes({ showtimes, onUpdateShowtimes }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [editedShowtimes, setEditedShowtimes] = useState([]);
  const [newTime, setNewTime] = useState('');

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
    const updatedShowtimes = showtimes.map((showtime, index) => {
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
    onUpdateShowtimes(updatedShowtimes);
    setEditedShowtimes([]);
  };

  const handleCancelEdit = () => {
    setEditedShowtimes([]);
  };

  const handleDeleteTime = (showtimeIndex, timeIndex) => {
    const updatedShowtimes = showtimes.map((showtime, index) => {
      if (index === showtimeIndex) {
        const newTimes = showtime.times.filter((time, index) => index !== timeIndex);
        return {
          ...showtime,
          times: newTimes,
        };
      }
      return showtime;
    });
    onUpdateShowtimes(updatedShowtimes);
    setEditedShowtimes([]);
  };
  

  const handleAddTime = () => {
    if (newTime) {
      const updatedShowtimes = showtimes.map((showtime) => {
        if (showtime.date === selectedDate) {
          return {
            ...showtime,
            times: [...showtime.times, newTime],
          };
        }
        return showtime;
      });
      onUpdateShowtimes(updatedShowtimes);
      setNewTime('');
    }
  };

  return (
    <div>
      <h3>Select Date</h3>
      <select value={selectedDate} onChange={handleDateChange}>
        <option value="">Choose...</option>
        {showtimes.map((showtime, index) => (
          <option key={showtime.date} value={showtime.date}>
            {showtime.date}
          </option>
        ))}
      </select>

      {selectedDate && (
        <div>
          <h3>Showtimes for {selectedDate}</h3>
          {showtimes.map((showtime, showtimeIndex) => {
            if (showtime.date === selectedDate) {
              const isEditing = editedShowtimes[showtimeIndex] !== undefined;

              return (
                <div key={showtime.date}>
                  {showtime.times.map((time, timeIndex) => (
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
                          <button onClick={() => handleShowtimeChange(showtimeIndex, timeIndex, time)}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTime(showtimeIndex, timeIndex)}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            }
            return null;
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
  );
}
