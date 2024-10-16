const express = require("express");
const Booking = require("../models/bookingModel");
const Court = require("../models/courtModel");
const sportsModel = require("../models/sportsModel");
const { auth } = require("../middlewares/auth");
const Center = require("../models/centerModel");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/centers", auth, async (req, res) => {
  try {
    const centers = await Center.find({});
    return res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

router.get("/c/:centerId", auth, async (req, res) => {
  try {
    const { centerId } = req.params;
    const Sports = await sportsModel
      .find({ center: centerId })
      .populate("courts");
    return res.status(200).json(Sports);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

router.get("/bookings", auth, async (req, res) => {
  try {
    const { centerId, sportId, date } = req.query;
    
    if (!centerId || !sportId || !date) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (
      !mongoose.Types.ObjectId.isValid(centerId) ||
      !mongoose.Types.ObjectId.isValid(sportId)
    ) {
      return res.status(400).json({ message: "Invalid center or sport id." });
    }

    const courts = await Court.find({ sport: sportId, center: centerId });

    if (courts.length === 0) {
      return res
        .status(404)
        .json({ message: "No courts found for the sport in this center." });
    }

    const courtIds = courts.map((court) => court._id);

    const bookings = await Booking.find({ court: { $in: courtIds }, date });

    res.json(bookings);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
});

router.post("/bookings", auth, async (req, res) => {
  try {
    const { courtId, date, startTime, endTime, bookedBy } = req.body;

    console.log(req.body);
    if (!courtId || !date || !startTime || !endTime || !bookedBy) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (date < new Date().toISOString().split("T")[0]) {
      return res.status(400).json({ message: "Invalid Date" });
    }

    const existingBooking = await Booking.findOne({
      court: courtId,
      date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Court is already booked for this time slot." });
    }

    const newBooking = new Booking({
      court: courtId,
      date,
      startTime,
      endTime,
      bookedBy,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking." });
  }
});

//no of courts
router.get("/courts", auth, async (req, res) => {
  try {
    const { sportId, centerId } = req.query;
    if (!sportId || !centerId) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (
      !mongoose.Types.ObjectId.isValid(centerId) ||
      !mongoose.Types.ObjectId.isValid(sportId)
    ) {
      return res.status(400).json({ message: "Invalid center or sport id." });
    }
    const courts = await Court.find({ sport: sportId, center: centerId });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve courts." });
  }
});

module.exports = router;
