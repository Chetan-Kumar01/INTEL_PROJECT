import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const processOptimized = async (caseDescription, apiKey) => {
  const response = await axios.post(`${API_BASE}/triage/optimized`, {
    caseDescription,
    apiKey
  });
  return response.data;
};

export const processNaive = async (caseDescription, apiKey) => {
  const response = await axios.post(`${API_BASE}/triage/naive`, {
    caseDescription,
    apiKey
  });
  return response.data;
};
