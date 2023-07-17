import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DefaultTemplate from "../templates/DefaultTemplate";
import "../styles/booking.css";
import { FileEarmark, FileEarmarkExcelFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";

const BookingScreen = () => {
  const { mid } = useParams();
  const [showDate, setShowDate] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [checkSeats, setCheckseats] = useState([]);
  const [seats, setSeats] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [time, setTime] = useState({});
  const [movie, setMovie] = useState({});
  const [date, setDate] = useState("");
  const customer = JSON.parse(localStorage.getItem("customer"));
  useEffect(() => {
    fetch("http://localhost:9999/showdates?movieId=" + mid)
      .then((res) => res.json())
      .then((data) => setShowDate(data));
  }, []);
  useEffect(() => {
    setCheckseats([]);
    fetch("http://localhost:9999/seats?roomId=" + time.roomId)
      .then((res) => res.json())
      .then((data) => setSeats(data));
  }, [time]);
  useEffect(() => {
    setTime("");
    setCheckseats([]);
    fetch("http://localhost:9999/showtimes?dateId=" + date)
      .then((res) => res.json())
      .then((data) => setShowTimes(data));
  }, [date]);
  useEffect(() => {
    fetch("http://localhost:9999/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data));
  }, []);
  useEffect(() => {
    fetch("http://localhost:9999/movies/" + mid)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, []);
  tickets.map((ticket) => {
    showTimes.map((showTime) => {
      seats.map((seat) => {
        if (
          ticket.seatId === seat.id &&
          showTime.roomId === ticket.roomId &&
          time.id === ticket.showtimesId
        ) {
          seat.booked = "booked";
        }
        return seat;
      });
    });
  });

  let total = checkSeats.reduce((current, checkSeat) => {
    seats.forEach((seat) => {
      if (seat.id === checkSeat && seat.class === "Economy") {
        current += movie.price;
      }
      if (seat.id === checkSeat && seat.class === "VIP") {
        current += movie.price + 5;
      }
    });
    return current;
  }, 0);
  console.log(total);
  const handleOnchangeSeats = (e, id) => {
    let check = e.target.checked;
    let newState = [];
    if (check) {
      setCheckseats([...checkSeats, id]);
      newState = seats.map((seat) => {
        if (seat.id == id) {
          seat.status = "unavailable";
        }
        return seat;
      });
    } else {
      setCheckseats(checkSeats.filter((checkSeat) => checkSeat !== id));
      newState = seats.map((seat) => {
        if (seat.id == id) {
          seat.status = "available";
        }
        return seat;
      });
    }
    setSeats(newState);
  };

  const handleClickConfirm = (e) => {
    let count = 0;
    if (date === "") {
      count += 1;
      toast.warn("You forgot choose the date");
    } else if (time === "") {
      count += 1;
      toast.warn("You forgot choose the time");
    } else if (checkSeats.length === 0) {
      count += 1;
      toast.warn("You forgot choose the seat number");
    }
    if (count === 0) {
      checkSeats.forEach((seat) => {
        let ticket = {
          customerId: customer.id,
          movieId: parseInt(mid),
          roomId: time.roomId,
          seatId: seat,
          showDateId: date,
          showtimesId: time.id,
        };
        // console.log(ticket);
        fetch("http://localhost:9999/tickets", {
          method: "POST",
          body: JSON.stringify(ticket),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
      });
    }
  };
  return (
    <DefaultTemplate>
      <Container>
        <Row className="pt-3 pb-3 ">
          <Col
            xs={12}
            className={
              "pt-3 pb-3 container_date border-4 border-black border-top border-bottom"
            }
          >
            {showDate.map((s) => (
              <p
                key={s.id}
                className={
                  s.id === date ? "data_date border_active" : "data_date"
                }
                onClick={(e) => setDate(s.id)}
              >
                {s.date}
              </p>
            ))}
          </Col>
        </Row>
        <Row className={date ? "pb-3" : "pb-3 d-none"}>
          <Col
            className={
              "container_date pb-3 container_date border-4 border-black border-bottom"
            }
          >
            {showTimes.map((s) => (
              <p
                key={s.id}
                className={
                  s.id === time.id ? "data_date border_active" : "data_date"
                }
                onClick={(e) => setTime(s)}
              >
                {s.time}
              </p>
            ))}
          </Col>
        </Row>
        <Row
          className={
            seats.length === 0 ? "d-none" : "pb-5 d-flex justify-content-center"
          }
        >
          <Col
            xs={3}
            className="text-center border-5 border-danger border-bottom screen_room_area"
          >
            <h4 className="bold">Screen</h4>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col
            xs={1}
            style={{ width: "10px" }}
            className={seats.length === 0 ? "d-none" : ""}
          >
            <ul className=" list_character_seats">
              <li className="list_character_seats_item">A</li>
              <li className="list_character_seats_item">B</li>
              <li className="list_character_seats_item">C</li>
              <li className="list_character_seats_item">D</li>
              <li className="list_character_seats_item">E</li>
              <li className="list_character_seats_item">F</li>
            </ul>
          </Col>
          <Col
            xs={6}
            className={"d-flex justify-content-center flex-wrap"}
            style={{ width: "450px" }}
          >
            {seats.map((s) => (
              <Form.Group key={s.id}>
                <>
                  <Form.Label htmlFor={s.id}>
                    {s.status === "available" && s.booked === "book" ? (
                      s.class === "Economy" ? (
                        <FileEarmark
                          size={40}
                          title={s.row_id + s.seat_number}
                        />
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
                    <Form.Check
                      id={s.id}
                      disabled={s.booked === "booked" ? true : false}
                      onChange={(e) => handleOnchangeSeats(e, s.id)}
                      className="d-none"
                      checked={checkSeats.length === 0 ? false : null}
                    />
                  </Form.Label>
                </>
              </Form.Group>
            ))}
          </Col>
        </Row>
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
        <Row className={"d-flex justify-content-center"}>
          <Col xs={6}>
            <Table>
              <tbody>
                <tr className="">
                  <td>Quantity ticket</td>
                  <td>:</td>
                  <td className="d-flex justify-content-end">
                    {checkSeats.length}
                  </td>
                </tr>
                <tr className="">
                  <td>Total price</td>
                  <td>:</td>
                  <td className="d-flex justify-content-end">{total}$</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="pt-3 pb-5">
          <Col xs={12} className={"text-center"}>
            <Button onClick={(e) => handleClickConfirm(e)}>Confirm</Button>
          </Col>
        </Row>
      </Container>
    </DefaultTemplate>
  );
};

export default BookingScreen;
