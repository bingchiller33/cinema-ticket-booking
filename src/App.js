import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import DefaultTemplate from "./templates/DefaultTemplate";
import HomeScreen from "./screens/HomeScreen";
import MoviesScreen from "./screens/MoviesScreen";
import BookingScreen from "./screens/BookingScreen";

function App() {
  return (
      <BrowserRouter>
        <DefaultTemplate>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/movies" element={<MoviesScreen />} />
            <Route path="/booking" element={<BookingScreen />} />
          </Routes>
        </DefaultTemplate>
      </BrowserRouter>
  );
}

export default App;
