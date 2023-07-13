import { BrowserRouter, Routes, Route } from "react-router-dom";
import DefaultTemplate from "./templates/DefaultTemplate";
import HomeScreen from "./screens/HomeScreen";
import MoviesScreen from "./screens/MoviesScreen";
import BookingScreen from "./screens/BookingScreen";
import CreateMovie from "./screens/CreateMovies";
import EditMovie from "./screens/EditMovie";
import ListMovie from "./screens/ListMovie";


function App() {
  return (
    <BrowserRouter>
      <DefaultTemplate>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/movies" element={<MoviesScreen />} />
          <Route path="/booking" element={<BookingScreen />} />
          <Route path="/crud" element={<ListMovie />} />
          <Route path="/create" element={<CreateMovie />} />
          <Route path="/edit/:mid" element={<EditMovie />} />
        </Routes>
      </DefaultTemplate>
    </BrowserRouter>
  );
}

export default App;
