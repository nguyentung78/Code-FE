import axios from 'axios';
import { BASE_URL } from '../api/index';

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (productId) => {
  try {
    const response = await BASE_URL.get(`/public/products/${productId}`);
    return response.data; // Giả định backend trả về dữ liệu trực tiếp
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    throw error;
  }
};