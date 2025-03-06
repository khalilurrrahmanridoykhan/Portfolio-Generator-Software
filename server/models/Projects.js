const mongoose = require('mongoose');

const projectsSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  doneAt: { type: Date },
  link: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Projects', projectsSchema);