import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Avatar, Dropdown as AntDropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { logout } from '../../services/authService'; 

function GuestHeader() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } else {
      setUserInfo(null);
    }
  }, [navigate]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchKeyword.trim()) {
        navigate(`/product?search=${encodeURIComponent(searchKeyword.trim())}`);
      } else {
        navigate('/product');
      }
      setSearchKeyword('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout(); // Gọi API đăng xuất
      setUserInfo(null);
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất, vui lòng thử lại!');
      console.error(error);
    }
  };

  const accountMenu = {
    items: userInfo
      ? [
          { key: 'profile', label: <Link to="/account">Hồ sơ</Link> },
          {
            key: 'logout',
            label: 'Đăng xuất',
            onClick: handleLogout, // Sử dụng hàm handleLogout
          },
        ]
      : [
          { key: 'login', label: <Link to="/login">Đăng nhập</Link> },
          { key: 'register', label: <Link to="/register">Đăng ký</Link> },
        ],
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{
        borderBottom: '1px solid #e0e0e0',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        boxShadow: isScrolled ? '0 2px 5px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://bizweb.dktcdn.net/100/549/670/themes/996396/assets/logo.png?1743518315474"
            alt="EGA Logo"
            style={{ height: '40px' }}
          />
        </Navbar.Brand>
        <Form className="d-flex flex-grow-1 mx-3">
          <FormControl
            type="search"
            placeholder="Tìm theo tên sản phẩm..."
            className="me-2"
            aria-label="Search"
            style={{ borderRadius: '20px' }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearch}
          />
        </Form>
        <AntDropdown menu={accountMenu} trigger={['click']}>
          <Nav.Link>
            {userInfo ? (
              <>
                <Avatar
                  src={userInfo.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  size={32}
                  style={{ marginRight: '5px' }}
                />
                <span>{userInfo.username}</span>
              </>
            ) : (
              <>
                <UserOutlined style={{ fontSize: '20px', marginRight: '5px' }} />
                Tài khoản
              </>
            )}
          </Nav.Link>
        </AntDropdown>
      </Container>
    </Navbar>
  );
}

export default GuestHeader;