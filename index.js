require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.API_PORT || 3001;
const mongoCollection = process.env.MONGO_COLLECTION;
const mongoUri = process.env.MONGO_URI;
const frontendUrl = process.env.FRONTEND_URL;

// Connect to MongoDB
console.log("connecting to " + mongoUri);
mongoose
  .connect(mongoUri, {
    // Any additional options you need
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


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
  aroundPlanet: String, // Assuming this is a reference to another body
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

const Body = mongoose.model(mongoCollection, bodySchema, mongoCollection);

// CORS options
const corsOptions = {
  origin: [
    "http://localhost:1234",
    frontendUrl, // Add more origins as needed
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("Frontend URL:", frontendUrl);
console.log("CORS Options: ", corsOptions);


// Use CORS middleware
app.use(cors(corsOptions));

// Middleware for parsing JSON requests
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Welcome to the Solar API!");
});

// Route to fetch all bodies
app.get("/api/allbodies", async (req, res) => {
  try {
    const bodies = await Body.find();
    res.json({ bodies });
  } catch (error) {
    console.error("Error fetching bodies:", error);
    res.status(500).json({ error: "Error fetching bodies" });
  }
});

// Route to fetch a body by id
app.get("/api/body/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const body = await Body.findOne({ id });
    if (!body) {
      return res.status(404).json({ message: "Body not found" });
    }
    res.json({ body });
  } catch (error) {
    console.error("Error fetching body:", error);
    res.status(500).json({ error: "Error fetching body" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
