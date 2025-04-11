import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie';

const userService = {
  // Hàm tiện ích để lấy header động
  getHeaders: () => {
    const token = Cookies.get('token');
    if (!token) {
      throw new Error('Token không tồn tại. Vui lòng đăng nhập lại!');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  },

  // Lấy thông tin tài khoản người dùng
  getUserProfile: () =>
    BASE_URL.get('/user/account', {
      headers: userService.getHeaders(),
    }),

  // Cập nhật thông tin cá nhân (dùng multipart/form-data)
  updateUserProfile: (formData) => {
    return BASE_URL.request({
      url: '/user/account',
      method: 'put',
      data: formData,
      headers: {
        ...userService.getHeaders(),
        // Không set Content-Type để axios tự xử lý cho FormData
      },
    });
  },

  // Đổi mật khẩu
  changePassword: (data) =>
    BASE_URL.put('/user/account/change-password', data, {
      headers: userService.getHeaders(),
    }),

  // Thêm địa chỉ mới
  addAddress: (data) =>
    BASE_URL.post('/user/account/addresses', data, {
      headers: userService.getHeaders(),
    }),

  // Xóa địa chỉ
  deleteAddress: (addressId) =>
    BASE_URL.delete(`/user/account/addresses/${addressId}`, {
      headers: userService.getHeaders(),
    }),

  // Lấy danh sách địa chỉ
  getUserAddresses: () =>
    BASE_URL.get('/user/account/addresses', {
      headers: userService.getHeaders(),
    }),

  // Lấy chi tiết địa chỉ
  getAddressById: (addressId) =>
    BASE_URL.get(`/user/account/addresses/${addressId}`, {
      headers: userService.getHeaders(),
    }),
};

export default userService;