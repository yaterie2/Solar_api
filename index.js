require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const app = express();
const port = process.env.API_PORT || 3001;
const mongoCollection = process.env.MONGO_COLLECTION;
const mongoUri = process.env.MONGO_URI;
const frontendUrl = process.env.FRONTEND_URL;

// Define mongoose schema and model
const bodySchema = new mongoose.Schema({
  id: String,
  name: String,
  englishName: String,
  isPlanet: Boolean,
  moons: [
    {
      moon: String,
      rel: String,
    },
  ],
  semimajorAxis: Number,
  perihelion: Number,
  aphelion: Number,
  eccentricity: Number,
  inclination: Number,
  mass: {
    massValue: Number,
    massExponent: Number,
  },
  vol: {
    volValue: Number,
    volExponent: Number,
  },
  density: Number,
  gravity: Number,
  escape: Number,
  meanRadius: Number,
  equaRadius: Number,
  polarRadius: Number,
  flattening: Number,
  dimension: String,
  sideralOrbit: Number,
  sideralRotation: Number,
  aroundPlanet: String,
  discoveredBy: String,
  discoveryDate: String,
  alternativeName: String,
  axialTilt: Number,
  avgTemp: Number,
  mainAnomaly: Number,
  argPeriapsis: Number,
  longAscNode: Number,
  bodyType: String,
  rel: String,
});

const Body = mongoose.model("body", bodySchema, mongoCollection);

console.log("connecting to " + mongoUri);
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const corsOptions = {
  origin: [frontendUrl, "http://localhost:5174"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Route to fetch all bodies with optional filters
app.get("/api/allbodies", async (req, res) => {
  const { isPlanet, name } = req.query;
  try {
    const query = {};
    if (isPlanet !== undefined) {
      query.isPlanet = isPlanet === "true"; // Convert string to boolean
    }
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case insensitive search by name
    }
    const bodies = await Body.find(query);
    res.json({ bodies });
  } catch (error) {
    console.error("Error fetching bodies:", error);
    res.status(500).json({ error: "Error fetching bodies" });
  }
});

app.get("/", (req, res) => {
  res.send(`Welcome to the Solar API!`);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
