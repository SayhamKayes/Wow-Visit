import { Routes, Route, Link } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBox from "./components/SearchBox";
import OffersBoard from "./components/OffersBoard";
import FlightResults from "./pages/FlightResults";
import HotelResults from "./pages/HotelResults";

function HomePage() {
  return (
    <div className="app home-page">
      <Navbar />

      <main className="home-content">
        <div className="home-search-area">
          <SearchBox />
        </div>

        <div className="home-offers-area">
          <OffersBoard />
        </div>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/flights" element={<FlightResults />} />
      <Route path="/hotels" element={<HotelResults />} />

      <Route
        path="*"
        element={
          <main style={{ padding: 40 }}>
            <h1>Page not found</h1>
            <Link to="/">Back to homepage</Link>
          </main>
        }
      />
    </Routes>
  );
}

export default App;