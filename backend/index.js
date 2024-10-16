const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
    throw err;
  });

const app = express();
app.use(
  cors({
    origin: ["https://game-theory-assignment-frontend.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// health check
app.get("/", (req, res) => {
  res.send("Server is Working Fine");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/b", bookingRoutes);

app.use("/*", (req, res) => {
  res.status(404).json("404 Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
