const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePortfolioPDF = (portfolioData, fileName) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(fileName));

  // Add content to the PDF
  doc.fontSize(25).text(portfolioData.fullName, { align: 'center' });
  doc.moveDown();
  doc.fontSize(15).text(`Contact Info: ${portfolioData.contactInfo}`);
  doc.moveDown();
  doc.fontSize(15).text(`Bio: ${portfolioData.bio}`);
  doc.moveDown();
  doc.fontSize(15).text('Skills:');
  doc.fontSize(12).text(`Soft Skills: ${portfolioData.skills.softSkills.join(', ')}`);
  doc.fontSize(12).text(`Technical Skills: ${portfolioData.skills.technicalSkills.join(', ')}`);
  doc.moveDown();
  doc.fontSize(15).text('Academic Background:');
  portfolioData.academicBackground.forEach((academic) => {
    doc.fontSize(12).text(`Institute: ${academic.institute}, Degree: ${academic.degree}, Year: ${academic.year}, Grade: ${academic.grade}`);
  });
  doc.moveDown();
  doc.fontSize(15).text('Work Experience:');
  portfolioData.workExperience.forEach((work) => {
    doc.fontSize(12).text(`Company: ${work.companyName}, Duration: ${work.jobDuration}, Responsibilities: ${work.jobResponsibilities.join(', ')}`);
  });
  doc.moveDown();
  doc.fontSize(15).text('Projects:');
  doc.fontSize(12).text(portfolioData.projects.join(', '));

  doc.end();
};

module.exports = generatePortfolioPDF;
