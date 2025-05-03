import React, { useState, useEffect } from "react";
import axios from "axios";

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports`);
        setReport(response.data);
      } catch (error) {
        console.error("Error fetching report", error);
      }
    };
    fetchReport();
  }, []);

  return (
    <div>
      <h2>Application Report</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Total Applications</th>
            <th>Success Rate</th>
          </tr>
        </thead>
        <tbody>
          {report.map((row, index) => (
            <tr key={index}>
              <td>{row.company}</td>
              <td>{row.total_applied}</td>
              <td>{(row.success_rate * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;