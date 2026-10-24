import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HotelSearch from "../components/HotelSearch";
import { searchHotels } from "../services/api";
import "./HotelResults.css";

const hotelIllustration =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="440">
      <rect width="600" height="440" fill="#102954"/>
      <circle cx="490" cy="80" r="38" fill="#ffe4a1"/>
      <rect y="350" width="600" height="90" fill="#163d50"/>
      <rect x="130" y="110" width="340" height="250" rx="10" fill="#e7d9bd"/>
      <rect x="150" y="90" width="300" height="40" rx="6" fill="#bfa37a"/>
      <text x="300" y="118" text-anchor="middle"
        font-family="Arial" font-size="24" fill="#102954">HOTEL</text>
      <g fill="#eabf60">
        <path d="M165 155h45v45h-45z M240 155h45v45h-45z
                 M315 155h45v45h-45z M390 155h45v45h-45z
                 M165 225h45v45h-45z M240 225h45v45h-45z
                 M315 225h45v45h-45z M390 225h45v45h-45z"/>
      </g>
      <rect x="260" y="300" width="80" height="60" fill="#102954"/>
    </svg>
  `);

const demoPresets = [
  {
    rating: "3.7",
    ratingText: "Very Good",
    reviews: 3,
    stars: 4,
    price: 5360,
    originalPrice: 13834,
    amenities: ["Air Conditioning", "Accessible Bathroom", "Free Wi-Fi"],
  },
  {
    rating: "4.4",
    ratingText: "Excellent",
    reviews: 5,
    stars: 5,
    price: 8562,
    originalPrice: 16001,
    amenities: ["Poolside Bar", "Wheelchair Friendly", "24-Hour Front Desk"],
  },
];

function money(value) {
  return `BDT ${value.toLocaleString("en-BD")}`;
}

function HotelCard({ hotel, index }) {
  const [expanded, setExpanded] = useState(false);
  const demo = demoPresets[index % demoPresets.length];

  const discount = Math.round(
    (1 - demo.price / demo.originalPrice) * 100
  );

  const hasCoordinates =
    Number.isFinite(hotel.latitude) &&
    Number.isFinite(hotel.longitude);

  const mapUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${hotel.latitude}` +
    `&mlon=${hotel.longitude}` +
    `#map=16/${hotel.latitude}/${hotel.longitude}`
    : null;

  return (
    <article className="hr-card">
      <div className="hr-image-area">
        <img
          src={hotelIllustration}
          alt="Generic hotel illustration, not a photo of this property"
          loading="lazy"
        />

        <span className="hr-image-label">Illustration</span>

        {mapUrl ? (
          <a
            className="hr-map-link"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on map ↗
          </a>
        ) : (
          <span className="hr-map-link">Map unavailable</span>
        )}
      </div>

      <div className="hr-hotel-info">
        <h2>{hotel.name}</h2>

        <p className="hr-location">
          <span aria-hidden="true">⌖</span> {hotel.address}
        </p>

        <p className="hr-demo-label">Sample details below</p>

        <div className="hr-tags">
          <span className="hr-star">★ {demo.stars}.0 Star</span>
          <span className="hr-tag">Couple Friendly</span>
          <span className="hr-tag">9 Rooms Remaining</span>
        </div>

        <ul className="hr-amenities">
          {demo.amenities.map((amenity) => (
            <li key={amenity}>{amenity}</li>
          ))}
        </ul>
      </div>

      <div className="hr-pricing">
        <div className="hr-rating">
          <div>
            <strong>{demo.ratingText}</strong>
            <small>{demo.reviews} demo reviews</small>
          </div>

          <div className="hr-rating-score">
            <strong>{demo.rating}</strong>
            <small>out of 5</small>
          </div>
        </div>

        <span className="hr-discount">{discount}% off · Demo</span>

        <small className="hr-price-caption">Sample price</small>
        <del>{money(demo.originalPrice)}</del>
        <strong className="hr-price">{money(demo.price)}</strong>
        <small>for 1 night, per room</small>

        <button
          className="hr-select-button"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Close" : "Select"}
        </button>
      </div>

      {expanded && (
        <div className="hr-demo-details">
          <strong>{hotel.name}</strong>
          <p>
            This is a demo selection. Ratings, amenities, room counts,
            discounts, and prices are examples—not verified property
            information. No booking has been made.
          </p>
        </div>
      )}
    </article>
  );
}

