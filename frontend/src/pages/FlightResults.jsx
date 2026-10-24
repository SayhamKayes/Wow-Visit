import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FlightSearch from "../components/FlightSearch";
import { searchFlights } from "../services/api";
import "./FlightResults.css";

const airportCodes = {
  Dhaka: "DAC",
  "Cox’s Bazar": "CXB",
  Chattogram: "CGP",
  Sylhet: "ZYL",
};

function formatMoney(value, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";

  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getDuration(departure, arrival) {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutes =
    (toMinutes(arrival) - toMinutes(departure) + 1440) % 1440;

  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function FlightCard({ flight }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <article className="fr-card">
      <div className="fr-card-main">
        <div className="fr-airline">
          <span className="fr-plane" aria-hidden="true">✈</span>
          <div>
            <strong>{flight.airline}</strong>
            <small>{flight.travelClass}</small>
          </div>
        </div>

        <div className="fr-time">
          <small>{formatDate(flight.departureDate)}</small>
          <strong>{flight.departureTime}</strong>
          <span>{airportCodes[flight.from] || flight.from}</span>
          <small>{flight.from}</small>
        </div>

        <div className="fr-journey">
          <small>
            {getDuration(flight.departureTime, flight.arrivalTime)}
          </small>
          <div className="fr-journey-line" aria-hidden="true" />
          <small>Non-stop · Demo</small>
        </div>

        <div className="fr-time">
          <small>{formatDate(flight.departureDate)}</small>
          <strong>{flight.arrivalTime}</strong>
          <span>{airportCodes[flight.to] || flight.to}</span>
          <small>{flight.to}</small>
        </div>

        <div className="fr-price">
          <small>Per traveler</small>
          <strong>{formatMoney(flight.price, flight.currency)}</strong>
          <button
            type="button"
            className="fr-fare-button"
            aria-expanded={detailsOpen}
            onClick={() => setDetailsOpen(!detailsOpen)}
          >
            {detailsOpen ? "Hide Fare" : "View Fare"}
          </button>
        </div>
      </div>

      <div className="fr-card-footer">
        <span>Sample flight</span>
        <button
          type="button"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen(!detailsOpen)}
        >
          Flight Details
        </button>
      </div>

      {detailsOpen && (
        <div className="fr-details">
          <p>
            <strong>Flight reference:</strong> {flight.id}
          </p>
          <p>
            <strong>Class:</strong> {flight.travelClass}
            {" · "}
            <strong>Sample seats:</strong> {flight.availableSeats}
          </p>
          <p>
            Demo fare: {formatMoney(flight.price, flight.currency)} per
            traveler, for this direction. Booking is not enabled.
          </p>
        </div>
      )}
    </article>
  );
}

function DummyFilters({ flights }) {
  const airlines = [...new Set(flights.map((flight) => flight.airline))];
  const prices = flights.map((flight) => Number(flight.price));

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [budget, setBudget] = useState(maxPrice || 20000);

  function toggle(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <aside className="fr-filters" aria-label="Flight filters">
      <h2>Filters</h2>

      <fieldset>
        <legend>Airlines</legend>
        {airlines.length ? (
          airlines.map((airline) => (
            <label key={airline}>
              <input
                type="checkbox"
                checked={selectedAirlines.includes(airline)}
                onChange={() => toggle(selectedAirlines, setSelectedAirlines, airline)}
              />
              {airline}
            </label>
          ))
        ) : (
          <p>No airlines to display.</p>
        )}
      </fieldset>

      <fieldset>
        <legend>Travel class</legend>
        {["Economy", "Business"].map((name) => (
          <label key={name}>
            <input
              type="checkbox"
              checked={selectedClasses.includes(name)}
              onChange={() => toggle(selectedClasses, setSelectedClasses, name)}
            />
            {name}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Max price</legend>
        <input
          type="range"
          aria-label="Max price"
          min={minPrice}
          max={Math.max(maxPrice, minPrice + 1)}
          step={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <div className="fr-price-range">
          <span>{formatMoney(minPrice)}</span>
          <span>{formatMoney(budget)}</span>
        </div>
      </fieldset>
    </aside>
  );
}


function FlightResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();

  return <ResultsContent key={query} query={query} />;
}

function ResultsContent({ query }) {
  const initialValues = Object.fromEntries(new URLSearchParams(query));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = Object.fromEntries(new URLSearchParams(query));

    window.scrollTo({ top: 0, behavior: "instant" });

    async function loadFlights() {
      try {
        const result = await searchFlights(params, controller.signal);

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError
              ? "Cannot reach the flight service. Please check your connection."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadFlights();

    return () => controller.abort();
  }, [query]);

  const outbound = data?.outbound.flights || [];
  const inbound = data?.return.flights || [];
  const roundTrip = data?.tripType === "round-trip";


  let outboundLimit = Math.min(outbound.length, 10);
  let returnLimit = 0;

  if (roundTrip) {
    outboundLimit = Math.min(outbound.length, 5);
    returnLimit = Math.min(inbound.length, 10 - outboundLimit);
    outboundLimit = Math.min(outbound.length, 10 - returnLimit);
  }

  const shownOutbound = outbound.slice(0, outboundLimit);
  const shownReturn = inbound.slice(0, returnLimit);
  const allFlights = [...outbound, ...inbound];

  return (
    <div className="app flight-results-page">

      <Navbar />

      <main>
        <div className="fr-search-strip">
          <div className="fr-container">
            <FlightSearch initialValues={initialValues} />
          </div>
        </div>

        <div className="fr-container fr-layout">
          <DummyFilters flights={allFlights} />

          <div className="fr-results">
            <h1>Flight search results</h1>

            {loading && (
              <p className="fr-status" role="status">
                Searching flights…
              </p>
            )}

            {error && (
              <p className="fr-status" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && data && (
              <>
                <h2 className="fr-route-heading">
                  {data.search.from} → {data.search.to}
                  <small>
                    {formatDate(data.search.departureDate)}
                    {" · "}
                    {data.travelClass}
                  </small>
                </h2>

                {!outbound.length && (
                  <p className="fr-status">No outbound flights found.</p>
                )}

                {shownOutbound.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}

                {roundTrip && (
                  <>
                    <h2 className="fr-route-heading">
                      {data.search.to} → {data.search.from}
                      <small>
                        Return · {formatDate(data.search.returnDate)}
                      </small>
                    </h2>

                    {!inbound.length && (
                      <p className="fr-status">No return flights found.</p>
                    )}

                    {shownReturn.map((flight) => (
                      <FlightCard key={flight.id} flight={flight} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FlightResults;