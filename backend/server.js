const path = require("path");


require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const flightRoutes = require("./routes/flights");
const hotelRoutes = require("./routes/hotels");

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "WowVisit backend is running!",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes.
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);


app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL.");
  } catch (error) {
    console.warn("Database connection warning:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();