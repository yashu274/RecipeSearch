import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Let axios automatically set Content-Type based on data
    // For FormData, it will be multipart/form-data
    // For objects, it will be application/json
    return config;
});

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
};

// Recipe API
export const recipeAPI = {
    getAll: (params) => api.get('/recipes', { params }),
    getById: (id) => api.get(`/recipes/${id}`),
    create: (data) => api.post('/recipes', data),
    update: (id, data) => api.put(`/recipes/${id}`, data),
    delete: (id) => api.delete(`/recipes/${id}`),
    toggleFavorite: (id) => api.post(`/recipes/${id}/favorite`),
    getFavorites: () => api.get('/recipes/user/favorites'),
};

// Meal Plan API
export const mealAPI = {
    getAll: (params) => api.get('/meals', { params }),
    create: (data) => api.post('/meals', data),
    delete: (id) => api.delete(`/meals/${id}`),
};

export default api;
