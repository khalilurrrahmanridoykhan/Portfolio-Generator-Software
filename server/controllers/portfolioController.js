const Portfolio = require('../models/Portfolio');

// Get All Portfolios
const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({});
    res.status(200).json(portfolios);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolios' });
  }
};

module.exports = {
  getAllPortfolios,
};
