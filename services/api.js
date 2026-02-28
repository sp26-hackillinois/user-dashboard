import axios from 'axios';
import { registry } from '@/data/registry';

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

export const fetchRegistry = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(registry.map(item => ({
        name: item.name,
        description: item.description,
        cost: `$${item.price_usd.toFixed(2)}`,
        id: item.service_id,
        category: item.category
      })));
    }, 300);
  });
};

export const sendAgentMessage = async (prompt, apiKey) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'requires_signature',
        service: 'Live Weather API',
        cost_usd: 0.01,
        transaction_payload: 'base64encodedtransaction...'
      });
    }, 1500);
  });
};

export function discoverByIntent(query, limit = 3) {
  const tokens = query.toLowerCase().split(/\s+/);

  const scored = registry.map(service => {
    const haystack = [
      ...service.tags,
      service.category.toLowerCase(),
      service.name.toLowerCase(),
    ];
    const score = tokens.reduce((acc, token) => {
      return acc + haystack.filter(h => h.includes(token)).length;
    }, 0);
    return { ...service, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default api;
