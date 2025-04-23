import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie';

const reviewService = {
  // Lấy danh sách sản phẩm với số sao trung bình (admin)
  getProductsWithAverageRating: async (page = 0, size = 10, sortBy = 'id', order = 'asc', keyword = '') => {
    const response = await BASE_URL.get('/admin/reviews/products', {
      params: { page, size, sortBy, order, keyword },
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  },

  // Lấy danh sách đánh giá của sản phẩm (public)
  getReviewsByProduct: async (productId, page = 0, size = 5) => {
    const response = await BASE_URL.get(`/public/products/${productId}/reviews`, {
      params: { page, size },
    });
    return response.data;
  },

  // Lấy số sao trung bình của sản phẩm (public)
  getAverageRating: async (productId) => {
    const response = await BASE_URL.get(`/public/products/${productId}/average-rating`);
    return response.data;
  },

  // Admin trả lời đánh giá
  replyToReview: async (reviewId, reply) => {
    const response = await BASE_URL.post(
      `/admin/reviews/${reviewId}/reply`,
      { reply },
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      }
    );
    return response.data;
  },

  // Người dùng gửi đánh giá
  submitReview: async (productId, reviewData) => {
    const response = await BASE_URL.post(
      `/user/products/${productId}/reviews`,
      reviewData,
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      }
    );
    return response.data;
  },
};

export default reviewService;