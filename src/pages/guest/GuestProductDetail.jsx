import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../../components/shared/ProductDetail';
import GuestCartModal from '../../components/shared/GuestCartModal';
import { getProductById } from '../../services/productApi';
import { Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToGuestCart, updateGuestQuantity, removeFromGuestCart, clearGuestCart } from '../../redux/guestCartSlice';

const GuestProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.guestCart.items);

  useEffect(() => {
    // Kiểm tra xem trang có phải vừa được tải lại không
    const lastLoadTime = localStorage.getItem('lastLoadTime');
    const currentTime = Date.now();

    if (!lastLoadTime || currentTime - parseInt(lastLoadTime) > 1000) {
      // Nếu không có lastLoadTime hoặc thời gian tải lại cách nhau > 1 giây, coi như trang vừa được tải lại
      dispatch(clearGuestCart());
      localStorage.setItem('lastLoadTime', currentTime.toString());
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        const message = err.response?.data?.message || 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    if (productId && !isNaN(productId)) {
      fetchProduct();
    } else {
      setError('ID sản phẩm không hợp lệ!');
      setLoading(false);
    }
  }, [productId, dispatch]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToGuestCart({ product, quantity: 1 }));
    toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
    setCartVisible(true);
  };

  const handleCheckout = () => {
    toast.info('Vui lòng đăng nhập để thanh toán!');
    setCartVisible(false);
    navigate('/login-user');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div>
      <GuestCartModal
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        onCheckout={handleCheckout}
      />
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default GuestProductDetail;