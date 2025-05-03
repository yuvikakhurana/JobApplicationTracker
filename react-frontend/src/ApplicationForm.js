import React, { useState } from "react";
import axios from "axios";

const ApplicationForm = ({ setShowForm, fetchApplications }) => {
  const [formData, setFormData] = useState({
    company: "",
    job_title: "",
    status: "Applied",
    applied_date: "",
    deadline: "",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/applications`, formData);
      fetchApplications(); // Fetch the updated list of applications
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      console.error("Error adding application", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Company</label>
      <input type="text" name="company" onChange={handleInputChange} value={formData.company} required />
      
      <label>Job Title</label>
      <input type="text" name="job_title" onChange={handleInputChange} value={formData.job_title} required />
      
      <label>Status</label>
      <select name="status" onChange={handleInputChange} value={formData.status}>
        <option value="Applied">Applied</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Rejected">Rejected</option>
        <option value="Offer">Offer</option>
      </select>
      
      <label>Applied Date</label>
      <input type="date" name="applied_date" onChange={handleInputChange} value={formData.applied_date} required />
      
      <label>Deadline</label>
      <input type="date" name="deadline" onChange={handleInputChange} value={formData.deadline} required />
      
      <label>Notes</label>
      <textarea name="notes" onChange={handleInputChange} value={formData.notes} />
      
      <button type="submit">Add Application</button>
    </form>
  );
};

export default ApplicationForm;