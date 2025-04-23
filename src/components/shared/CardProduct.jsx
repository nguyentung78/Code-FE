import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList, fetchWishList } from '../../redux/wishListSlice';
import Cookies from 'js-cookie';
import reviewService from '../../services/reviewService';

function CardProduct({ product, onAddToCart }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user');
  const { wishList } = useSelector((state) => state.wishList);
  const [isFavorite, setIsFavorite] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  // Lấy danh sách yêu thích nếu là người dùng đã đăng nhập
  useEffect(() => {
    if (isUser && Cookies.get('token')) {
      dispatch(fetchWishList({ page: 0, size: 10 }));
    }
  }, [dispatch, isUser]);

  // Cập nhật trạng thái yêu thích dựa trên danh sách yêu thích
  useEffect(() => {
    setIsFavorite(wishList.some((item) => item.productId === product.id));
  }, [wishList, product.id]);

  // Lấy số sao trung bình từ API
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const rating = await reviewService.getAverageRating(product.id);
        setAverageRating(rating || 0);
      } catch (error) {
        console.error('Lỗi khi lấy số sao trung bình:', error);
      }
    };
    fetchAverageRating();
  }, [product.id]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    onAddToCart(product);
  };

  // Xử lý thêm/xóa khỏi danh sách yêu thích
  const handleToggleWishList = () => {
    if (!isUser || !Cookies.get('token')) {
      toast.info('Vui lòng đăng nhập để thêm vào danh sách yêu thích!');
      return;
    }

    if (isFavorite) {
      dispatch(removeFromWishList(product.id))
        .then(() => toast.success(`${product.productName} đã được xóa khỏi danh sách yêu thích!`))
        .catch(() => toast.error('Lỗi khi xóa khỏi danh sách yêu thích!'));
    } else {
      dispatch(addToWishList(product.id))
        .then(() => toast.success(`${product.productName} đã được thêm vào danh sách yêu thích!`))
        .catch(() => toast.error('Lỗi khi thêm vào danh sách yêu thích!'));
    }
  };

  // Link đến trang chi tiết sản phẩm
  const detailLink = isUser
    ? `/user/product-detail/${product.id}`
    : `/product-detail/${product.id}`;

  // Hàm tạo ngôi sao đánh giá và hiển thị số sao trung bình
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} style={{ color: '#fadb14', fontSize: '14px', marginRight: '2px' }} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} style={{ color: '#fadb14', fontSize: '14px', marginRight: '2px', opacity: 0.5 }} />);
      } else {
        stars.push(<FaStar key={i} style={{ color: '#e0e0e0', fontSize: '14px', marginRight: '2px' }} />);
      }
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {stars}
        <span style={{ marginLeft: '5px', fontSize: '14px', color: '#333' }}>
          {averageRating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <Card style={{ width: '100%', maxWidth: '300px', border: '1px solid #e0e0e0', borderRadius: '8px', position: 'relative' }}>
      {/* Nhãn thương hiệu */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {product.brand || 'EGA'}
      </div>

      {/* Hình ảnh sản phẩm */}
      <Card.Img
        variant="top"
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.productName}
        style={{ height: '200px', objectFit: 'cover', padding: '10px' }}
      />

      <Card.Body>
        {/* Tên sản phẩm */}
        <Card.Title style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          {product.productName}
        </Card.Title>

        {/* Đánh giá và nút yêu thích */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          {renderStars()}
          {isUser && (
            <span
              style={{ cursor: 'pointer', marginLeft: '5px' }}
              onClick={handleToggleWishList}
            >
              {isFavorite ? (
                <FaHeart style={{ color: '#ff4d4d', fontSize: '14px' }} />
              ) : (
                <FaRegHeart style={{ color: '#888', fontSize: '14px' }} />
              )}
            </span>
          )}
  </div>

        {/* Giá sản phẩm và giảm giá */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4d', marginRight: '10px' }}>
            {product.unitPrice?.toLocaleString('vi-VN')}đ
          </span>
          {product.originalPrice && (
            <span
              style={{
                marginLeft: '10px',
                backgroundColor: '#ff4d4d',
                color: 'white',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              -{Math.round(((product.originalPrice - product.unitPrice) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Nút hành động */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink
            className="btn btn-primary"
            to={detailLink}
            style={{ flex: 1, textAlign: 'center' }}
          >
            Xem chi tiết
          </NavLink>
          <Button
            variant="outline-primary"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaShoppingCart style={{ marginRight: '5px' }} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardProduct;