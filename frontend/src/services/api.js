import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('globetrotter_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  async register(userData) {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  async getUser() {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },

  // Trips
  async getTrips() {
    const res = await apiClient.get('/trips');
    return res.data;
  },

  async getTripById(id) {
    const res = await apiClient.get(`/trips/${id}`);
    return res.data;
  },

  async getTripByShareToken(token) {
    const res = await apiClient.get(`/trips/shared/${token}`);
    return res.data;
  },

  async createTrip(tripData) {
    const res = await apiClient.post('/trips', tripData);
    return res.data;
  },

  async updateTrip(id, tripData) {
    const res = await apiClient.put(`/trips/${id}`, tripData);
    return res.data;
  },

  async deleteTrip(id) {
    await apiClient.delete(`/trips/${id}`);
    return true;
  },

  // Cities & Search
  async getCities(query = '') {
    const res = await apiClient.get('/cities', { params: { q: query } });
    return res.data;
  },

  async getCityActivities(cityId) {
    const res = await apiClient.get(`/cities/${cityId}/activities`);
    return res.data;
  },

  // Stops
  async addStop(tripId, stopData) {
    const res = await apiClient.post(`/trips/${tripId}/stops`, stopData);
    return res.data;
  },

  async deleteStop(stopId) {
    await apiClient.delete(`/stops/${stopId}`);
    return true;
  },

  // Trip Activities
  async addTripActivity(stopId, activityData) {
    const res = await apiClient.post(`/stops/${stopId}/activities`, activityData);
    return res.data;
  },

  async deleteTripActivity(activityId) {
    await apiClient.delete(`/trip-activities/${activityId}`);
    return true;
  }
};
