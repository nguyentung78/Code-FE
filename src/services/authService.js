import { BASE_URL_AUTH } from '../api/index';
import Cookies from 'js-cookie';
import store from '../redux/store';

export const login = async (values) => {
  try {
    const response = await BASE_URL_AUTH.post('/login', values);
    const { accessToken, roles } = response.data;
    const normalizedRoles = roles.map((role) => (typeof role === 'string' ? role : role.roleName));
    Cookies.set('token', accessToken, { expires: 7 });
    Cookies.set('roles', JSON.stringify(normalizedRoles), { expires: 7 });
    localStorage.setItem('token', accessToken);

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  const token = Cookies.get('token'); // Lấy token trước khi xóa
  try {
    if (token) {
      await BASE_URL_AUTH.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error('Lỗi khi gọi API đăng xuất:', error);
    throw error; // Ném lỗi để xử lý ở các component gọi hàm này
  } finally {
    // Xóa dữ liệu phía client bất kể API thành công hay thất bại
    Cookies.remove('token');
    Cookies.remove('roles');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  }
};