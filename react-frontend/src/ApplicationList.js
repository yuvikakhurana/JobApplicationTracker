import React from "react";
import axios from "axios";

const ApplicationList = ({ applications, fetchApplications }) => {
  const handleDelete = async (appId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/applications/${appId}`);
      fetchApplications(); // Fetch the updated list after deletion
    } catch (error) {
      console.error("Error deleting application", error);
    }
  };

  return (
    <div>
      <h2>Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.app_id}>
              <td>{app.company}</td>
              <td>{app.job_title}</td>
              <td>{app.status}</td>
              <td>{app.applied_date}</td>
              <td>
                <button onClick={() => handleDelete(app.app_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;