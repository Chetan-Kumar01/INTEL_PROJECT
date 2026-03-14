const API_BASE = 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || 'Request failed',
      response.status,
      data
    );
  }

  return data;
}

export async function processTriage(patientHistory, emergencyDescription) {
  const response = await fetch(`${API_BASE}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientHistory, emergencyDescription })
  });

  return handleResponse(response);
}

export async function compareApproaches(patientHistory, emergencyDescription) {
  const response = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientHistory, emergencyDescription })
  });

  return handleResponse(response);
}

export async function getLogs(limit = 10) {
  const response = await fetch(`${API_BASE}/logs?limit=${limit}`);
  return handleResponse(response);
}

export async function checkHealth() {
  const response = await fetch('http://localhost:5000/health');
  return handleResponse(response);
}

export { ApiError };
