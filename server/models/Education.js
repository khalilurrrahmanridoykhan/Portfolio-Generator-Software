const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  type: { type: String },
  instruct: { type: String },
  result: { type: String },
  cgpa: { type: Boolean },
  startAt: { type: Date },
  endAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Education', educationSchema);