const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  location: { type: String }, // New field
  photo: { type: String }, // New field to store the path to the user's picture
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Link' }], // Reference to Link model
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }], // Reference to Education model
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }], // Reference to Skills model
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }], // Reference to Projects model
  workExperience: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkExperience' }], // Reference to WorkExperience model
  intodec: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Intodec' }] // Reference to Intodec model
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
