import React from 'react';
import Header from '../components/common/HeaderAdmin';
import Footer from '../components/common/Footer';
import { Container } from 'react-bootstrap';
import "../styles/showtimes.css"

const Ordered = () => {
  return (
    <div>
      <Header/>
      <Container className='text-center'>
        <div style={{ margin: '250px 0 250px 0' }}>
          <h1>Thank You for Booking!</h1>
          <p>Your ticket has been successfully booked.</p>
          <p>Thank you for choosing our cinema.</p>
        </div>
      </Container>
      <Footer/>
    </div>
  );
};

export default Ordered;
