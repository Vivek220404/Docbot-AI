import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  checkHealth: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw new Error('Unable to connect to server');
    }
  },

  // Analyze symptoms
  analyzeSymptoms: async (symptomsData) => {
    try {
      const response = await api.post('/analyze-symptoms', symptomsData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid symptoms data');
      }
      throw new Error('Failed to analyze symptoms. Please try again.');
    }
  },

  // Chat with AI
  sendChatMessage: async (messageData) => {
    try {
      const response = await api.post('/chat', messageData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid message');
      }
      throw new Error('Failed to send message. Please try again.');
    }
  },

  // Get medical information about a condition
  getMedicalInfo: async (condition) => {
    try {
      const response = await api.get(`/medical-info/${encodeURIComponent(condition)}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.detail || 'Invalid condition');
      }
      throw new Error('Failed to retrieve medical information. Please try again.');
    }
  },
};

export default api;
