import { useState } from "react";
import { useNavigate } from "react-router";
import "./SearchBox.css";


function HotelSearch({ initialValues = {} }) {
  const navigate = useNavigate();

  const [area, setArea] = useState(
    initialValues.area || "Cox’s Bazar, Bangladesh"
  );
  const [checkIn, setCheckIn] = useState(initialValues.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialValues.checkOut || "");
  const [rooms, setRooms] = useState(initialValues.rooms || "1");
  const [guests, setGuests] = useState(initialValues.guests || "2");
  const [message, setMessage] = useState("");

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");


  function handleSearch(event) {
    event.preventDefault();
    setMessage("");

    if (!area.trim()) {
      setMessage("Please enter a city or area.");
      return;
    }

    if (checkIn && checkOut && checkOut <= checkIn) {
      setMessage("Check-out must be after check-in.");
      return;
    }

    const params = new URLSearchParams({
      area: area.trim(),
      rooms,
      guests,
    });

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);


    navigate(`/hotels?${params.toString()}`);
  }

  return (
    <div className="booking-panel">
      <form onSubmit={handleSearch} onChange={() => setMessage("")}>

        <div className="booking-stay-grid">
          <label className="booking-field">
            <span>City or area</span>
            <input
              type="text"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              placeholder="Sylhet, Bangladesh"
              maxLength={150}
              required
            />
            <small>Include the country for accurate results</small>
          </label>

          <label className="booking-field">
            <span>Check in</span>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                const date = event.target.value;
                setCheckIn(date);

                if (checkOut && checkOut <= date) {
                  setCheckOut("");
                }
              }}
            />
          </label>

          <label className="booking-field">
            <span>Check out</span>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </label>

          <div className="booking-field">
            <label htmlFor="hotel-rooms">Rooms and guests</label>

            <select
              id="hotel-rooms"
              value={rooms}
              onChange={(event) => setRooms(event.target.value)}
            >
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
            </select>

            <select
              aria-label="Guests"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} adult {count === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>


        <p className="booking-message" role="status">
          {message}
        </p>

        <button className="booking-submit" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default HotelSearch;