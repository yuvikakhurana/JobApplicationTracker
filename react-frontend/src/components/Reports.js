import React, { useEffect, useState } from 'react';

const thStyle = {
  borderBottom: '2px solid #ccc',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f9f9f9'
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee'
};

const rowEven = {
  backgroundColor: '#fff'
};

const rowOdd = {
  backgroundColor: '#f5f5f5'
};

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);

  const fetchReports = () => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);
    if (location) queryParams.append('location', location);
    if (status) queryParams.append('status', status);

    fetch(`${process.env.REACT_APP_API_URL}/report?${queryParams.toString()}`)
      .then(response => response.json())
      .then(data => setReportData(data))
      .catch(error => console.error("Fetch error:", error));
  };

  const fetchLocationOptions = () => {
    fetch(`${process.env.REACT_APP_API_URL}/locations`)
      .then(res => res.json())
      .then(data => setLocationOptions(data || []))  // <-- safe fallback
      .catch(err => {
        console.error("Error fetching locations:", err);
        setLocationOptions([]);  // fallback on error
      });
  };

  useEffect(() => {
    fetchLocationOptions();
  }, []);

  return (
    <div>
      <h2>Job Application Reports</h2>
      <div>
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

        <label>Location: </label>
        <select value={location} onChange={e => setLocation(e.target.value)}>
          <option value="">All</option>
          {Array.isArray(locationOptions) &&
            locationOptions.map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
        </select>

        <label>Status: </label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFERED">Offered</option>
          <option value="REJECTED">Rejected</option>
          <option value="PENDING">Pending</option>
        </select>

        <button onClick={fetchReports}>Filter</button>
      </div>

      {reportData && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div><strong>Total Applications:</strong> {reportData.total_applications}</div>
          <div><strong>Average Salary:</strong> ${reportData.average_salary?.toFixed(2) || 'N/A'}</div>
          <div><strong>Earliest Application:</strong> {reportData.earliest_application}</div>
          <div><strong>Latest Application:</strong> {reportData.latest_application}</div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h4>Status Breakdown</h4>
            <ul>
              {Object.entries(reportData.status_breakdown || {}).map(([status, count], idx) => (
                <li key={idx}><strong>{status}:</strong> {count}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Location Breakdown</h4>
            <ul>
              {Object.entries(reportData.location_breakdown || {}).map(([loc, count], idx) => (
                <li key={idx}><strong>{loc}:</strong> {count}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4>Matching Applications</h4>
          {Array.isArray(reportData.results) && reportData.results.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th >Company</th>
                  <th>Position</th>
                  <th >Status</th>
                  <th >Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {reportData.results.map((job, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? rowEven : rowOdd}>
                    <td style={tdStyle}>{job.company}</td>
                    <td style={tdStyle}>{job.position}</td>
                    <td style={tdStyle}>{job.status}</td>
                    <td style={tdStyle}>{job.date_applied}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No matching applications found.</p>
          )}
        </div>
      </div>

      )}
    </div>
  );
};

export default Reports;
