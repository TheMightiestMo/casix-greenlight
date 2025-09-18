import axios from 'axios';

const API_BASE_URL = "https://de1.cantamen.de/casirest/v3/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': '40859125-7a8d-f8fb-d4d3-d48f75728b35'

  }
});

export default apiClient;
