require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.API_PORT || 3001;
const mongoCollection = process.env.MONGO_COLLECTION;
const mongoUri = process.env.MONGO_URI;
const frontendUrl = process.env.FRONTEND_URL;

console.log("Connecting to " + mongoUri);
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

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
  aroundPlanet: {
    planet: String,
    rel: String,
  },
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

// Create a model based on the schema
const Body = mongoose.model("Body", bodySchema, mongoCollection);

const corsOptions = {
  origin: [frontendUrl, "http://localhost:5174"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("Frontend URL:", frontendUrl);
console.log("CORS Options:", corsOptions);

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint to fetch only planets
app.get("/planets", async (req, res) => {
  try {
    console.log("Fetching planets");

    const planets = await Body.find({ isPlanet: true });

    if (!planets || planets.length === 0) {
      console.error("No planets found");
      return res.status(404).json({ message: "No planets found" });
    }

    console.log(`Fetched ${planets.length} planets`);
    res.json({ planets });
  } catch (error) {
    console.error("Error fetching planets:", error);
    res.status(500).json({ error: "Error fetching planets" });
  }
});

// Endpoint to fetch the Sun
app.get("/sun", async (req, res) => {
  try {
    console.log("Fetching the Sun");

    const sun = await Body.findOne({ bodyType: "Star", englishName: "Sun" });
    if (!sun) {
      console.error("Sun not found");
      return res.status(404).json({ message: "Sun not found" });
    }
    console.log("Fetched the Sun");
    res.json({ sun });
  } catch (error) {
    console.error("Error fetching the Sun:", error);
    res.status(500).json({ error: "Error fetching the Sun" });
  }
});

app.get("/body/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`Fetching body with id: ${id}`);

  try {
    const body = await Body.findOne({ id });
    if (!body) {
      console.error(`Body with id: ${id} not found`);
      return res.status(404).json({ message: "Body not found" });
    }
    console.log(`Fetched body with id: ${id}`);
    res.json({ body });
  } catch (error) {
    console.error("Error fetching body:", error);
    res.status(500).json({ error: "Error fetching body" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Solar API!");
  console.log("Accessed root endpoint");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
