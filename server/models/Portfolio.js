const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: String,
  contactInfo: String,
  photoUrl: String,
  bio: String,
  skills: { softSkills: [String], technicalSkills: [String] },
  academicBackground: [
    { institute: String, degree: String, year: String, grade: String }
  ],
  workExperience: [
    { companyName: String, jobDuration: String, jobResponsibilities: [String] }
  ],
  projects: [String],  // Optional
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
