import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddApplication from './components/AddApplication';
import ViewApplications from './components/ViewApplications';
import Reports from './components/Reports';
import './App.css';

const App = () => {
  return (
    <Router>
     <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddApplication />} />
        <Route path="/view" element={<ViewApplications />} />
        <Route path="/report" element={<Reports />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;