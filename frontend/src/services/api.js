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
    return res.data.data.user;
  },

  async updateUser(userData) {
    const res = await apiClient.put('/auth/me', userData);
    return res.data.data.user;
  },

  // Admin
  async getUsers() {
    const res = await apiClient.get('/admin/users');
    return res.data;
  },

  async getStats() {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  // Trips
  async getTrips() {
    const res = await apiClient.get('/trips');
    return res.data?.data?.trips || res.data || [];
  },

  async getPublicTrips() {
    const res = await apiClient.get('/trips/public');
    return res.data?.data?.trips || res.data || [];
  },

  async getTripById(id) {
    const res = await apiClient.get(`/trips/${id}`);
    return res.data?.data?.trip || res.data;
  },

  async getTripByShareToken(token) {
    const res = await apiClient.get(`/trips/shared/${token}`);
    return res.data;
  },

  async createTrip(tripData) {
    const res = await apiClient.post('/trips', tripData);
    return res.data?.data?.trip || res.data;
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
    return res.data?.data?.cities || res.data || [];
  },

  async getCityActivities(cityId) {
    const res = await apiClient.get(`/cities/${cityId}/activities`);
    return res.data?.data?.activities || res.data || [];
  },

  async searchActivities(params = {}) {
    const res = await apiClient.get('/activities', { params });
    return res.data?.data?.activities || res.data || [];
  },

  // Stops & Activities Management
  async addStop(tripId, stopData) {
    const res = await apiClient.post(`/trips/${tripId}/stops`, stopData);
    return res.data?.data?.stop || res.data;
  },

  async updateStop(stopId, stopData) {
    const res = await apiClient.patch(`/stops/${stopId}`, stopData);
    return res.data?.data?.stop || res.data;
  },

  async deleteStop(stopId) {
    const res = await apiClient.delete(`/stops/${stopId}`);
    return res.data;
  },

  async addActivityToStop(stopId, activityData) {
    const res = await apiClient.post(`/stops/${stopId}/activities`, activityData);
    return res.data?.data?.tripActivity || res.data;
  },

  async updateActivity(activityId, activityData) {
    const res = await apiClient.patch(`/trip-activities/${activityId}`, activityData);
    return res.data?.data?.tripActivity || res.data;
  },

  async deleteActivity(activityId) {
    const res = await apiClient.delete(`/trip-activities/${activityId}`);
    return res.data;
  },

  // Budget & Sharing
  async getTripBudget(tripId) {
    const res = await apiClient.get(`/trips/${tripId}/budget`);
    return res.data?.data || res.data;
  },

  async shareTrip(tripId) {
    const res = await apiClient.post(`/trips/${tripId}/share`);
    return res.data?.data || res.data;
  },

  async getPublicTrip(shareToken) {
    const res = await apiClient.get(`/public/trips/${shareToken}`);
    return res.data?.data?.trip || res.data;
  },

  async copyPublicTrip(shareToken) {
    const res = await apiClient.post(`/public/trips/${shareToken}/copy`);
    return res.data?.data?.trip || res.data;
  }
};

