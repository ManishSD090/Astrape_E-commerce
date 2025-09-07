import axios from 'axios';

// Get the backend API URL from environment variables, with a fallback for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: This function automatically adds the authentication token to the header of every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Adds "Bearer {token}" to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


//================================================================================
// AUTHENTICATION ENDPOINTS
//================================================================================
export const login = (credentials) => api.post('/users/login', credentials);
export const signup = (userData) => api.post('/users/register', userData);


//================================================================================
// PRODUCT ENDPOINTS
//================================================================================
// Fetches products, optionally with filters (e.g., { category: 'Electronics' })
export const getProducts = (filters) => api.get('/items', { params: filters });


//================================================================================
// CART ENDPOINTS
//================================================================================
// Fetches the current user's cart
export const getCart = () => api.get('/cart');

// Adds an item to the cart
export const addToCart = (itemData) => api.post('/cart/add', itemData);

// Updates the quantity of an item in the cart
export const updateCartQuantity = (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity });

// Removes an item from the cart
export const removeFromCart = (productId) => api.delete(`/cart/remove/${productId}`);


export default api;

