import { Button, Col, Container, Form, Row } from "react-bootstrap";
import DefaultTemplate from "../templates/DefaultTemplate";
import { useEffect, useState } from "react";
import {
  FileEarmark,
  FileEarmarkExcelFill,
  BsPlusSquareDotted,
  FileEarmarkPlus,
} from "react-bootstrap-icons";
import "../styles/booking.css";
import { toast } from "react-toastify";

const ManageSeat = () => {
  const [seats, setSeats] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setselectedRoomId] = useState(1);
  const [selectedRoomCapacity, setSelectedRoomCapacity] = useState(0);
  const [newSeat, setNewSeat] = useState({
    row_id: "A",
    seat_number: 1,
    status: "available",
    booked: "book",
    class: "Economy",
  });
  useEffect(() => {
    fetch(`http://localhost:9999/seats?roomId=${selectedRoomId}`)
      .then((res) => res.json())
      .then((data) => setSeats(data))
      .catch((error) => {
        console.error("Error fetching seats", error);
      });
  }, [selectedRoomId]);

  const handleRoomSelection = (event) => {
    const selectedId = event.target.value;
    setselectedRoomId(selectedId);
  };

  useEffect(() => {
    fetch("http://localhost:9999/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((error) => {
        console.error("Error fetching rooms", error);
      });
  }, []);

  useEffect(() => {
    if (selectedRoomId) {
      fetch(`http://localhost:9999/rooms/${selectedRoomId}`)
        .then((res) => res.json())
        .then((data) => setSelectedRoomCapacity(data.capacity))
        .catch((error) => {
          console.error("Error fetching room capacity", error);
        });
    }
  }, [selectedRoomId]);

  const handleAddSeat = async () => {
    if (newSeat.row_id && selectedRoomId) {
      try {
        // Fetch the seats from the server again to get the latest data
        const response = await fetch(
          `http://localhost:9999/seats?roomId=${selectedRoomId}`
        );
        const data = await response.json();

        if (response.ok) {
          const roomSeats = data.filter(
            (seat) => seat.roomId === selectedRoomId
          );
          if (roomSeats.length >= selectedRoomCapacity) {
            // Room has reached its capacity, display an error message or prevent seat addition
            toast.error("Room capacity reached. Cannot add more seats.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            return;
          }

          setSeats(data);

          const { row_id, seat_number } = calculateNextSeatNumber(data);
          const addResponse = await fetch("http://localhost:9999/seats", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: selectedRoomId,
              row_id,
              seat_number,
              status: newSeat.status,
              booked: newSeat.booked,
              class: newSeat.class,
            }),
          });

          if (addResponse.ok) {
            const addedSeat = await addResponse.json();
            setSeats((prevSeats) => [...prevSeats, addedSeat]);
            setNewSeat((prevState) => ({
              ...prevState,
              row_id,
              seat_number,
            }));
            setSelectedSeatId(null);
          } else {
            console.error("Error adding seat:", addResponse.statusText);
          }
        } else {
          console.error("Error fetching seats:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding seat:", error);
      }
    }
  };

  const [selectedSeatId, setSelectedSeatId] = useState(null);

  const handleSeatClick = (seatId) => {
    setSelectedSeatId(seatId);
  };

  function calculateNextSeatNumber(seatsData) {
    if (seatsData.length > 0) {
      const roomSeats = seatsData.filter(
        (seat) => seat.roomId === selectedRoomId
      );
      if (roomSeats.length > 0) {
        roomSeats.sort((a, b) => {
          const rowComparison = a.row_id.localeCompare(b.row_id);
          if (rowComparison !== 0) {
            return rowComparison;
          }
          return a.seat_number - b.seat_number;
        });

        const lastSeat = roomSeats[roomSeats.length - 1];
        const nextRowCharCode =
          lastSeat.row_id.charCodeAt(0) + Math.floor(lastSeat.seat_number / 10);
        const nextRow = String.fromCharCode(nextRowCharCode);
        const nextSeatNumber = (lastSeat.seat_number % 10) + 1;

        return { row_id: nextRow, seat_number: nextSeatNumber };
      }
    }
    // Start with row A and seat number 1
    return { row_id: "A", seat_number: 1 };
  }

  const handleDeleteSeat = async () => {
    try {
      const response = await fetch(
        `http://localhost:9999/seats/${selectedSeatId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setSeats((prevSeats) =>
          prevSeats.filter((seat) => seat.id !== selectedSeatId)
        );
        setSelectedSeatId(null);
      } else {
        console.error("Error deleting seat:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting seat:", error);
    }
  };

  const handleSeatClassChange = async (event) => {
    const { value } = event.target;

    if (selectedSeatId) {
      try {
        const updatedSeat = seats.find((seat) => seat.id === selectedSeatId);
        updatedSeat.class = value;

        const response = await fetch(
          `http://localhost:9999/seats/${selectedSeatId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSeat),
          }
        );

        if (response.ok) {
          const updatedSeatData = await response.json();
          setSeats((prevSeats) =>
            prevSeats.map((seat) =>
              seat.id === selectedSeatId ? updatedSeatData : seat
            )
          );
        } else {
          console.error("Error updating seat:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating seat:", error);
      }
    }
  };

  return (
    <DefaultTemplate>
      <Row>
        <Col>
          <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
            Seat Management
          </h1>
        </Col>
      </Row>
      <Row style={{ justifyContent: "center", margin: "30px" }}>
        <Col xs={6}>
          <select onChange={handleRoomSelection}>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomName}
              </option>
            ))}
          </select>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center">
        <Col
          xs={1}
          style={{ width: "10px" }}
          className={seats.length === 0 ? "d-none" : ""}
        >
          <ul className="list_character_seats">
            {seats.map((s, index) =>
              index === 0 || s.row_id !== seats[index - 1].row_id ? (
                <li key={s.row_id} className="list_character_seats_item">
                  {s.row_id}
                </li>
              ) : null
            )}
          </ul>
        </Col>
        <Col
          xs={6}
          className={"d-flex flex-wrap"}
          style={{ marginLeft: "20px", width: "450px" }}
        >
          {seats.map((s, index) => (
            <div
              key={s.id}
              className="seat-item"
              onClick={() => handleSeatClick(s.id)}
            >
              <Form.Group>
                <Form.Label htmlFor={s.id}>
                  {s.status === "available" && s.booked === "book" ? (
                    s.class === "Economy" ? (
                      <FileEarmark size={40} title={s.row_id + s.seat_number} />
                    ) : (
                      <FileEarmarkExcelFill
                        size={40}
                        color={"gold"}
                        title={s.row_id + s.seat_number}
                      />
                    )
                  ) : (
                    <FileEarmarkExcelFill
                      size={40}
                      color={s.booked === "book" ? "black" : "gray"}
                      title={s.row_id + s.seat_number}
                    />
                  )}
                  <Form.Check id={s.id} className="d-none" />
                </Form.Label>
                {index === seats.length - 1 && (
                  <FileEarmarkPlus
                    style={{ width: "1.62em", height: "2.5em" }}
                    onClick={handleAddSeat}
                  />
                )}
              </Form.Group>
            </div>
          ))}
          {/* Render plus button after the last seat or when the room is empty */}
          {seats.length === 0 && <FileEarmarkPlus onClick={handleAddSeat} />}
        </Col>
        <Row
          className={
            seats.length === 0 ? "d-none" : "pb-5 d-flex justify-content-center"
          }
        >
          <Col xs={6}>
            <ul className="d-flex justify-content-center list_number_seats">
              <li className="list_number_seats_item">1</li>
              <li className="list_number_seats_item">2</li>
              <li className="list_number_seats_item">3</li>
              <li className="list_number_seats_item">4</li>
              <li className="list_number_seats_item">5</li>
              <li className="list_number_seats_item">6</li>
              <li className="list_number_seats_item">7</li>
              <li className="list_number_seats_item">8</li>
              <li className="list_number_seats_item">9</li>
              <li className="list_number_seats_item">10</li>
            </ul>
          </Col>
        </Row>
      </Row>
      <Row className="bottom-section">
        <Col>
          <Row>
            <Col>
              <div className="seat_info">
                <span>Selected Seat: </span>
                <span style={{ color: "red" }}>
                  {seats.find((seat) => seat.id === selectedSeatId)?.row_id}
                  {
                    seats.find((seat) => seat.id === selectedSeatId)
                      ?.seat_number
                  }
                </span>
              </div>
            </Col>
          </Row>
          <Row style={{ justifyContent: "center" }}>
            <Col xs={3} className="d-flex justify-content-center">
              <h4>Class:  </h4>
              <Form.Select
                value={seats.find((seat) => seat.id === selectedSeatId)?.class}
                onChange={handleSeatClassChange}
                style={{ width: "fit-content" }}
              >
                <option value="Economy">Economy</option>
                <option value="VIP">VIP</option>
              </Form.Select>
            </Col>
            <Col xs={3} className="d-flex justify-content-center">
              <Button
                variant="danger"
                onClick={handleDeleteSeat}
                className="ml-2"
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </DefaultTemplate>
  );
};

export default ManageSeat;
