import axios from 'axios';

// Create a globally configured axios instance targeted for local LLM usage
const api = axios.create({
  // Extended timeout to 60s to allow for local model processing
  timeout: 60000
});

// Interceptor to uniformly handle the timeout across the entire app
api.interceptors.response.use(
  (response) => {
    // Inject the raw latency measurement into the response data for the LatencyBadge
    if (response.config.metadata && response.config.metadata.startTime) {
       response.data._client_latency = Date.now() - response.config.metadata.startTime;
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.message = "Response time exceeded. Please try again or use manual assessment.";
      error.isTimeout = true;
    }
    return Promise.reject(error);
  }
);

// Inject start time for client-side latency tracking
api.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

export default api;
