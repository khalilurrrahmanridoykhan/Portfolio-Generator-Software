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
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 3px solid #007BFF;
        }
        .header h1 {
            margin: 10px 0;
            color: #007BFF;
        }
        .photo {
            text-align: center;
            margin: 20px 0;
        }
        .photo img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 3px solid #007BFF;
        }
        .section {
            margin: 30px 0;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 8px;
        }
        .section-title {
            font-size: 22px;
            font-weight: bold;
            color: #007BFF;
            margin-bottom: 10px;
            border-left: 5px solid #007BFF;
            padding-left: 10px;
        }
        .skills {
            display: flex;
            justify-content: space-between;
        }
        .skills div {
            width: 48%;
        }
        .work-experience, .academic-background {
            display: flex;
            flex-direction: column;
        }
        .work-experience div, .academic-background div {
            margin: 10px 0;
            padding: 10px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${portfolioData.fullName}</h1>
            <p>${portfolioData.contactInfo}</p>
        </div>
        <div class="photo">
            ${photoHtml}
        </div>
        <div class="section">
            <div class="section-title">Bio</div>
            <div>${portfolioData.bio}</div>
        </div>
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">
                <div><strong>Soft Skills:</strong> ${portfolioData.skills.softSkills.join(', ')}</div>
                <div><strong>Technical Skills:</strong> ${portfolioData.skills.technicalSkills.join(', ')}</div>
            </div>
        </div>
        <div class="section academic-background">
            <div class="section-title">Academic Background</div>
            ${portfolioData.academicBackground.map(academic => `
                <div><strong>${academic.degree}</strong> - ${academic.institute} (${academic.year}, ${academic.grade})</div>
            `).join('')}
        </div>
        <div class="section work-experience">
            <div class="section-title">Work Experience</div>
            ${portfolioData.workExperience.map(work => `
                <div><strong>${work.companyName}</strong><br>
                Duration: ${work.jobDuration}<br>
                Responsibilities: ${work.jobResponsibilities.join(', ')}</div>
            `).join('')}
        </div>
        <div class="section">
            <div class="section-title">Projects</div>
            <div>${portfolioData.projects.join(', ')}</div>
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
