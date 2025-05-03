import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchApplications = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      fetch(`${API_URL}/jobs`)
      .then(response => response.json())
      .then(data => setApplications(data))
      .catch(error => console.error("Fetch error:", error));
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setApplications((prevApps) => prevApps.filter((app) => app.id !== id));
      alert("Application deleted successfully");
    } else {
      alert("Failed to delete application");
    }
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setUpdatedData(application);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!editingApplication) return;

    const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${editingApplication.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      setApplications(prevApps =>
        prevApps.map(app =>
          app.id === editingApplication.id ? { ...app, ...updatedData } : app
        )
      );
      alert("Application updated successfully");
      setEditingApplication(null);
    } else {
      alert("Failed to update application");
    }
  };

  return (
    <div>
      <h2>Job Applications</h2>
      <button onClick={() => navigate('/add')}>Add an Application</button>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Date Applied</th>
            <th>Location</th>
            <th>Position</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(application => (
            <tr key={application.id}>
              {editingApplication?.id === application.id ? (
                Object.keys(updatedData).map((key) => (
                  <td key={key}>
                    <input type="text" name={key} value={updatedData[key] || ''} onChange={handleUpdateChange} />
                  </td>
                ))
              ) : (
                Object.keys(application).map((key) => (
                  key !== "id" && <td key={key}>{application[key]}</td>
                ))
              )}
              <td>
                {editingApplication?.id === application.id ? (
                  <>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingApplication(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(application)}>Edit</button>
                    <button onClick={() => handleDelete(application.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplications;