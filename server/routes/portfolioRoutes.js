const express = require('express');
const { getAllPortfolios } = require('../controllers/portfolioController');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Create or update Portfolio
router.post('/', async (req, res) => {
  const { token, portfolioData } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let portfolio = await Portfolio.findOne({ userId: decoded.userId });

    if (portfolio) {
      portfolio = await Portfolio.findByIdAndUpdate(portfolio._id, portfolioData, { new: true });
    } else {
      portfolio = new Portfolio({ ...portfolioData, userId: decoded.userId });
      await portfolio.save();
    }

    res.status(200).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Error saving portfolio data' });
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
