const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Format: HH:mm
  endTime: { type: String, required: true },
  bookedBy: { type: String, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
