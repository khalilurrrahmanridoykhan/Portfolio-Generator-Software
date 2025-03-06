const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  companyName: { type: String },
  jobDuration: { type: String },
  jobResponsibilities: { type: [String] }, // Array of strings to store multiple responsibilities
  description: { type: String },
  startAt: { type: Date },
  endAt: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('WorkExperience', workExperienceSchema);