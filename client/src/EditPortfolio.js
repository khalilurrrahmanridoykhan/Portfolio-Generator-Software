import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from './axiosInstance'; // Import the custom Axios instance

const EditPortfolio = () => {
  const { portfolioId } = useParams();
  const [portfolioData, setPortfolioData] = useState({
    fullName: '',
    contactInfo: '',
    bio: '',
    skills: { softSkills: [''], technicalSkills: [''] },
    academicBackground: [{ institute: '', degree: '', year: '', grade: '' }],
    workExperience: [{ companyName: '', jobDuration: '', jobResponsibilities: [] }],
    projects: ['']
  });
  const [photo, setPhoto] = useState(null); // New state for photo file
  const [pdfFormat, setPdfFormat] = useState('default'); // New state for PDF format
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
        setPdfFormat(response.data.pdfFormat || 'default'); // Set the PDF format
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

  const handleSkillsChange = (index, type, value) => {
    const updatedSkills = [...portfolioData.skills[type]];
    updatedSkills[index] = value;
    setPortfolioData((prevData) => ({
      ...prevData,
      skills: { ...prevData.skills, [type]: updatedSkills }
    }));
  };

  const addSkillField = (type) => {
    setPortfolioData((prevData) => ({
      ...prevData,
      skills: { ...prevData.skills, [type]: [...prevData.skills[type], ''] }
    }));
  };

  const handleAcademicChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAcademic = [...portfolioData.academicBackground];
    updatedAcademic[index][name] = value;
    setPortfolioData((prevData) => ({ ...prevData, academicBackground: updatedAcademic }));
  };

  const addAcademicField = () => {
    setPortfolioData((prevData) => ({
      ...prevData,
      academicBackground: [...prevData.academicBackground, { institute: '', degree: '', year: '', grade: '' }]
    }));
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

  const addWorkField = () => {
    setPortfolioData((prevData) => ({
      ...prevData,
      workExperience: [...prevData.workExperience, { companyName: '', jobDuration: '', jobResponsibilities: [] }]
    }));
  };

  const handleProjectsChange = (index, value) => {
    const updatedProjects = [...portfolioData.projects];
    updatedProjects[index] = value;
    setPortfolioData((prevData) => ({
      ...prevData,
      projects: updatedProjects
    }));
  };

  const addProjectField = () => {
    setPortfolioData((prevData) => ({
      ...prevData,
      projects: [...prevData.projects, '']
    }));
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
    formData.append('pdfFormat', pdfFormat); // Append the selected PDF format

    try {
      const response = await axiosInstance.put(`/portfolio/${portfolioId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Edit Portfolio</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Full Name:</label>
            <input type="text" name="fullName" value={portfolioData.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Contact Info:</label>
            <input type="text" name="contactInfo" value={portfolioData.contactInfo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Photo:</label>
            <input type="file" name="photo" onChange={handlePhotoChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Bio:</label>
            <textarea name="bio" value={portfolioData.bio} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Soft Skills:</label>
            {portfolioData.skills.softSkills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  placeholder={`Soft Skill ${index + 1}`}
                  onChange={(e) => handleSkillsChange(index, 'softSkills', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
                <button type="button" onClick={() => addSkillField('softSkills')} className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-full">+</button>
              </div>
            ))}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Technical Skills:</label>
            {portfolioData.skills.technicalSkills.map((skill, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={skill}
                  placeholder={`Technical Skill ${index + 1}`}
                  onChange={(e) => handleSkillsChange(index, 'technicalSkills', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
                <button type="button" onClick={() => addSkillField('technicalSkills')} className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-full">+</button>
              </div>
            ))}
          </div>
          {portfolioData.academicBackground.map((academic, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-700">Academic Background {index + 1}</h3>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Institute:</label>
                <input type="text" name="institute" value={academic.institute} onChange={(e) => handleAcademicChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Degree:</label>
                <input type="text" name="degree" value={academic.degree} onChange={(e) => handleAcademicChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Year:</label>
                <input type="text" name="year" value={academic.year} onChange={(e) => handleAcademicChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Grade:</label>
                <input type="text" name="grade" value={academic.grade} onChange={(e) => handleAcademicChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addAcademicField} className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-full">+</button>
          {portfolioData.workExperience.map((work, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-700">Work Experience {index + 1}</h3>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Company Name:</label>
                <input type="text" name="companyName" value={work.companyName} onChange={(e) => handleWorkChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Job Duration:</label>
                <input type="text" name="jobDuration" value={work.jobDuration} onChange={(e) => handleWorkChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">Job Responsibilities:</label>
                <input type="text" name="jobResponsibilities" value={work.jobResponsibilities.join(', ')} onChange={(e) => handleWorkChange(index, e)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addWorkField} className="px-2 py-1 mt-2 text-white bg-blue-500 rounded-full">+</button>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Projects:</label>
            {portfolioData.projects.map((project, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={project}
                  placeholder={`Project ${index + 1}`}
                  onChange={(e) => handleProjectsChange(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
                />
                <button type="button" onClick={addProjectField} className="px-2 py-1 ml-2 text-white bg-blue-500 rounded-full">+</button>
              </div>
            ))}
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">PDF Format:</label>
            <select value={pdfFormat} onChange={(e) => setPdfFormat(e.target.value)} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300">
              <option value="default">Template 1</option>
              <option value="ridoykhanresume">Template 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Update Portfolio</button>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolio;