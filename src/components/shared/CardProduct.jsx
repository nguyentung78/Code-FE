import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishList, removeFromWishList, fetchWishList } from '../../redux/wishListSlice';
import Cookies from 'js-cookie';

function CardProduct({ product, onAddToCart }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user');
  const { wishList } = useSelector((state) => state.wishList);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isUser && Cookies.get('token')) {
      dispatch(fetchWishList({ page: 0, size: 10 })); // Gọi với phân trang
    }
  }, [dispatch, isUser]);

  useEffect(() => {
    setIsFavorite(wishList.some((item) => item.productId === product.id));
  }, [wishList, product.id]);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

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

  const detailLink = isUser
    ? `/user/product-detail/${product.id}`
    : `/product-detail/${product.id}`;

  return (
    <Card style={{ width: '100%', maxWidth: '300px', border: '1px solid #e0e0e0', borderRadius: '8px', position: 'relative' }}>
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

      <Card.Img
        variant="top"
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.productName}
        style={{ height: '200px', objectFit: 'cover', padding: '10px' }}
      />

      <Card.Body>
        <Card.Title style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          {product.productName}
        </Card.Title>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} style={{ color: '#fadb14', fontSize: '14px', marginRight: '2px' }} />
          ))}
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

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4d', marginRight: '10px' }}>
            {product.unitPrice?.toLocaleString('vi-VN')}đ
          </span>
          {/* <span style={{ fontSize: '14px', color: '#888', textDecoration: 'line-through' }}>
            {product.originalPrice?.toLocaleString('vi-VN')}đ
          </span> */}
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