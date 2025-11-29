// src/utils/api.js - API клиент

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Создаём instance axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: process.env.REACT_APP_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк - удаляем его
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const api = {
  // Auth
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  refresh: (data) => apiClient.post('/auth/refresh', data),
  logout: () => apiClient.post('/auth/logout'),

  // Posts
  getPosts: (params) => apiClient.get('/posts', { params }),
  getPost: (id) => apiClient.get(`/posts/${id}`),
  createPost: (data) => apiClient.post('/posts', data),
  updatePost: (id, data) => apiClient.put(`/posts/${id}`, data),
  deletePost: (id) => apiClient.delete(`/posts/${id}`),

  // Votes
  upvote: (postId) => apiClient.post(`/posts/${postId}/upvote`),
  downvote: (postId) => apiClient.post(`/posts/${postId}/downvote`),
  removeVote: (postId) => apiClient.delete(`/posts/${postId}/vote`),

  // Comments
  createComment: (data) => apiClient.post('/comments', data),
  updateComment: (id, data) => apiClient.put(`/comments/${id}`, data),
  deleteComment: (id) => apiClient.delete(`/comments/${id}`),

  // Users
  getUserProfile: (username) => apiClient.get(`/users/${username}`),
  getUserPosts: (username, params) => apiClient.get(`/users/${username}/posts`, { params }),
  updateProfile: (id, data) => apiClient.put(`/users/${id}`, data),
  followUser: (id) => apiClient.post(`/users/${id}/follow`),
  unfollowUser: (id) => apiClient.delete(`/users/${id}/follow`),

  // Upload
  uploadImage: (formData) => apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  processImage: (data) => apiClient.post('/upload/process', data),

  // Tags
  getTags: (params) => apiClient.get('/tags', { params }),
  getTagPosts: (name, params) => apiClient.get(`/tags/${name}`, { params }),

  // Albums
  getAlbums: () => apiClient.get('/albums'),
  createAlbum: (data) => apiClient.post('/albums', data),
  addPostToAlbum: (albumId, data) => apiClient.post(`/albums/${albumId}/posts`, data),
  removePostFromAlbum: (albumId, postId) => apiClient.delete(`/albums/${albumId}/posts/${postId}`),

  // Search
  search: (params) => apiClient.get('/search', { params })
};

export default apiClient;
