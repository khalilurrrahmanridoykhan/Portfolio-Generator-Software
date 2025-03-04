const express = require('express');
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

module.exports = router;
