import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = axios.create({ baseURL: 'http://localhost:8080/api/v1' });
export const BASE_URL_ADMIN = axios.create({ baseURL: 'http://localhost:8080/api/v1/admin' });
export const BASE_URL_AUTH = axios.create({ baseURL: 'http://localhost:8080/api/v1/auth' });

// Interceptor cho BASE_URL
BASE_URL.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    // Danh sách endpoint public không cần token
    const publicEndpoints = [
      '/public/products',
      '/public/categories',
      '/public/products/featured-products',
      '/public/products/categories',
      '/public/products/\\d+/reviews', // Regex cho /public/products/:id/reviews
      '/public/products/\\d+/average-rating', // Regex cho /public/products/:id/average-rating
    ];

    // Kiểm tra nếu URL khớp với endpoint public
    const isPublic = publicEndpoints.some((endpoint) =>
      new RegExp(endpoint).test(config.url)
    );

    // Chỉ thêm token nếu không phải endpoint public và token tồn tại
    if (token && !isPublic && !config.url.includes('/user/cart/checkout/success') && !config.url.includes('/user/cart/checkout/cancel')) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Xóa header Authorization
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
    } else {
      delete config.headers.Authorization; // Xóa header Authorization nếu token không tồn tại
    }
    return config;
  },
  (error) => Promise.reject(error)
);