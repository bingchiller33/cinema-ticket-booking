import React from 'react';
import CRUDShowTimes from '../components/common/CRUDShowTimes';
import HeaderAdmin from '../components/common/HeaderAdmin';
import Footer from '../components/common/Footer';


const ManageShowtimes = () => {
  return (
    <div>
        <HeaderAdmin/>
        <CRUDShowTimes/>
        <Footer/>
    </div>
  );
};

export default ManageShowtimes;
