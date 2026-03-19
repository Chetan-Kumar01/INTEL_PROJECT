import api from '../config/axios';
const API_BASE = 'http://localhost:5001/api';

class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

const handleApiCall = async (callPromise) => {
  try {
    const response = await callPromise;
    // Dispatch a global event for the LatencyBadge fixed UI to catch
    if (response.data && response.data._client_latency) {
      const event = new CustomEvent('api-latency-update', { detail: { latency: response.data._client_latency } });
      window.dispatchEvent(event);
    }
    return response.data;
  } catch (error) {
    if (error.isTimeout) {
      throw new ApiError(error.message, 408, null);
    }
    
    let errorMessage = 'Request failed';
    if (error.response?.data?.error) {
       errorMessage = error.response.data.error;
    } else if (error.code === 'ERR_NETWORK') {
       errorMessage = 'Cannot connect to backend server. Make sure the Node.js API is running on port 5001.';
    } else if (error.message) {
       errorMessage = error.message;
    }

    throw new ApiError(
      errorMessage,
      error.response?.status || 500,
      error.response?.data || null
    );
  }
};

// Forcefully override the timeout on the imported Axios singleton 
// to bypass Vite caching/HMR issues where the old 380ms limit persists in memory
api.defaults.timeout = 60000;

export async function processTriage(patientHistory, emergencyDescription) {
  return handleApiCall(api.post(`${API_BASE}/triage`, { patientHistory, emergencyDescription }));
}

export async function processDetailedTriage(patientHistory, emergencyDescription) {
  return handleApiCall(api.post(`${API_BASE}/triage/detailed`, { patientHistory, emergencyDescription }));
}

export async function compareApproaches(patientHistory, emergencyDescription) {
  return handleApiCall(api.post(`${API_BASE}/compare`, { patientHistory, emergencyDescription }));
}

export async function getLogs(limit = 10) {
  return handleApiCall(api.get(`${API_BASE}/logs`, { params: { limit } }));
}

export async function getHistory(limit = 20) {
  return handleApiCall(api.get(`${API_BASE}/history`, { params: { limit } }));
}

export async function saveCaseHistory(caseData) {
  return handleApiCall(api.post(`${API_BASE}/history`, caseData));
}

export async function checkHealth() {
  return handleApiCall(api.get('http://localhost:5001/health'));
}

export { ApiError };
