import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance'; // Import the custom Axios instance

const CreatePortfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    fullName: '',
    contactInfo: '',
    bio: '',
    skills: { softSkills: [], technicalSkills: [] },
    academicBackground: [{ institute: '', degree: '', year: '', grade: '' }],
    workExperience: [{ companyName: '', jobDuration: '', jobResponsibilities: [] }],
    projects: []
  });
  const [photo, setPhoto] = useState(null); // New state for photo file
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const { name, value } = e.target;
    setPortfolioData((prevData) => ({
      ...prevData,
      skills: { ...prevData.skills, [name]: value.split(', ') }
    }));
  };

  const handleAcademicChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAcademic = [...portfolioData.academicBackground];
    updatedAcademic[index][name] = value;
    setPortfolioData((prevData) => ({ ...prevData, academicBackground: updatedAcademic }));
  };

  const handleWorkChange = (index, e) => {
    const { name, value } = e.target;
    const updatedWork = [...portfolioData.workExperience];
    if (name === 'jobResponsibilities') {
      updatedWork[index][name] = value.split(', ');
    } else {
      updatedWork[index][name] = value;
    }
    setPortfolioData((prevData) => ({ ...prevData, workExperience: updatedWork }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (photo) {
      formData.append('photo', photo);
    }
    formData.append('portfolioData', JSON.stringify(portfolioData));

    try {
      const response = await axiosInstance.post('/portfolio', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      console.log('Portfolio created successfully', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating portfolio:', error.response ? error.response.data : error.message); // Add detailed error logging
    }
  };

  return (
    <div>
      <h2>Create Portfolio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={portfolioData.fullName} onChange={handleChange}  />
        </div>
        <div>
          <label>Contact Info:</label>
          <input type="text" name="contactInfo" value={portfolioData.contactInfo} onChange={handleChange}  />
        </div>
        <div>
          <label>Photo:</label>
          <input type="file" name="photo" onChange={handlePhotoChange} />
        </div>
        <div>
          <label>Bio:</label>
          <textarea name="bio" value={portfolioData.bio} onChange={handleChange}  />
        </div>
        <div>
          <label>Soft Skills:</label>
          <input type="text" name="softSkills" value={portfolioData.skills.softSkills.join(', ')} onChange={handleSkillsChange} />
        </div>
        <div>
          <label>Technical Skills:</label>
          <input type="text" name="technicalSkills" value={portfolioData.skills.technicalSkills.join(', ')} onChange={handleSkillsChange} />
        </div>
        {portfolioData.academicBackground.map((academic, index) => (
          <div key={index}>
            <h3>Academic Background {index + 1}</h3>
            <div>
              <label>Institute:</label>
              <input type="text" name="institute" value={academic.institute} onChange={(e) => handleAcademicChange(index, e)}  />
            </div>
            <div>
              <label>Degree:</label>
              <input type="text" name="degree" value={academic.degree} onChange={(e) => handleAcademicChange(index, e)}  />
            </div>
            <div>
              <label>Year:</label>
              <input type="text" name="year" value={academic.year} onChange={(e) => handleAcademicChange(index, e)}  />
            </div>
            <div>
              <label>Grade:</label>
              <input type="text" name="grade" value={academic.grade} onChange={(e) => handleAcademicChange(index, e)}  />
            </div>
          </div>
        ))}
        {portfolioData.workExperience.map((work, index) => (
          <div key={index}>
            <h3>Work Experience {index + 1}</h3>
            <div>
              <label>Company Name:</label>
              <input type="text" name="companyName" value={work.companyName} onChange={(e) => handleWorkChange(index, e)}  />
            </div>
            <div>
              <label>Job Duration:</label>
              <input type="text" name="jobDuration" value={work.jobDuration} onChange={(e) => handleWorkChange(index, e)}  />
            </div>
            <div>
              <label>Job Responsibilities:</label>
              <input type="text" name="jobResponsibilities" value={work.jobResponsibilities.join(', ')} onChange={(e) => handleWorkChange(index, e)}  />
            </div>
          </div>
        ))}
        <div>
          <label>Projects:</label>
          <input type="text" name="projects" value={portfolioData.projects.join(', ')} onChange={(e) => handleChange({ target: { name: 'projects', value: e.target.value.split(', ') } })} />
        </div>
        <button type="submit">Create Portfolio</button>
      </form>
    </div>
  );
};

export default CreatePortfolio;