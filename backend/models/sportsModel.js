const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Court' }],
  center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center' },
});

module.exports = mongoose.model('Sport', sportSchema);
