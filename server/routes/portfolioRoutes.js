const express = require('express');
const { getAllPortfolios } = require('../controllers/portfolioController');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// Ensure the directory for saving PDFs exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

// Create or update Portfolio
router.post('/', upload.single('photo'), async (req, res) => {
  const { fullName, contactInfo, bio, skills, academicBackground, workExperience, projects } = JSON.parse(req.body.portfolioData);
  const pdfFormat = req.body.pdfFormat; // Get the selected PDF format
  const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Create a new portfolio
    const portfolio = new Portfolio({
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

    // Generate PDF
    const pdfFileName = path.join(__dirname, '../portfolio', `${portfolio._id}.pdf`);
    ensureDirectoryExistence(pdfFileName);
    await generatePortfolioPDF(portfolio, pdfFileName, pdfFormat); // Pass the selected PDF format

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

// Download Portfolio PDF by ID
router.get('/:portfolioId/download', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    const pdfFileName = path.join(__dirname, '../portfolio', `${portfolio._id}.pdf`);
    if (!fs.existsSync(pdfFileName)) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    res.download(pdfFileName);
  } catch (err) {
    res.status(500).json({ message: 'Error downloading portfolio', error: err.message });
  }
});

// Update Portfolio by ID
router.put('/:portfolioId', upload.single('photo'), async (req, res) => {
  const { portfolioData, pdfFormat } = req.body;
  const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const updatedPortfolioData = JSON.parse(portfolioData);

    // Update the portfolio
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.portfolioId,
      {
        ...updatedPortfolioData,
        photoUrl: req.file ? `/uploads/${req.file.filename}` : updatedPortfolioData.photoUrl
      },
      { new: true }
    );

    // Generate PDF if needed
    if (pdfFormat) {
      const pdfFileName = path.join(__dirname, '../portfolio', `${portfolio._id}.pdf`);
      ensureDirectoryExistence(pdfFileName);
      await generatePortfolioPDF(portfolio, pdfFileName, pdfFormat); // Pass the selected PDF format
    }

    res.status(200).json(portfolio);
  } catch (err) {
    console.error('Error updating portfolio:', err); // Add detailed error logging
    res.status(500).json({ message: 'Error updating portfolio', error: err.message });
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
