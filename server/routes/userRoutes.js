const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userController');

const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get All Users
router.get('/', getAllUsers);

module.exports = router;
