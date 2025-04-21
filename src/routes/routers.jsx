import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserGuestLayout from '../layouts/user/UserGuestLayout';
import AdminLayout from '../layouts/admin/AdminLayout';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';
import { userRoutes } from './userRoutes';
import LoginUser from '../pages/user/LoginUser';
import Register from '../pages/guest/Register';
import LoginAdmin from '../pages/admin/LoginAdmin';
import GuestHeader from '../components/shared/GuestHeader';
import UserHeader from '../components/user/UserHeader';
import Checkout from '../components/user/Checkout'; 
import Cookies from 'js-cookie';

// Component bảo vệ route cho User (yêu cầu đăng nhập)
const ProtectedUserRoute = ({ element }) => {
  const token = Cookies.get('token');
  return token ? element : <Navigate to="/login" />;
};

const Routers = () => {
  return (
    <Routes>
      {/* Routes cho Guest (luôn dùng GuestHeader) */}
      <Route element={<UserGuestLayout header={<GuestHeader />} />}>
        {publicRoutes
          .filter((route) => route.path !== '/register' && route.path !== '/admin-login')
          .map((route) => (
            <Route key={route.path} path={route.path} element={<route.element />} />
          ))}
      </Route>

      {/* Routes cho User (luôn dùng UserHeader, yêu cầu đăng nhập) */}
      <Route element={<UserGuestLayout header={<UserHeader />} />}>
        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedUserRoute element={<route.element />} />}
          />
        ))}
        {/* Thêm route cho Checkout */}
        <Route
          path="/checkout"
          element={<ProtectedUserRoute element={<Checkout />} />}
        />
      </Route>

      {/* Route riêng cho trang đăng nhập User (không có Header và Footer) */}
      <Route path="/login" element={<LoginUser />} />

      {/* Route riêng cho trang đăng ký (không có Header và Footer) */}
      <Route path="/register" element={<Register />} />

      {/* Route riêng cho trang đăng nhập admin (không có Header và Footer) */}
      <Route path="/admin-login" element={<LoginAdmin />} />

      {/* Routes cho Admin (sử dụng AdminLayout, không cần bảo vệ) */}
      <Route path="/admin" element={<AdminLayout />}>
        {privateRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path.replace('/admin/', '')}
            element={<route.element />}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Routers;