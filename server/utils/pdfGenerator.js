const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generatePortfolioPDF = async (portfolioData, fileName, format) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let photoHtml = '';
  if (portfolioData.photoUrl) {
    const photoPath = path.join(__dirname, '..', portfolioData.photoUrl);
    if (fs.existsSync(photoPath)) {
      const photoData = fs.readFileSync(photoPath).toString('base64');
      const photoMimeType = path.extname(photoPath).substring(1); // Get the file extension without the dot
      photoHtml = `
        <div class="photo">
          <img src="data:image/${photoMimeType};base64,${photoData}" alt="Photo" style="width: 100px; height: 100px;">
        </div>`;
    } else {
      console.error(`Photo not found at path: ${photoPath}`);
    }
  }

  let htmlContent = '';

  if (format === 'ridoykhanresume') {
    htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { width: 100%; margin: auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .photo { text-align: center; margin: 20px 0; }
            .section { margin: 20px 0; }
            .section-title { font-size: 20px; font-weight: bold; color: #333; border-bottom: 2px solid #333; padding-bottom: 5px; }
            .section-content { font-size: 14px; margin-top: 10px; }
            .skills { display: flex; justify-content: space-between; }
            .skills div { width: 48%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${portfolioData.fullName}</h1>
            </div>
            ${photoHtml}
            <div class="section">
              <div class="section-title">Contact Info</div>
              <div class="section-content">${portfolioData.contactInfo}</div>
            </div>
            <div class="section">
              <div class="section-title">Bio</div>
              <div class="section-content">${portfolioData.bio}</div>
            </div>
            <div class="section">
              <div class="section-title">Skills</div>
              <div class="section-content skills">
                <div>Soft Skills: ${portfolioData.skills.softSkills.join(', ')}</div>
                <div>Technical Skills: ${portfolioData.skills.technicalSkills.join(', ')}</div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Academic Background</div>
              ${portfolioData.academicBackground.map(academic => `
                <div class="section-content">Institute: ${academic.institute}, Degree: ${academic.degree}, Year: ${academic.year}, Grade: ${academic.grade}</div>
              `).join('')}
            </div>
            <div class="section">
              <div class="section-title">Work Experience</div>
              ${portfolioData.workExperience.map(work => `
                <div class="section-content">Company: ${work.companyName}, Duration: ${work.jobDuration}, Responsibilities: ${work.jobResponsibilities.join(', ')}</div>
              `).join('')}
            </div>
            <div class="section">
              <div class="section-title">Projects</div>
              <div class="section-content">${portfolioData.projects.join(', ')}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    // Default format
    htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { width: 80%; margin: auto; }
            .header { text-align: center; }
            .photo { text-align: center; margin: 20px 0; }
            .section { margin: 20px 0; }
            .section-title { font-size: 18px; font-weight: bold; }
            .section-content { font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${portfolioData.fullName}</h1>
            </div>
            ${photoHtml}
            <div class="section">
              <div class="section-title">Contact Info:</div>
              <div class="section-content">${portfolioData.contactInfo}</div>
            </div>
            <div class="section">
              <div class="section-title">Bio:</div>
              <div class="section-content">${portfolioData.bio}</div>
            </div>
            <div class="section">
              <div class="section-title">Skills:</div>
              <div class="section-content">Soft Skills: ${portfolioData.skills.softSkills.join(', ')}</div>
              <div class="section-content">Technical Skills: ${portfolioData.skills.technicalSkills.join(', ')}</div>
            </div>
            <div class="section">
              <div class="section-title">Academic Background:</div>
              ${portfolioData.academicBackground.map(academic => `
                <div class="section-content">Institute: ${academic.institute}, Degree: ${academic.degree}, Year: ${academic.year}, Grade: ${academic.grade}</div>
              `).join('')}
            </div>
            <div class="section">
              <div class="section-title">Work Experience:</div>
              ${portfolioData.workExperience.map(work => `
                <div class="section-content">Company: ${work.companyName}, Duration: ${work.jobDuration}, Responsibilities: ${work.jobResponsibilities.join(', ')}</div>
              `).join('')}
            </div>
            <div class="section">
              <div class="section-title">Projects:</div>
              <div class="section-content">${portfolioData.projects.join(', ')}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  await page.setContent(htmlContent);
  await page.pdf({ path: fileName, format: 'A4' });

  await browser.close();
};

module.exports = generatePortfolioPDF;
