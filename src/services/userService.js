import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie'; // Lấy token từ cookie

const token = Cookies.get('token');

const defaultHeaders = {
  Authorization: `Bearer ${token}`,
};

const userService = {
  // Lấy thông tin tài khoản người dùng
  getUserProfile: () =>
    BASE_URL.get('/user/account', {
      headers: defaultHeaders,
    }),

  // Cập nhật thông tin cá nhân (dùng multipart/form-data)
  updateUserProfile: (formData) => {
    return BASE_URL.request({
      url: '/user/account',
      method: 'put',
      data: formData,
      headers: {
        ...defaultHeaders,
        // KHÔNG set Content-Type để axios tự gán khi gửi FormData (để tránh lỗi boundary)
      },
    });
  },

  // Đổi mật khẩu
  changePassword: (data) =>
    BASE_URL.put('/user/account/change-password', data, {
      headers: defaultHeaders,
    }),

  // Thêm địa chỉ mới
  addAddress: (data) =>
    BASE_URL.post('/user/account/addresses', data, {
      headers: defaultHeaders,
    }),

  // Xóa địa chỉ
  deleteAddress: (addressId) =>
    BASE_URL.delete(`/user/account/addresses/${addressId}`, {
      headers: defaultHeaders,
    }),

  // Lấy danh sách địa chỉ
  getUserAddresses: () =>
    BASE_URL.get('/user/account/addresses', {
      headers: defaultHeaders,
    }),

  // Lấy chi tiết địa chỉ
  getAddressById: (addressId) =>
    BASE_URL.get(`/user/account/addresses/${addressId}`, {
      headers: defaultHeaders,
    }),
};

export default userService;
