import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        setPortfolios(response.data);
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

  return (
    <div>
      <h2>All Portfolios</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Contact Info</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portfolios.map((portfolio) => (
            <tr key={portfolio._id}>
              <td>{portfolio.fullName}</td>
              <td>{portfolio.contactInfo}</td>
              <td>{portfolio.bio}</td>
              <td>
                <button onClick={() => handleEdit(portfolio._id)}>Edit</button>
                <button onClick={() => handleDelete(portfolio._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllPortfolios;