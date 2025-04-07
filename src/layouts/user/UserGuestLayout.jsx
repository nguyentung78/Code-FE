import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/shared/Footer'; // Đường dẫn đến file Footer.jsx

const UserGuestLayout = ({ header }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header động (GuestHeader hoặc UserHeader) */}
      {header}

      {/* Nội dung chính của trang */}
      <main style={{ flex: 1, paddingTop: '70px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserGuestLayout;