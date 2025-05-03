import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const fetchApplications = async () => {
  const response = await axios.get(`${API_URL}/applications`);
  return response.data;
};

export const fetchApplication = async (id) => {
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

export const createApplication = async (data) => {
  const response = await axios.post(`${API_URL}/applications`, data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await axios.put(`${API_URL}/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await axios.delete(`${API_URL}/applications/${id}`);
  return response.data;
};

export const fetchReports = async () => {
  const response = await axios.get(`${API_URL}/reports`);
  return response.data;
};

export const addInterview = async (data) => {
  const response = await axios.post(`${API_URL}/interviews`, data);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await axios.put(`${API_URL}/interviews/${id}`, data);
  return response.data;
};
