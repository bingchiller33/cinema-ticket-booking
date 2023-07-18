import React from "react";
import { toast } from 'react-toastify';
import CarouselComponent from "../components/common/CarouselComponent";
import CardComponent from "../components/common/CardComponent";
import DefaultTemplate from "../templates/DefaultTemplate";
const HomeScreen = () => { 
  if (localStorage.getItem('login_success')) {
    toast.success('You have successfully logged in, please experience our service.')
    localStorage.removeItem('login_success')
  }
  return (
    <DefaultTemplate>
      <CarouselComponent />
      <CardComponent heading={"Currently Premiere"}/> 
    </DefaultTemplate>
  );
};

export default HomeScreen;
