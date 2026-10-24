const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const { area } = req.query;

  if (typeof area !== "string" || !area.trim() || area.trim().length > 150) {
    return res.status(400).json({
      message: "Please enter an area name of up to 150 characters.",
    });
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      message: "Hotel search is not configured on the server.",
    });
  }

  try {
    const locationResponse = await axios.get(
      "https://api.geoapify.com/v1/geocode/search",
      {
        params: {
          text: area.trim(),
          format: "json",
          limit: 1,
          apiKey,
        },
        timeout: 15000,
      }
    );

    const location = locationResponse.data.results?.[0];

    if (!location) {
      return res.status(404).json({
        message: "Area not found. Try including the city and country.",
      });
    }

    const { lon, lat } = location;

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      throw new Error("Invalid location coordinates.");
    }

    const hotelsResponse = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories: "accommodation.hotel",
          filter: `circle:${lon},${lat},10000`,
          bias: `proximity:${lon},${lat}`,
          limit: 10,
          apiKey,
        },
        timeout: 15000,
      }
    );

    const features = hotelsResponse.data.features;

    if (!Array.isArray(features)) {
      throw new Error("Unexpected hotel data.");
    }

    const hotels = features.map((feature) => {
      const hotel = feature.properties;

      return {
        id: hotel.place_id,
        name: hotel.name || "Unnamed hotel",
        address: hotel.formatted || "Address unavailable",
        city: hotel.city || hotel.town || null,
        country: hotel.country || null,
        latitude: hotel.lat,
        longitude: hotel.lon,
      };
    });

    res.json({
      area: location.formatted,
      radiusKm: 10,
      count: hotels.length,
      hotels,
      attribution: {
        provider: "Geoapify",
        providerUrl: "https://www.geoapify.com/",
        source: "OpenStreetMap contributors",
        sourceUrl: "https://www.openstreetmap.org/copyright",
      },
    });
  } catch (error) {
    console.error("Hotel search failed:", {
      status: error.response?.status,
      code: error.code,
    });

    const message =
      error.response?.status === 429
        ? "The hotel data provider's request limit was reached. Try again later."
        : "Could not load hotels. Please try again later.";

    res.status(502).json({ message });
  }
});

module.exports = router;