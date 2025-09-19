import axios from 'axios';

const API_BASE_URL = "https://de1.cantamen.de/casirest/v3/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  config.meta = { ...config.meta, startTime: new Date() };
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.meta?.startTime) {
      const startTime = response.config.meta.startTime;
      const endTime = new Date();
      response.duration = endTime.getTime() - startTime.getTime();
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
