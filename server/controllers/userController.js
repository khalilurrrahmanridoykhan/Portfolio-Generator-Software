const User = require('../models/User');
const Link = require('../models/Link');
const Education = require('../models/Education');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const WorkExperience = require('../models/WorkExperience');
const Intodec = require('../models/Intodec');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  const { email, password, name, firstName, lastName, phone, location, photo, github, linkedin, codeforces, website, education, skills, projects, workExperience, intodec } = req.body;

  try {
    const user = new User({ email, password, name, firstName, lastName, phone, location, photo });
    await user.save();

    const link = new Link({ github, linkedin, codeforces, website, userId: user._id });
    await link.save();

    user.links.push(link._id);

    if (education) {
      for (const edu of education) {
        const newEducation = new Education({ ...edu, userId: user._id });
        await newEducation.save();
        user.education.push(newEducation._id);
      }
    }

    if (skills) {
      for (const skill of skills) {
        const newSkill = new Skills({ ...skill, userId: user._id });
        await newSkill.save();
        user.skills.push(newSkill._id);
      }
    }

    if (projects) {
      for (const project of projects) {
        const newProject = new Projects({ ...project, userId: user._id });
        await newProject.save();
        user.projects.push(newProject._id);
      }
    }

    if (workExperience) {
      for (const work of workExperience) {
        const newWorkExperience = new WorkExperience({ ...work, userId: user._id });
        await newWorkExperience.save();
        user.workExperience.push(newWorkExperience._id);
      }
    }

    if (intodec) {
      for (const int of intodec) {
        const newIntodec = new Intodec({ ...int, userId: user._id });
        await newIntodec.save();
        user.intodec.push(newIntodec._id);
      }
    }

    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('links').populate('education').populate('skills').populate('projects').populate('workExperience').populate('intodec');

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('links').populate('education').populate('skills').populate('projects').populate('workExperience').populate('intodec');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, { new: true }).populate('links').populate('education').populate('skills').populate('projects').populate('workExperience').populate('intodec');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user data' });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('links').populate('education').populate('skills').populate('projects').populate('workExperience').populate('intodec');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
};