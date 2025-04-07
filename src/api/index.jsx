import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = axios.create({ baseURL: 'http://localhost:8080/api/v1' });
export const BASE_URL_ADMIN = axios.create({ baseURL: 'http://localhost:8080/api/v1/admin' });
export const BASE_URL_AUTH = axios.create({ baseURL: 'http://localhost:8080/api/v1/auth' });

// Interceptor cho BASE_URL
BASE_URL.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    // Chỉ thêm token nếu không phải là các endpoint permitAll
    if (token && !config.url.includes('/user/cart/checkout/success') && !config.url.includes('/user/cart/checkout/cancel')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho BASE_URL_ADMIN
BASE_URL_ADMIN.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);