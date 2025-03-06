const User = require('../models/User');
const Link = require('../models/Link');
const Education = require('../models/Education');
const Skills = require('../models/Skills');
const Projects = require('../models/Projects');
const WorkExperience = require('../models/WorkExperience');
const Intodec = require('../models/Intodec');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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
    console.log('Fetching user profile for user ID:', req.user.userId);
    const user = await User.findById(req.user.userId).populate('links').populate('education').populate('skills').populate('projects').populate('workExperience').populate('intodec');
    console.log('Fetched user:', user);
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    console.log('Request file:', req.file); // Log the file
    console.log('Request body:', req.body); // Log the body

    const userData = JSON.parse(req.body.userData);
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.file) {
      user.photo = `/uploads/${req.file.filename}`;
    }

    // Update user fields
    user.email = userData.email || user.email;
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }
    user.name = userData.name || user.name;
    user.firstName = userData.firstName || user.firstName;
    user.lastName = userData.lastName || user.lastName;
    user.phone = userData.phone || user.phone;
    user.location = userData.location || user.location;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user data:', err);
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

// Add User Links
const addUserLinks = async (req, res) => {
  const { github, linkedin, codeforces, website } = req.body;
  const userId = req.user.userId;

  try {
    let userLinks = await Link.findOne({ userId });

    if (userLinks) {
      // Update existing links
      userLinks.github = github;
      userLinks.linkedin = linkedin;
      userLinks.codeforces = codeforces;
      userLinks.website = website;
      await userLinks.save();
      res.json(userLinks);
    } else {
      // Create new links
      userLinks = new Link({
        userId,
        github,
        linkedin,
        codeforces,
        website
      });
      await userLinks.save();
      res.json(userLinks);
    }
  } catch (error) {
    console.error('Error adding/updating links:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get User Links
const getUserLinks = async (req, res) => {
  try {
    const link = await Link.findOne({ userId: req.user.userId });
    if (link) {
      res.status(200).json(link);
    } else {
      res.status(404).json({ message: 'No links found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching links' });
  }
};

// Add User Education
const addUserEducation = async (req, res) => {
  const { type, instruct, result, cgpa, startAt, endAt } = req.body;

  try {
    const education = new Education({ type, instruct, result, cgpa, startAt, endAt, userId: req.user.userId });
    await education.save();

    const user = await User.findById(req.user.userId);
    user.education.push(education._id);
    await user.save();

    res.status(201).json({ message: 'Education added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding education' });
  }
};

// Get User Education
const getUserEducation = async (req, res) => {
  try {
    const education = await Education.findOne({ userId: req.user.userId });
    if (education) {
      res.status(200).json(education);
    } else {
      res.status(404).json({ message: 'No education found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching education' });
  }
};

// Add User Intodec
const addUserIntodec = async (req, res) => {
  const { description } = req.body;

  try {
    const intodec = new Intodec({ description, userId: req.user.userId });
    await intodec.save();

    const user = await User.findById(req.user.userId);
    user.intodec.push(intodec._id);
    await user.save();

    res.status(201).json({ message: 'Intodec added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding intodec' });
  }
};

// Get User Intodec
const getUserIntodec = async (req, res) => {
  try {
    const intodec = await Intodec.findOne({ userId: req.user.userId });
    if (intodec) {
      res.status(200).json(intodec);
    } else {
      res.status(404).json({ message: 'No intodec found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching intodec' });
  }
};

// Add User Projects
const addUserProjects = async (req, res) => {
  const { title, description, doneAt, link } = req.body;

  try {
    const project = new Projects({ title, description, doneAt, link, userId: req.user.userId });
    await project.save();

    const user = await User.findById(req.user.userId);
    user.projects.push(project._id);
    await user.save();

    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding project' });
  }
};

// Get User Projects
const getUserProjects = async (req, res) => {
  try {
    const project = await Projects.findOne({ userId: req.user.userId });
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'No projects found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Add User Skills
const addUserSkills = async (req, res) => {
  const { title, allskills } = req.body;

  try {
    const skills = new Skills({ title, allskills, userId: req.user.userId });
    await skills.save();

    const user = await User.findById(req.user.userId);
    user.skills.push(skills._id);
    await user.save();

    res.status(201).json({ message: 'Skills added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding skills' });
  }
};

// Get User Skills
const getUserSkills = async (req, res) => {
  try {
    const skills = await Skills.findOne({ userId: req.user.userId });
    if (skills) {
      res.status(200).json(skills);
    } else {
      res.status(404).json({ message: 'No skills found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching skills' });
  }
};

// Add User Work Experience
const addUserWorkExperience = async (req, res) => {
  const { companyName, jobDuration, jobResponsibilities, description, startAt, endAt } = req.body;

  try {
    const workExperience = new WorkExperience({ companyName, jobDuration, jobResponsibilities, description, startAt, endAt, userId: req.user.userId });
    await workExperience.save();

    const user = await User.findById(req.user.userId);
    user.workExperience.push(workExperience._id);
    await user.save();

    res.status(201).json({ message: 'Work experience added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding work experience' });
  }
};

// Get User Work Experience
const getUserWorkExperience = async (req, res) => {
  try {
    const workExperience = await WorkExperience.findOne({ userId: req.user.userId });
    if (workExperience) {
      res.status(200).json(workExperience);
    } else {
      res.status(404).json({ message: 'No work experience found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching work experience' });
  }
};

// Add User Portfolio
const addUserPortfolio = async (req, res) => {
  const { fullName, contactInfo, photoUrl, bio, skills, academicBackground, workExperience, projects } = req.body;

  try {
    const portfolio = new Portfolio({ fullName, contactInfo, photoUrl, bio, skills, academicBackground, workExperience, projects, userId: req.user.userId });
    await portfolio.save();

    const user = await User.findById(req.user.userId);
    user.portfolio = portfolio._id;
    await user.save();

    res.status(201).json({ message: 'Portfolio added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding portfolio' });
  }
};

// Get User Portfolio
const getUserPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user.userId });
    if (portfolio) {
      res.status(200).json(portfolio);
    } else {
      res.status(404).json({ message: 'No portfolio found for this user' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  addUserLinks,
  getUserLinks,
  addUserEducation,
  getUserEducation,
  addUserIntodec,
  getUserIntodec,
  addUserProjects,
  getUserProjects,
  addUserSkills,
  getUserSkills,
  addUserWorkExperience,
  getUserWorkExperience,
  addUserPortfolio,
  getUserPortfolio,
  upload
};