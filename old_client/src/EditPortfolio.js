import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPortfolio = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState({
    fullName: '',
    contactInfo: '',
    photoUrl: '',
    bio: '',
    skills: { softSkills: [], technicalSkills: [] },
    academicBackground: [{ institute: '', degree: '', year: '', grade: '' }],
    workExperience: [{ companyName: '', jobDuration: '', jobResponsibilities: [] }],
    projects: []
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5001/api/portfolio/${portfolioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPortfolioData(response.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Portfolio not found');
      }
    };

    fetchPortfolio();
  }, [portfolioId, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5001/api/portfolio/${portfolioId}`, { token, portfolioData });
      console.log('Portfolio updated successfully', response.data);
      navigate('/all-portfolios');
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Edit Portfolio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={portfolioData.fullName} onChange={handleChange}  />
        </div>
        <div>
          <label>Contact Info:</label>
          <input type="text" name="contactInfo" value={portfolioData.contactInfo} onChange={handleChange} />
        </div>
        <div>
          <label>Photo URL:</label>
          <input type="text" name="photoUrl" value={portfolioData.photoUrl} onChange={handleChange} />
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
              <input type="text" name="institute" value={academic.institute} onChange={(e) => handleAcademicChange(index, e)} />
            </div>
            <div>
              <label>Degree:</label>
              <input type="text" name="degree" value={academic.degree} onChange={(e) => handleAcademicChange(index, e)} />
            </div>
            <div>
              <label>Year:</label>
              <input type="text" name="year" value={academic.year} onChange={(e) => handleAcademicChange(index, e)} />
            </div>
            <div>
              <label>Grade:</label>
              <input type="text" name="grade" value={academic.grade} onChange={(e) => handleAcademicChange(index, e)} />
            </div>
          </div>
        ))}
        {portfolioData.workExperience.map((work, index) => (
          <div key={index}>
            <h3>Work Experience {index + 1}</h3>
            <div>
              <label>Company Name:</label>
              <input type="text" name="companyName" value={work.companyName} onChange={(e) => handleWorkChange(index, e)} />
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
        <button type="submit">Update Portfolio</button>
      </form>
    </div>
  );
};

export default EditPortfolio;