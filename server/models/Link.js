const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  github: { type: String },
  linkedin: { type: String },
  codeforces: { type: String },
  website: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Link', linkSchema);