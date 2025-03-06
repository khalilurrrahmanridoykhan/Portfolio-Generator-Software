const express = require('express');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
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
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get All Users
router.get('/', getAllUsers);

// Get User Profile
router.get('/profile', protect, getUserProfile);

// Update User Profile
router.put('/profile', protect, upload.single('photo'), updateUserProfile);

// Add User Links
router.post('/links', protect, addUserLinks);

// Get User Links
router.get('/links', protect, getUserLinks);

// Update User Links
router.put('/links', protect, addUserLinks);

// Add User Education
router.post('/education', protect, addUserEducation);

// Get User Education
router.get('/education', protect, getUserEducation);

// Add User Intodec
router.post('/intodec', protect, addUserIntodec);

// Get User Intodec
router.get('/intodec', protect, getUserIntodec);

// Add User Projects
router.post('/projects', protect, addUserProjects);

// Get User Projects
router.get('/projects', protect, getUserProjects);

// Add User Skills
router.post('/skills', protect, addUserSkills);

// Get User Skills
router.get('/skills', protect, getUserSkills);

// Add User Work Experience
router.post('/work-experience', protect, addUserWorkExperience);

// Get User Work Experience
router.get('/work-experience', protect, getUserWorkExperience);

// Add User Portfolio
router.post('/portfolio', protect, addUserPortfolio);

// Get User Portfolio
router.get('/portfolio', protect, getUserPortfolio);

module.exports = router;
