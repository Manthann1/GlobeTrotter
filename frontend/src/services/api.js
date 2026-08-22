import axios from 'axios';
import { INITIAL_TRIPS, CITIES_DATA, INITIAL_USER } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper for local storage persistence
const STORAGE_KEYS = {
  TRIPS: 'globetrotter_trips',
  CITIES: 'globetrotter_cities',
  USER: 'globetrotter_user',
};

export const getStoredData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing ${key} to storage:`, err);
  }
};

// Initialize default store if not present
if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
  setStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
}
if (!localStorage.getItem(STORAGE_KEYS.CITIES)) {
  setStoredData(STORAGE_KEYS.CITIES, CITIES_DATA);
}
if (!localStorage.getItem(STORAGE_KEYS.USER)) {
  setStoredData(STORAGE_KEYS.USER, INITIAL_USER);
}

// Trips API
export const api = {
  // Trips
  async getTrips() {
    try {
      const res = await apiClient.get('/trips');
      return res.data;
    } catch {
      return getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    }
  },

  async getTripById(id) {
    try {
      const res = await apiClient.get(`/trips/${id}`);
      return res.data;
    } catch {
      const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
      return trips.find((t) => t.id === id || t.shareToken === id) || null;
    }
  },

  async getTripByShareToken(token) {
    try {
      const res = await apiClient.get(`/shared/${token}`);
      return res.data;
    } catch {
      const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
      return trips.find((t) => t.shareToken === token || t.id === token) || null;
    }
  },

  async createTrip(tripData) {
    try {
      const res = await apiClient.post('/trips', tripData);
      return res.data;
    } catch {
      const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
      const newTrip = {
        id: `trip-${Date.now()}`,
        userId: 'u-101-alex',
        status: 'upcoming',
        isPublic: true,
        shareToken: `trip-${Date.now()}`,
        author: {
          name: 'Alex Explorer',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        stops: [],
        budget: {
          totalBudget: Number(tripData.totalBudget || 3000),
          dailyCap: Number(tripData.dailyCap || 250),
          categoryBreakdown: { lodging: 0, food: 0, activities: 0, transport: 0 },
        },
        ...tripData,
      };
      const updated = [newTrip, ...trips];
      setStoredData(STORAGE_KEYS.TRIPS, updated);
      return newTrip;
    }
  },

  async updateTrip(id, tripData) {
    try {
      const res = await apiClient.put(`/trips/${id}`, tripData);
      return res.data;
    } catch {
      const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
      const updated = trips.map((t) => (t.id === id ? { ...t, ...tripData } : t));
      setStoredData(STORAGE_KEYS.TRIPS, updated);
      return tripData;
    }
  },

  async deleteTrip(id) {
    try {
      await apiClient.delete(`/trips/${id}`);
      return true;
    } catch {
      const trips = getStoredData(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
      const updated = trips.filter((t) => t.id !== id);
      setStoredData(STORAGE_KEYS.TRIPS, updated);
      return true;
    }
  },

  // Cities & Search
  async getCities(query = '') {
    try {
      const res = await apiClient.get('/cities', { params: { q: query } });
      return res.data;
    } catch {
      const cities = getStoredData(STORAGE_KEYS.CITIES, CITIES_DATA);
      if (!query.trim()) return cities;
      return cities.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.country.toLowerCase().includes(query.toLowerCase()) ||
          c.region?.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  async getCityActivities(cityId) {
    try {
      const res = await apiClient.get(`/cities/${cityId}/activities`);
      return res.data;
    } catch {
      const cities = getStoredData(STORAGE_KEYS.CITIES, CITIES_DATA);
      const city = cities.find((c) => c.id === cityId || c.name.toLowerCase() === cityId.toLowerCase());
      return city ? city.activities : [];
    }
  },

  // User info
  async getUser() {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch {
      return getStoredData(STORAGE_KEYS.USER, INITIAL_USER);
    }
  },
};
