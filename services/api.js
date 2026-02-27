import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalVolume: '$142.50',
        transactionCount: 2850,
      });
    }, 300);
  });
};

export const generateApiKey = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        apiKey: 'mp_live_9x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c',
      });
    }, 500);
  });
};

export default api;
