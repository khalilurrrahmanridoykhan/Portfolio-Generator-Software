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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Portfolio</h2>
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
            <input type="text" name="softSkills" value={portfolioData.skills.softSkills.join(', ')} onChange={handleSkillsChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Technical Skills:</label>
            <input type="text" name="technicalSkills" value={portfolioData.skills.technicalSkills.join(', ')} onChange={handleSkillsChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-600">Projects:</label>
            <input type="text" name="projects" value={portfolioData.projects.join(', ')} onChange={(e) => handleChange({ target: { name: 'projects', value: e.target.value.split(', ') } })} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
          </div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Create Portfolio</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePortfolio;