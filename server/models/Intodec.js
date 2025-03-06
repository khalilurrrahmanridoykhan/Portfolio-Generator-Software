const mongoose = require('mongoose');

const intodecSchema = new mongoose.Schema({
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Intodec', intodecSchema);