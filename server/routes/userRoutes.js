const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserProfile, updateUserProfile, upload } = require('../controllers/userController');
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

module.exports = router;
