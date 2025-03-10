const express = require('express');
const { getAllPortfolios } = require('../controllers/portfolioController');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const generatePortfolioPDF = require('../utils/pdfGenerator');

const router = express.Router();

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

// Create or update Portfolio
router.post('/', upload.single('photo'), async (req, res) => {
  const { fullName, contactInfo, bio, skills, academicBackground, workExperience, projects } = JSON.parse(req.body.portfolioData);
  const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let portfolio = await Portfolio.findOne({ userId: decoded.userId });

    if (portfolio) {
      portfolio = await Portfolio.findByIdAndUpdate(portfolio._id, {
        fullName,
        contactInfo,
        bio,
        skills,
        academicBackground,
        workExperience,
        projects,
        photoUrl: req.file ? `/uploads/${req.file.filename}` : portfolio.photoUrl
      }, { new: true });
    } else {
      portfolio = new Portfolio({
        userId: decoded.userId,
        fullName,
        contactInfo,
        bio,
        skills,
        academicBackground,
        workExperience,
        projects,
        photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined
      });
      await portfolio.save();
    }

    // Generate PDF
    const pdfFileName = path.join(__dirname, '../portfolio', `${portfolio._id}.pdf`);
    generatePortfolioPDF(portfolio, pdfFileName);

    res.status(200).json(portfolio);
  } catch (err) {
    console.error('Error saving portfolio data:', err); // Add detailed error logging
    console.error('Request body:', req.body); // Log the request body
    res.status(500).json({ message: 'Error saving portfolio data', error: err.message }); // Include error message in response
  }
});

// Get All Portfolios
router.get('/', getAllPortfolios);

// Get Portfolio by ID
router.get('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (portfolio) {
      res.status(200).json(portfolio);
    } else {
      res.status(404).json({ message: 'Portfolio not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
});

// Update Portfolio by ID
router.put('/:portfolioId', async (req, res) => {
  const { token, portfolioData } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.portfolioId, portfolioData, { new: true });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Error updating portfolio' });
  }
});

// Delete Portfolio by ID
router.delete('/:portfolioId', async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.portfolioId);
    res.status(200).json({ message: 'Portfolio deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting portfolio' });
  }
});

module.exports = router;
