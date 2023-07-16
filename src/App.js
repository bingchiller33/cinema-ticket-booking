import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import HomeScreen from "./screens/HomeScreen";
import MoviesScreen from "./screens/MoviesScreen";
<<<<<<< HEAD
import BookingScreen from "./screens/BookingScreen";
import CreateMovie from "./screens/CreateMovies";
import EditMovie from "./screens/EditMovie";
import ListMovie from "./screens/ListMovie";
=======
import DetailScreen from "./screens/DetailScreen"
import 'react-toastify/dist/ReactToastify.css';
import Login from "./screens/Login";
import Register from "./screens/Register";
import BookingScreen from "./screens/BookingScreen";  
import ManageShowtimes from "./screens/ManageShowtimes";
import ViewTiket from "./screens/ViewTicket";
>>>>>>> 10326a13800c80d1d1e04ac1b6d559783008c94d


function App() { 
  const loginTime = localStorage.getItem('loginTime');

  if (loginTime) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - loginTime;
    const sessionDuration = 60 * 60 * 1000; // 1 giờ
    if (elapsedTime > sessionDuration) {
      localStorage.removeItem('customer');
    } else {
      localStorage.setItem('loginTime', currentTime);
    }
  } else {

    localStorage.removeItem('customer');
  }
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/movies" element={<MoviesScreen />} />
<<<<<<< HEAD
          <Route path="/booking" element={<BookingScreen />} />
          <Route path="/crud" element={<ListMovie />} />
          <Route path="/create" element={<CreateMovie />} />
          <Route path="/edit/:mid" element={<EditMovie />} />
=======
          <Route path="/booking/:mid" element={<BookingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail/:mid" element={<DetailScreen />} /> 
          <Route path="/showtimes" element={<ManageShowtimes />} />
          <Route path="/viewticket/:mid" element={<ViewTiket />} />
>>>>>>> 10326a13800c80d1d1e04ac1b6d559783008c94d
        </Routes>
    </BrowserRouter>
  );
}

export default App;
