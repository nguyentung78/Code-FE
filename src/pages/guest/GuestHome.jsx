import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CardProduct from '../../components/shared/CardProduct';
import GuestCartModal from '../../components/shared/GuestCartModal'; // Sử dụng GuestCartModal
import { toast } from 'react-toastify';
import { Spin, Pagination } from 'antd';
import { BASE_URL } from '../../api/index';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MenuFoldOutlined, MenuUnfoldOutlined, ShopOutlined, LaptopOutlined, PhoneOutlined, GiftOutlined, ToolOutlined, SkinOutlined, HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addToGuestCart, updateGuestQuantity, removeFromGuestCart } from '../../redux/guestCartSlice'; // Sử dụng guestCartSlice

function GuestHome() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [cartVisible, setCartVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.guestCart.items); // Sử dụng guestCart

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
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/public/products?page=0&size=1000';
        if (selectedCategory) {
          url = `/public/products/categories/${selectedCategory}`;
        }
        const response = await BASE_URL.get(url);
        setProducts(
          selectedCategory
            ? Array.isArray(response.data)
              ? response.data
              : []
            : Array.isArray(response.data.content)
            ? response.data.content
            : []
        );
      } catch (error) {
        toast.error('Không thể tải danh sách sản phẩm!');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const response = await BASE_URL.get('/public/products/featured-products');
        setFeaturedProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Không thể tải danh sách sản phẩm nổi bật!');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchFeaturedProducts();
  }, [selectedCategory]);

  const addToCartHandler = (product) => {
    dispatch(addToGuestCart({ product, quantity: 1 })); // Sử dụng addToGuestCart
    toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  const updateQuantityHandler = (productId, quantity) => {
    dispatch(updateGuestQuantity({ productId, quantity })); // Sử dụng updateGuestQuantity
  };

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromGuestCart(productId)); // Sử dụng removeFromGuestCart
  };

  const handleCheckout = () => {
    toast.info('Vui lòng đăng nhập để thanh toán!');
    setCartVisible(false);
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
    setSelectedCategory(categoryId);
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

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

      <GuestCartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cart={cart.map((item) => ({ ...item.product, quantity: item.quantity }))}
        updateQuantity={updateQuantityHandler}
        removeFromCart={removeFromCartHandler}
        onCheckout={handleCheckout} // Thêm handleCheckout
      />

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
          <Menu
            defaultSelectedKeys={['all']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={menuItems}
            onClick={({ key }) => handleCategoryClick(key === 'all' ? null : key)}
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
            ) : products.length > 0 ? (
              <>
                <Row>
                  {currentProducts.map((item) => (
                    <Col lg={4} key={item.id} className="mb-4">
                      <CardProduct product={item} onAddToCart={addToCartHandler} />
                    </Col>
                  ))}
                </Row>
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={products.length}
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
        ) : featuredProducts.length > 0 ? (
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

export default GuestHome;