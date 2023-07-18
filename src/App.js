import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import MoviesScreen from "./screens/MoviesScreen";
import DetailScreen from "./screens/DetailScreen";
import "react-toastify/dist/ReactToastify.css";
import Login from "./screens/Login";
import Register from "./screens/Register";
import BookingScreen from "./screens/BookingScreen";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ManageShowtimes from "./screens/ManageShowtimes";
import ManageSeat from "./screens/ManageSeat";
import ViewTiket from "./screens/ViewTicket";
import Ordered from "./screens/Ordered";

function App() {
  const loginTime = localStorage.getItem("loginTime");

  const userData = JSON.parse(localStorage.getItem("customer"));

  if (loginTime) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - loginTime;
    const sessionDuration = 60 * 60 * 1000; // 1 giờ
    if (elapsedTime > sessionDuration) {
      localStorage.removeItem("customer");
    } else {
      localStorage.setItem("loginTime", currentTime);
    }
  } else {
    localStorage.removeItem("customer");
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/movies" element={<MoviesScreen />} />
        <Route path="/booking/:mid" element={<BookingScreen />} />
        <Route
          element={<ProtectedRoute redirectPath="/" isAllowed={!userData} />}
        >
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/detail/:mid" element={<DetailScreen />} />
        <Route
          element={
            <ProtectedRoute
              redirectPath="/"
              isAllowed={!!userData && userData.role === 3}
            />
          }
        >
          <Route element={<ManageSeat />} path="/manageseats"></Route>
          <Route path="/showtimes" element={<ManageShowtimes />} />
        </Route>
        <Route path="/detail/:mid" element={<DetailScreen />} />
        <Route path="/viewticket/:mid" element={<ViewTiket />} />
        <Route path="/ordered" element={<Ordered />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
