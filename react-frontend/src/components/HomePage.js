import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to your Job Application Tracker!</h1>
      {/* <button onClick={() => navigate('/add')}>Add an Application</button> */}
      <button onClick={() => navigate('/view')}>View Applications</button>
      <button onClick={() => navigate('/report')}>View Reports</button>
    </div>
  );
};

export default HomePage;