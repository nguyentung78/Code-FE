import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../components/shared/ProductDetail'; 
import GuestCartModal from '../components/shared/GuestCartModal'; // Sử dụng GuestCartModal
import { getProductById } from '../../services/productApi';
import { Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const GuestProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.guestCart.items); // Lấy giỏ hàng từ guestCart

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToGuestCart({ product, quantity: 1 })); // Sử dụng addToGuestCart
    toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
    setCartVisible(true);
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
    navigate('/login');
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
        cart={cart.map((item) => ({ ...item.product, quantity: item.quantity }))}
        updateQuantity={updateQuantityHandler}
        removeFromCart={removeFromCartHandler}
        onCheckout={handleCheckout} // Thêm handleCheckout
      />
      <ProductDetail product={product} onAddToCart={handleAddToCart} />
    </div>
  );
};

export default GuestProductDetail;