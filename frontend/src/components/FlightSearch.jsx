import { useState } from "react";
import { useNavigate } from "react-router";
import "./SearchBox.css";

const cities = ["Dhaka", "Sylhet", "Chattogram", "Cox’s Bazar"];

function FlightSearch({ initialValues = {} }) {
  const navigate = useNavigate();


  const [tripType, setTripType] = useState(
    initialValues.tripType || "one-way"
  );
  const [from, setFrom] = useState(initialValues.from || "Dhaka");
  const [to, setTo] = useState(initialValues.to || "Sylhet");
  const [departure, setDeparture] = useState(
    initialValues.departureDate || ""
  );
  const [returnDate, setReturnDate] = useState(
    initialValues.returnDate || ""
  );
  const [travelClass, setTravelClass] = useState(
    initialValues.travelClass || "Economy"
  );
  const [travelers, setTravelers] = useState(
    initialValues.travelers || "1"
  );
  const [message, setMessage] = useState("");


  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const parts = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value])
  );

  const today = `${parts.year}-${parts.month}-${parts.day}`;

  function handleSearch(event) {
    event.preventDefault();
    setMessage("");

    if (from === to) {
      setMessage("Departure and destination must be different.");
      return;
    }

    if (tripType === "round-trip" && returnDate < departure) {
      setMessage("Return date cannot be before departure.");
      return;
    }

    const params = new URLSearchParams({
      from,
      to,
      departureDate: departure,
      tripType,
      travelClass,
      travelers,
    });

    if (tripType === "round-trip") {
      params.set("returnDate", returnDate);
    }

    navigate(`/flights?${params.toString()}`);
  }

  return (
    <div className="booking-panel">
      <form onSubmit={handleSearch} onChange={() => setMessage("")}>
        <fieldset className="booking-trip-types">
          <legend className="visually-hidden">Trip type</legend>

          <label>
            <input
              type="radio"
              name="tripType"
              checked={tripType === "one-way"}
              onChange={() => setTripType("one-way")}
            />
            One Way
          </label>

          <label>
            <input
              type="radio"
              name="tripType"
              checked={tripType === "round-trip"}
              onChange={() => setTripType("round-trip")}
            />
            Round Trip
          </label>
        </fieldset>

        <div className="booking-flight-grid">
          <label className="booking-field">
            <span>From</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <small>Departure city</small>
          </label>

          <button
            className="booking-swap"
            type="button"
            aria-label="Swap departure and destination"
            onClick={() => {
              setFrom(to);
              setTo(from);
              setMessage("");
            }}
          >
            ⇄
          </button>

          <label className="booking-field">
            <span>To</span>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {cities.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
            <small>Destination city</small>
          </label>

          <label className="booking-field">
            <span>Departure date</span>
            <input
              type="date"
              min={today}
              value={departure}
              required
              onChange={(e) => {
                const date = e.target.value;
                setDeparture(date);

                if (returnDate && returnDate < date) {
                  setReturnDate("");
                }
              }}
            />
          </label>

          <label className="booking-field">
            <span>Return date</span>
            <input
              type="date"
              min={departure || today}
              value={returnDate}
              disabled={tripType === "one-way"}
              required={tripType === "round-trip"}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </label>

          <div className="booking-field">
            <label htmlFor="flight-travelers">Travelers and class</label>

            <select
              id="flight-travelers"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "Traveler" : "Travelers"}
                </option>
              ))}
            </select>

            <select
              aria-label="Travel class"
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
            >
              <option>Economy</option>
              <option>Business</option>
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

export default FlightSearch;