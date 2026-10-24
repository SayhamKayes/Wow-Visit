const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const pool = require("./db");

async function seed() {
  try {
    console.log("Connecting to PostgreSQL...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS flights (
        id SERIAL PRIMARY KEY,
        airline VARCHAR(100) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'BDT',
        travel_class VARCHAR(50) NOT NULL,
        available_seats INTEGER NOT NULL
      );
    `);
    console.log("Table 'flights' ensured.");

    const countRes = await pool.query("SELECT COUNT(*) FROM flights");
    const count = parseInt(countRes.rows[0].count, 10);

    if (count > 0) {
      console.log(`Table 'flights' already has ${count} records.`);
      await pool.end();
      return;
    }

    console.log("Seeding flights data...");

    const cities = ["Dhaka", "Sylhet", "Chattogram", "Cox’s Bazar"];
    const airlines = [
      { name: "Biman Bangladesh Airlines", ecoBase: 4200, bizBase: 8500 },
      { name: "US-Bangla Airlines", ecoBase: 4500, bizBase: 9000 },
      { name: "Novoair", ecoBase: 4300, bizBase: 8800 },
      { name: "Air Astra", ecoBase: 4100, bizBase: 8200 },
    ];

    const flightsToInsert = [];
    const today = new Date();

    // Generate flights for the next 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      const dateStr = currentDate.toISOString().slice(0, 10);

      for (const origin of cities) {
        for (const dest of cities) {
          if (origin === dest) continue;

          for (let i = 0; i < airlines.length; i++) {
            const airline = airlines[i];

            // Times
            const depHour = 7 + (i * 3 + (origin.length % 3)) % 14;
            const depMin = (i * 15) % 60;
            const arrHour = depHour + 1;
            const arrMin = (depMin + 45) % 60;

            const depTime = `${String(depHour).padStart(2, "0")}:${String(depMin).padStart(2, "0")}:00`;
            const arrTime = `${String(arrHour).padStart(2, "0")}:${String(arrMin).padStart(2, "0")}:00`;

            // Economy flight
            flightsToInsert.push([
              airline.name,
              origin,
              dest,
              dateStr,
              depTime,
              arrTime,
              airline.ecoBase + (dayOffset % 5) * 150,
              "BDT",
              "Economy",
              40 + (dayOffset % 10),
            ]);

            // Business flight
            flightsToInsert.push([
              airline.name,
              origin,
              dest,
              dateStr,
              depTime,
              arrTime,
              airline.bizBase + (dayOffset % 5) * 300,
              "BDT",
              "Business",
              12 + (dayOffset % 4),
            ]);
          }
        }
      }
    }

    console.log(`Inserting ${flightsToInsert.length} flights...`);

    // Batch insert
    for (let i = 0; i < flightsToInsert.length; i += 100) {
      const chunk = flightsToInsert.slice(i, i + 100);
      const valuePlaceholders = [];
      const flatValues = [];

      chunk.forEach((row, rowIdx) => {
        const offset = rowIdx * 10;
        valuePlaceholders.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10})`
        );
        flatValues.push(...row);
      });

      await pool.query(
        `INSERT INTO flights (airline, origin, destination, departure_date, departure_time, arrival_time, price, currency, travel_class, available_seats)
         VALUES ${valuePlaceholders.join(", ")}`,
        flatValues
      );
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await pool.end();
  }
}

seed();
