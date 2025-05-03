import React, { useState, useEffect } from 'react';

function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    status: 'APPLIED',
    date_applied: '',
    location: '',
    salary: '',
  });
  const [reportFilters, setReportFilters] = useState({
    company: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const addJob = async (event) => {
    event.preventDefault();
    try {
      await fetch('/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob),
      });
      fetchJobs();
      setNewJob({
        company: '',
        position: '',
        status: 'APPLIED',
        date_applied: '',
        location: '',
        salary: '',
      });
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const updateJob = async (id, updatedJob) => {
    try {
      await fetch(`/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJob),
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await fetch(`/jobs/${id}`, {
        method: 'DELETE',
      });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const fetchReport = async () => {
    try {
      let url = `/report?start_date=${reportFilters.startDate}&end_date=${reportFilters.endDate}`;
      if (reportFilters.company) url += `&company=${reportFilters.company}`;
      if (reportFilters.status) url += `&status=${reportFilters.status}`;

      const response = await fetch(url);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  return (
    <div>
      <h1>Job Tracker</h1>

      <form onSubmit={addJob}>
        <input type="text" placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} required />
        <input type="text" placeholder="Position" value={newJob.position} onChange={(e) => setNewJob({ ...newJob, position: e.target.value })} required />
        <select value={newJob.status} onChange={(e) => setNewJob({ ...newJob, status: e.target.value })} required>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFERED">Offered</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>
        <input type="date" value={newJob.date_applied} onChange={(e) => setNewJob({ ...newJob, date_applied: e.target.value })} required />
        <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
        <input type="number" placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
        <button type="submit">Add Job</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company</th>
            <th>Position</th>
            <th>Status</th>
            <th>Date Applied</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.company}</td>
              <td>{job.position}</td>
              <td>{job.status}</td>
              <td>{job.date_applied}</td>
              <td>{job.location}</td>
              <td>{job.salary}</td>
              <td>
                <button onClick={() => {
                  const company = prompt('Enter new company:', job.company);
                  const position = prompt('Enter new position:', job.position);
                  const status = prompt('Enter new status:', job.status);
                  const date_applied = prompt('Enter new date applied:', job.date_applied);
                  const location = prompt('Enter new location:', job.location);
                  const salary = prompt('Enter new salary:', job.salary);
                  if (company || position || status || date_applied || location || salary) {
                    updateJob(job.id, {
                      company: company || job.company, position: position || job.position, status: status || job.status,
                      date_applied: date_applied || job.date_applied, location: location || job.location, salary: parseFloat(salary) || job.salary,
                    });
                  }
                }}>Edit</button>
                <button onClick={() => deleteJob(job.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Reports</h2>
      <form>
        <input type="text" placeholder="Company" value={reportFilters.company} onChange={(e) => setReportFilters({ ...reportFilters, company: e.target.value })} />
        <select value={reportFilters.status} onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFERED">Offered</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>
        <input type="date" placeholder="Start Date" value={reportFilters.startDate} onChange={(e) => setReportFilters({ ...reportFilters, startDate: e.target.value })} />
        <input type="date" placeholder="End Date" value={reportFilters.endDate} onChange={(e) => setReportFilters({ ...reportFilters, endDate: e.target.value })} />
        <button type="button" onClick={fetchReport}>Generate Report</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Status</th>
            <th>Total</th>
            <th>Average Salary</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((report, index) => (
            <tr key={index}>
              <td>{report.company}</td>
              <td>{report.status}</td>
              <td>{report.total}</td>
              <td>{report.avg_salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTracker;