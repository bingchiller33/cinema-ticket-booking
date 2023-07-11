import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import HomeScreen from "./screens/HomeScreen";
import MoviesScreen from "./screens/MoviesScreen";
import BookingScreen from "./screens/BookingScreen"; 
import 'react-toastify/dist/ReactToastify.css';
import Login from "./screens/Login";
import Register from "./screens/Register";


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
          <Route path="/booking" element={<BookingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
