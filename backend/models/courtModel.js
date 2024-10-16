const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport' },
  center: { type: mongoose.Schema.Types.ObjectId, ref: 'Center' },
  courtNo: { type: Number, required: true },
});

courtSchema.pre('save', async function(next) {
  const court = this;
  const existingCourt = await Court.findOne({sport: court.sport, center:court.center})
  court.courtNo = existingCourt ? existingCourt.courtNo + 1 : 1;
  next();
})
module.exports = mongoose.model('Court', courtSchema);
