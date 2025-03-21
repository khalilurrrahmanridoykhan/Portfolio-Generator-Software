import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaDownload } from 'react-icons/fa';

const AllPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/api/portfolio', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userId = JSON.parse(atob(token.split('.')[1])).userId; // Decode the token to get the user ID
        const userPortfolios = response.data.filter(portfolio => portfolio.userId === userId); // Filter portfolios by user ID
        setPortfolios(userPortfolios);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();
  }, [navigate]);

  const handleEdit = (portfolioId) => {
    navigate(`/edit-portfolio/${portfolioId}`);
  };

  const handleDelete = async (portfolioId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/portfolio/${portfolioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPortfolios(portfolios.filter((portfolio) => portfolio._id !== portfolioId));
    } catch (error) {
      console.error('Error deleting portfolio:', error);
    }
  };

  const handleDownload = async (portfolioId) => {
    const token = localStorage.getItem('token');
    console.log('Downloading portfolio with ID:', portfolioId); // Add this line to log the portfolio ID
    try {
      const response = await axios.get(`http://localhost:5001/api/portfolio/${portfolioId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `portfolio_${portfolioId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading portfolio:', error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-center text-gray-900">All Portfolios</h2>
          <Link to="/create-portfolio" className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Create Portfolio
          </Link>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Contact Info</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bio</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Download Portfolio</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {portfolios.map((portfolio) => (
              <tr key={portfolio._id}>
                <td className="px-6 py-4 text-sm text-gray-900">{portfolio.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{portfolio.contactInfo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{portfolio.bio}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(portfolio._id)}
                      className="px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio._id)}
                      className="px-2 py-1 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <button
                    onClick={() => handleDownload(portfolio._id)}
                    className="px-2 py-1 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPortfolios;