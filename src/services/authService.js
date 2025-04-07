import { BASE_URL_AUTH } from '../api/index';
import Cookies from 'js-cookie';
import store from '../redux/store';
import { clearGuestCart } from '../redux/guestCartSlice';
import { fetchUserCart, clearUserCart } from '../redux/userCartSlice';

export const login = async (values) => {
  try {
    const response = await BASE_URL_AUTH.post('/login', values);
    const { accessToken, roles } = response.data;
    const normalizedRoles = roles.map((role) => (typeof role === 'string' ? role : role.roleName));
    Cookies.set('token', accessToken, { expires: 7 });
    Cookies.set('roles', JSON.stringify(normalizedRoles), { expires: 7 });
    localStorage.setItem('token', accessToken);

    store.dispatch(clearGuestCart()); // Xóa giỏ hàng guest
    await store.dispatch(fetchUserCart()).unwrap(); // Lấy giỏ hàng user từ API

    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('roles');
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');

  store.dispatch(clearGuestCart()); // Xóa giỏ hàng guest
};