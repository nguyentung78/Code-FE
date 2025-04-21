import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Avatar, Dropdown as AntDropdown } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { Badge } from 'antd';
import UserCartModal from './UserCartModal';
import { fetchUserCart } from '../../redux/userCartSlice';
import { logout } from '../../services/authService';
import userService from '../../services/userService';

function UserHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const cartItems = useSelector((state) => state.userCart.items || []);

  const fetchUserInfo = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await userService.getUserProfile();
        const userData = response.data;
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Vui lòng đăng nhập!');
          navigate('/login');
        } else {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          setUserInfo(null);
          localStorage.removeItem('userInfo');
        }
      }
    } else {
      setUserInfo(null);
      localStorage.removeItem('userInfo');
      navigate('/login'); // Chuyển hướng nếu không có token
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUserInfo();
      dispatch(fetchUserCart()); // Chỉ gọi fetchUserCart nếu có token
    } else {
      navigate('/login'); // Chuyển hướng nếu không có token
    }

    const handleStorageChange = () => {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        setUserInfo(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, navigate]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      await logout();
      setUserInfo(null);
      localStorage.removeItem('userInfo');
      toast.success('Đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất, vui lòng thử lại!');
      console.error(error);
    }
  };

  const accountMenu = {
    items: [
      { key: 'profile', label: <Link to="/account">Hồ sơ</Link> },
      { key: 'logout', label: 'Đăng xuất', onClick: handleLogout },
    ],
  };

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <>
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
          <Navbar.Brand as={Link} to="/user-home">
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
              style={{ borderRadius: '20px' }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
          </Form>
          {userInfo ? (
            <AntDropdown menu={accountMenu} trigger={['click']}>
              <Nav.Link>
                <Avatar
                  src={userInfo?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  size={32}
                  style={{ marginRight: '5px' }}
                />
                <span>{userInfo?.username}</span>
              </Nav.Link>
            </AntDropdown>
          ) : (
            <Nav.Link as={Link} to="/login">
              Đăng nhập
            </Nav.Link>
          )}
          <Nav.Link onClick={() => setCartVisible(true)} style={{ cursor: 'pointer' }}>
            <Badge count={cartItemCount}>
              <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            </Badge>
          </Nav.Link>
        </Container>
      </Navbar>
      <UserCartModal visible={cartVisible} onClose={() => setCartVisible(false)} />
    </>
  );
}

export default UserHeader;