import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CardProduct from '../../components/shared/CardProduct';
import UserCartModal from '../../components/user/UserCartModal';
import { toast } from 'react-toastify';
import { Spin, Pagination } from 'antd';
import { BASE_URL } from '../../api/index';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, LaptopOutlined, PhoneOutlined, GiftOutlined, ToolOutlined, SkinOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addToUserCart, fetchUserCart } from '../../redux/userCartSlice';
import { getPublicProductsThunk, getFeaturedProductsThunk } from '../../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function UserHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: products, featured: featuredProducts, total, loading, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.userCart.items || []);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const [cartVisible, setCartVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để truy cập trang này!');
      navigate('/login');
      return;
    }

    dispatch(fetchUserCart());
  }, [navigate, dispatch]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await BASE_URL.get('/public/categories');
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Không thể tải danh sách danh mục!');
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    dispatch(getPublicProductsThunk({ page: currentPage, size: productsPerPage, categoryId: selectedCategory }));
    dispatch(getFeaturedProductsThunk());
  }, [dispatch, selectedCategory, currentPage]);

  const addToCartHandler = (product) => {
    if (product.stockQuantity === 0) {
      toast.warning('Sản phẩm đã hết hàng!');
      return;
    }
    const existingItem = cartItems.find((item) => item.product?.id === product.id);
    if (existingItem && existingItem.quantity >= product.stockQuantity) {
      toast.warning(`Số lượng trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`);
      return;
    }
    dispatch(addToUserCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
      })
      .catch(() => {
        toast.error('Lỗi khi thêm vào giỏ hàng!');
      });
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      { breakpoint: 768, settings: { arrows: false, dots: true, autoplaySpeed: 2000 } },
      { breakpoint: 1024, settings: { arrows: true, dots: true } },
    ],
  };

  const banners = [
    'https://bizweb.dktcdn.net/100/549/670/themes/996396/assets/home_slider_1.jpg?1743518315474',
    'https://bizweb.dktcdn.net/100/549/670/themes/996396/assets/home_slider_1.jpg?1743518315474',
  ];

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === 'all' ? null : categoryId);
    setCurrentPage(1);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName.toLowerCase();
    if (lowerName.includes('laptop')) return <LaptopOutlined />;
    if (lowerName.includes('điện thoại') || lowerName.includes('phone')) return <PhoneOutlined />;
    if (lowerName.includes('quà') || lowerName.includes('gift')) return <GiftOutlined />;
    if (lowerName.includes('phụ kiện') || lowerName.includes('accessories')) return <ToolOutlined />;
    if (lowerName.includes('thời trang') || lowerName.includes('fashion')) return <SkinOutlined />;
    if (lowerName.includes('gia dụng') || lowerName.includes('household')) return <HomeOutlined />;
    return <ShopOutlined />;
  };

  const menuItems = [
    { key: 'all', label: 'Tất cả danh mục', icon: <ShopOutlined /> },
    ...categories.map((category) => ({
      key: category.categoryId.toString(),
      label: category.categoryName,
      icon: getCategoryIcon(category.categoryName),
    })),
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container fluid>
      <style>
        {`
          .slick-prev, .slick-next {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            z-index: 1;
            display: flex !important;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
          }
          .slick-prev { left: 10px; }
          .slick-next { right: 10px; }
          .slick-prev:before, .slick-next:before {
            font-size: 20px;
            color: #fff;
          }
          .slick-slider { position: relative; }
          .slick-arrow { display: block !important; }
          .main-layout { display: flex; min-height: 100vh; }
          .sidebar {
            width: ${collapsed ? '80px' : '256px'};
            transition: width 0.3s;
            background-color: #ffffff;
            border-right: 2px solid #001529;
          }
          .content {
            flex: 1;
            padding: 20px;
            display: flex;
            justify-content: center;
          }
          .content-inner { max-width: 1200px; width: 100%; }
          .category-header {
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
          }
          .ant-menu {
            background-color: #ffffff;
            color: #001529;
          }
          .ant-menu-item:hover {
            background-color: #f0f2f5 !important;
            color: #1890ff !important;
          }
          .ant-menu-item-selected {
            background-color: #e6f7ff !important;
            color: #1890ff !important;
          }
          .featured-products { margin-top: 40px; }
          .featured-products h1 { color: #d32f2f; }
          .pagination-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }
        `}
      </style>

      <UserCartModal visible={cartVisible} onClose={() => setCartVisible(false)} />

      <div style={{ marginBottom: '20px' }}>
        <Slider {...sliderSettings}>
          {banners.map((banner, index) => (
            <div key={index}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="main-layout">
        <div className="sidebar">
          <div style={{ padding: '10px', textAlign: 'center' }}>
            <span onClick={toggleCollapsed} style={{ cursor: 'pointer' }}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
          </div>
          <Menu
            defaultSelectedKeys={['all']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={menuItems}
            onClick={({ key }) => handleCategoryClick(key)}
          />
        </div>

        <div className="content">
          <div className="content-inner">
            <div className="category-header">
              <h1 className="my-4">Danh sách sản phẩm</h1>
            </div>
            {loading ? (
              <div className="text-center">
                <Spin size="large" />
              </div>
            ) : error ? (
              <div className="text-center">Lỗi: {error}</div>
            ) : products && products.length > 0 ? (
              <>
                <Row>
                  {products.map((item) => (
                    <Col lg={4} key={item.id} className="mb-4">
                      <CardProduct product={item} onAddToCart={addToCartHandler} />
                    </Col>
                  ))}
                </Row>
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={total}
                    pageSize={productsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </>
            ) : (
              <div className="text-center">Không có sản phẩm nào để hiển thị.</div>
            )}
          </div>
        </div>
      </div>
      <div className="featured-products">
        <div className="category-header">
          <h1 className="my-4">Sản phẩm nổi bật</h1>
        </div>
        {loading ? (
          <div className="text-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="text-center">Lỗi: {error}</div>
        ) : featuredProducts && featuredProducts.length > 0 ? (
          <Row>
            {featuredProducts.map((item) => (
              <Col lg={4} key={item.id} className="mb-4">
                <CardProduct product={item} onAddToCart={addToCartHandler} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center">Không có sản phẩm nổi bật nào để hiển thị.</div>
        )}
      </div>
    </Container>
  );
}

export default UserHome;