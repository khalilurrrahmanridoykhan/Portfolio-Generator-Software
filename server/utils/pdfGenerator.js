const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePortfolioPDF = (portfolioData, fileName) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(fileName));

  // Add content to the PDF (basic example)
  doc.fontSize(25).text(portfolioData.fullName);
  doc.fontSize(15).text(portfolioData.bio);

  // More data goes here (skills, experience, etc.)

  doc.end();
};

module.exports = generatePortfolioPDF;
