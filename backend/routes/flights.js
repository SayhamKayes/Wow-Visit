const express = require("express");
const pool = require("../db");

const router = express.Router();

function normalizeCity(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/\s+/g, " ");
}

function isValidDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function getTodayInDhaka() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

async function findFlights(from, to, date, travelClass) {
  const query = `
    SELECT
      id,
      airline,
      origin AS "from",
      destination AS "to",
      TO_CHAR(departure_date, 'YYYY-MM-DD') AS "departureDate",
      TO_CHAR(departure_time, 'HH24:MI') AS "departureTime",
      TO_CHAR(arrival_time, 'HH24:MI') AS "arrivalTime",
      price,
      currency,
      travel_class AS "travelClass",
      available_seats AS "availableSeats"
    FROM flights
    WHERE
      LOWER(
        REGEXP_REPLACE(
          TRANSLATE(TRIM(origin), CHR(39) || CHR(8217), ''),
          '[[:space:]]+', ' ', 'g'
        )
      ) = $1
      AND
      LOWER(
        REGEXP_REPLACE(
          TRANSLATE(TRIM(destination), CHR(39) || CHR(8217), ''),
          '[[:space:]]+', ' ', 'g'
        )
      ) = $2
      AND departure_date = $3::DATE
      AND travel_class = $4
    ORDER BY price ASC, departure_time ASC, id ASC
  `;

  const result = await pool.query(query, [from, to, date, travelClass]);

  return result.rows.map((flight) => ({
    ...flight,
    price: Number(flight.price)
  }));
}

router.get("/", async (req, res) => {
  const { from, to, departureDate, returnDate,
    tripType = "one-way", travelClass = "Economy"
  } = req.query;

  if (typeof from !== "string" || typeof to !== "string" || !from.trim() || !to.trim() || from.length > 100 || to.length > 100) {
    return res.status(400).json({ message: "Please provide valid departure and destination cities." });
  }

  const origin = normalizeCity(from);
  const destination = normalizeCity(to);

  if (origin === destination) {
    return res.status(400).json({
      message: "Departure and destination must be different.",
    });
  }

  if (!["one-way", "round-trip"].includes(tripType)) {
    return res.status(400).json({
      message: "Trip type must be one-way or round-trip.",
    });
  }

  if (!["Economy", "Business"].includes(travelClass)) {
    return res.status(400).json({
      message: "Travel class must be Economy or Business.",
    });
  }

  if (!isValidDate(departureDate)) {
    return res.status(400).json({
      message: "Provide a valid departureDate in YYYY-MM-DD format.",
    });
  }

  if (departureDate < getTodayInDhaka()) {
    return res.status(400).json({
      message: "Departure date cannot be in the past.",
    });
  }

  if (tripType === "round-trip") {
    if (!isValidDate(returnDate)) {
      return res.status(400).json({
        message: "Provide a valid returnDate in YYYY-MM-DD format.",
      });
    }

    if (returnDate < departureDate) {
      return res.status(400).json({
        message: "Return date cannot be before departure date.",
      });
    }
  }

  try {
    const [outboundFlights, returnFlights] = await Promise.all([
      findFlights(origin, destination, departureDate, travelClass),

      tripType === "round-trip"
        ? findFlights(destination, origin, returnDate, travelClass)
        : Promise.resolve([]),
    ]);

    res.json({
      tripType, travelClass,
      search: {
        from: from.trim(),
        to: to.trim(),
        departureDate,
        returnDate: tripType === "round-trip" ? returnDate : null,
      },
      outbound: {
        count: outboundFlights.length,
        flights: outboundFlights,
      },
      return: {
        count: returnFlights.length,
        flights: returnFlights,
      },
    });
  } catch (error) {
    console.error("Flight search failed:", error.message);

    res.status(500).json({
      message: "Could not load flights. Please try again later.",
    });
  }
});

module.exports = router;