function HotelFilters() {
  const [ratings, setRatings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [budget, setBudget] = useState(20000);

  function toggle(list, setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <aside className="hr-filters" aria-label="Hotel filters">
      <h2>Filters</h2>

      <fieldset>
        <legend>Property rating</legend>
        {["5 Star", "4 Star", "3 Star"].map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={ratings.includes(label)}
              onChange={() => toggle(ratings, setRatings, label)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Facilities</legend>
        {[
          "Free Wi-Fi",
          "Air Conditioning",
          "Swimming Pool",
          "Parking",
          "Restaurant",
        ].map((label) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={facilities.includes(label)}
              onChange={() => toggle(facilities, setFacilities, label)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Guest preference</legend>
        {["Family Friendly", "Couple Friendly", "Accessible Rooms"].map(
          (label) => (
            <label key={label}>
              <input
                type="checkbox"
                checked={preferences.includes(label)}
                onChange={() => toggle(preferences, setPreferences, label)}
              />
              {label}
            </label>
          )
        )}
      </fieldset>

      <fieldset>
        <legend>Max nightly budget</legend>
        <input
          type="range"
          aria-label="Max nightly budget"
          min="1000"
          max="20000"
          step="500"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
        <div className="hr-range-labels">
          <span>BDT 1,000</span>
          <span>BDT {budget.toLocaleString()}</span>
        </div>
      </fieldset>
    </aside>
  );
}

function HotelResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();

  return <HotelResultsContent key={query} query={query} />;
}

function HotelResultsContent({ query }) {
  const initialValues = Object.fromEntries(new URLSearchParams(query));
  const area = initialValues.area || "";

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    window.scrollTo({ top: 0, behavior: "instant" });

    async function loadHotels() {
      if (!area.trim()) {
        setError("Enter a city or area in the search form.");
        setLoading(false);
        return;
      }

      try {
        const result = await searchHotels(area.trim(), controller.signal);

        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError
              ? "Cannot reach the hotel service. Please check your connection."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadHotels();

    return () => controller.abort();
  }, [area]);

  return (
    <div className="app hotel-results-page">
      <Navbar />

      <main>
        <div className="hr-search-strip">
          <div className="hr-container">
            <HotelSearch initialValues={initialValues} />
          </div>
        </div>

        <div className="hr-container hr-layout">
          <HotelFilters />

          <div className="hr-results">
            <h1>Hotels near {data?.area || area || "your destination"}</h1>

            <p className="hr-results-note">
              Hotel names, addresses, and map locations come from the API.
            </p>

            {loading && (
              <p className="hr-status" role="status">
                Searching hotels…
              </p>
            )}

            {error && (
              <p className="hr-status" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && data && (
              <>
                <p className="hr-results-count">
                  {data.hotels.length} hotel(s) found within{" "}
                  {data.radiusKm} km of the matched location.
                </p>

                {data.hotels.length === 0 && (
                  <p className="hr-status">
                    No hotels found. Try another city or area.
                  </p>
                )}

                {data.hotels.map((hotel, index) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    index={index}
                  />
                ))}

                <p className="hr-attribution">
                  Powered by{" "}
                  <a href="https://www.geoapify.com/">Geoapify</a>
                  {" · "}
                  Data ©{" "}
                  <a href="https://www.openstreetmap.org/copyright">
                    OpenStreetMap contributors
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HotelResults;