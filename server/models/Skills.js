const mongoose = require('mongoose');

const skillsSchema = new mongoose.Schema({
  title: { type: String },
  allskills: { type: [String] }, // Array of strings to store multiple skills
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Skills', skillsSchema);