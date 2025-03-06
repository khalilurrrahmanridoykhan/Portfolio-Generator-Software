import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register'; // Corrected the import path

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>APP</h1>
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;