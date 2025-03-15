import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPortfolio = () => {
  const { portfolioId } = useParams();
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
    formData.append('pdfFormat', pdfFormat); // Append the selected PDF format

    try {
      const response = await axios.put(`http://localhost:5001/api/portfolio/${portfolioId}`, formData, {
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
        <h2 className="text-2xl font-bold text-center text-gray-900">Edit Portfolio</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={portfolioData.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Info:</label>
            <input
              type="text"
              name="contactInfo"
              value={portfolioData.contactInfo}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo:</label>
            <input
              type="file"
              name="photo"
              onChange={handlePhotoChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio:</label>
            <textarea
              name="bio"
              value={portfolioData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Soft Skills:</label>
            <input
              type="text"
              name="softSkills"
              value={portfolioData.skills.softSkills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Technical Skills:</label>
            <input
              type="text"
              name="technicalSkills"
              value={portfolioData.skills.technicalSkills.join(', ')}
              onChange={handleSkillsChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {portfolioData.academicBackground.map((academic, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Academic Background {index + 1}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Institute:</label>
                <input
                  type="text"
                  name="institute"
                  value={academic.institute}
                  onChange={(e) => handleAcademicChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree:</label>
                <input
                  type="text"
                  name="degree"
                  value={academic.degree}
                  onChange={(e) => handleAcademicChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Year:</label>
                <input
                  type="text"
                  name="year"
                  value={academic.year}
                  onChange={(e) => handleAcademicChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade:</label>
                <input
                  type="text"
                  name="grade"
                  value={academic.grade}
                  onChange={(e) => handleAcademicChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
          {portfolioData.workExperience.map((work, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Work Experience {index + 1}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                <input
                  type="text"
                  name="companyName"
                  value={work.companyName}
                  onChange={(e) => handleWorkChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Duration:</label>
                <input
                  type="text"
                  name="jobDuration"
                  value={work.jobDuration}
                  onChange={(e) => handleWorkChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Responsibilities:</label>
                <input
                  type="text"
                  name="jobResponsibilities"
                  value={work.jobResponsibilities.join(', ')}
                  onChange={(e) => handleWorkChange(index, e)}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">Projects:</label>
            <input
              type="text"
              name="projects"
              value={portfolioData.projects.join(', ')}
              onChange={(e) => handleChange({ target: { name: 'projects', value: e.target.value.split(', ') } })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PDF Format:</label>
            <select value={pdfFormat} onChange={(e) => setPdfFormat(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="default">Template 1</option>
              <option value="ridoykhanresume">Template 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Portfolio
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPortfolio;