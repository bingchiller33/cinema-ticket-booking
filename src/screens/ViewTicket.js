import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FileEarmark, FileEarmarkExcelFill, FileEarmarkFill } from "react-bootstrap-icons/dist";
import { useParams } from "react-router-dom";
import DefaultTemplate from "../templates/DefaultTemplate";

const ViewTiket = () => {
    const { mid } = useParams()
    const checkSeats = JSON.parse(sessionStorage.getItem('checkSeats'))
    const customer = JSON.parse(localStorage.getItem('customer'))
    const time = JSON.parse(sessionStorage.getItem('time'))
    const date = JSON.parse(sessionStorage.getItem('date'))
    const [movie, setMovie] = useState({})
    const [seats, setSeats] = useState([])
    const [seatName, setSeatName] = useState('')
    const [showtime, setShowTime] = useState(time)
    useEffect(() => {
        fetch('http://localhost:9999/movies/' + mid)
            .then(res => res.json())
            .then(data => setMovie(data))
    }, [mid])

    useEffect(() => {
        fetch('http://localhost:9999/seats?roomId=' + showtime.roomId)
            .then(res => res.json())
            .then(data => setSeats(data))
    }, [showtime])

    checkSeats.map(checkSeat => {
        return seats.map(seat => {
            if (checkSeat === seat.id) {
                seat.booked = 'booked'
            }
            return seat
        })
    })
    useEffect(() => {
        let name = ''
        let count = 0
        checkSeats.map(checkSeat => {
            return seats.map((seat) => {
                if (checkSeat === seat.id) {
                    if (count < checkSeats.length - 1) {
                        name += `${seat.row_id}${seat.seat_number}, `
                    } else if (count < checkSeats.length) {
                        name += `${seat.row_id}${seat.seat_number}`
                    }
                    count += 1
                }
            })
        })
        setSeatName(name)
    }, [checkSeats, seats])
    let total = checkSeats.reduce((current, checkSeat) => {
        seats.forEach((seat) => {
            if (seat.id === checkSeat && seat.class === 'Economy') {
                current += movie.price
            }
            if (seat.id === checkSeat && seat.class === 'VIP') {
                current += (movie.price + 5)
            }
        })
        return current
    }, 0)
    const handleClickPaying = () => {
        let ticket
        checkSeats.forEach(checkSeat => {
            seats.forEach((seat) => {
                if (seat.id === checkSeat && seat.class === 'Economy') {
                    ticket = {
                        customerId: customer.id,
                        movieId: parseInt(mid),
                        roomId: time.roomId,
                        seatId: checkSeat,
                        showDateId: date.id,
                        showtimesId: time.id,
                        price: movie.price
                    }
                }
                if (seat.id === checkSeat && seat.class === 'VIP') {
                    ticket = {
                        customerId: customer.id,
                        movieId: parseInt(mid),
                        roomId: time.roomId,
                        seatId: checkSeat,
                        showDateId: date.id,
                        showtimesId: time.id,
                        price: movie.price + 5
                    }
                }
            })
            try {
                fetch('http://localhost:9999/tickets', {
                    method: 'POST',
                    body: JSON.stringify(ticket),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    }
                })
            } catch (error) {
                console.error('Get error', error);
            }
        })
    }
    return (
        <DefaultTemplate>
            <Container>
                <Row className="pt-5 pb-5">
                    <Col xs={6} className="pt-4">
                        <Container id={'container_movie_detail'}>
                            <Row className="pt-5">
                                <Col xs={4}>
                                    <img className='img_movie_detail' src={movie.movieImage} alt={movie.id} />
                                </Col>
                                <Col xs={8}>
                                    <Row style={{ borderBottom: '2px solid #CCC' }}>
                                        <Col xs={12}><h2>{movie.movieName}</h2></Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Table>
                                                <tbody>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Actor:</td>
                                                        <td>{movie.actor}</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Director:</td>
                                                        <td>{movie.director}</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Category:</td>
                                                        <td>{movie.category}</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Duration:</td>
                                                        <td>{movie.duration} phút</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Director:</td>
                                                        <td>{movie.director}</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>ReleaseDate:</td>
                                                        <td>{movie.releaseDate}</td>
                                                    </tr>
                                                    <tr className='table_movie_detail'>
                                                        <td className='table_title_movie_detail'>Price:</td>
                                                        <td>{movie.price}$</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </Col>
                                <Row className={'d-flex justify-content-center'}>
                                    <Col xs={12} >
                                        <Table>
                                            <tbody>
                                                <tr className="">
                                                    <td>Quantity ticket</td>
                                                    <td>:</td>
                                                    <td className="d-flex justify-content-end">{checkSeats.length}</td>
                                                </tr>
                                                <tr className="">
                                                    <td>Seat name</td>
                                                    <td>:</td>
                                                    <td className="d-flex justify-content-end">{seatName}</td>
                                                </tr>
                                                <tr className="">
                                                    <td>Total price</td>
                                                    <td>:</td>
                                                    <td className="d-flex justify-content-end">
                                                        {total}$
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Form> 
                                    <Form.Group controlId="cardNumber">
                                        <Form.Label>Card Number:</Form.Label>
                                        <Form.Control type="text" placeholder="Enter card number" />
                                    </Form.Group>
                                    <Form.Group controlId="cardDetails">
                                        <Form.Label>Card Expired:</Form.Label>
                                        <Row>
                                        <Col xs={9}>
                                            <Form.Control type="text" placeholder="MM/YY" />
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Control type="text" placeholder="CVV" />
                                        </Col>
                                        </Row>
                                    </Form.Group>
                                <Row className="pt-3 pb-3 text-center">
                                    <Col xs={12}>
                                        <Button className="btn_payment btn-danger text-light" onClick={() => handleClickPaying()}>Pay</Button>
                                    </Col>
                                </Row>
                                </Form>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <Row className={seats.length === 0 ? "d-none" : "pb-5 d-flex justify-content-center"}>
                            <Col xs={5} className="text-center border-5 border-danger border-bottom screen_room_area">
                                <h4 className="bold">Screen</h4>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center">
                            <Col xs={1} style={{ width: '10px' }} className={seats.length === 0 ? "d-none" : ""}>
                                <ul className=" list_character_seats">
                                    <li className="list_character_seats_item">A</li>
                                    <li className="list_character_seats_item">B</li>
                                    <li className="list_character_seats_item">C</li>
                                    <li className="list_character_seats_item">D</li>
                                    <li className="list_character_seats_item">E</li>
                                    <li className="list_character_seats_item">F</li>
                                </ul>
                            </Col>
                            <Col xs={6} className={'d-flex justify-content-center flex-wrap'} style={{ width: '450px' }}>
                                {
                                    seats.map((s) => (
                                        <Form.Group key={s.id}>
                                            <>
                                                <Form.Label htmlFor={s.id}>
                                                    {s.status === 'available' && s.booked === 'book' ? s.class === 'Economy'
                                                        ? <FileEarmark size={40} title={s.row_id + s.seat_number} /> : <FileEarmarkFill size={40} color={'gold'} title={s.row_id + s.seat_number} />
                                                        : <FileEarmarkExcelFill size={40} color={s.booked === 'book' ? '' : 'black'} title={s.row_id + s.seat_number} />}
                                                    <Form.Check id={s.id}
                                                        disabled={s.booked === 'booked' ? true : false}
                                                        className='d-none'
                                                        checked={checkSeats.length === 0 ? false : null}
                                                    />
                                                </Form.Label>
                                            </>

                                        </Form.Group>
                                    ))
                                }
                            </Col>
                        </Row>
                        <Row className={seats.length === 0 ? "d-none" : "pb-5 d-flex justify-content-center"}>
                            <Col xs={12}>
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
                        <Row className={seats.length === 0 ? "d-none" : "pb-3 d-flex justify-content-center"}>
                            <Col xs={8}>
                                <ul className="d-flex justify-content-center list_signature">
                                    <li className="signature_item"><FileEarmark size={40} /> Empty</li>
                                    <li className="signature_item"><FileEarmarkFill size={40} color={'gold'} /> VIP</li>
                                    <li className="signature_item"><FileEarmarkExcelFill size={40} color={'black'} /> Your choice</li>
                                </ul>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </DefaultTemplate>
    );
}

export default ViewTiket;