import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../../components/shared/ProductDetail';
import { getProductById } from '../../services/productApi';
import { Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToUserCart, fetchUserCart } from '../../redux/userCartSlice';
import UserCartModal from '../../components/user/UserCartModal';
import Cookies from 'js-cookie';
import axios from 'axios';

const BASE_URL = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

function ProductDetailUser() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.userCart.items || []);
  const userId = Cookies.get('userId') || localStorage.getItem('userId'); // Giả định userId được lưu sau khi đăng nhập

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để xem chi tiết sản phẩm!');
      navigate('/login');
      return;
    }

    dispatch(fetchUserCart()); // Lấy giỏ hàng từ API
  }, [navigate, dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin sản phẩm!');
        toast.error('Lỗi khi tải sản phẩm!');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    const existingItem = cartItems.find((item) => item.product?.id === product.id);
    if (existingItem && existingItem.quantity >= product.stockQuantity) {
      toast.warning(`Số lượng trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`);
      return;
    }
    dispatch(addToUserCart({ productId: product.id, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
        setCartVisible(true);
      })
      .catch(() => toast.error('Lỗi khi thêm vào giỏ hàng!'));
  };

  const handleSubmitReview = async (values) => {
    try {
      await BASE_URL.post('/reviews', {
        productId: values.productId,
        rating: values.rating,
        comment: values.comment,
      }, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
    } catch (error) {
      throw error; // Để ProductDetail xử lý lỗi và hiển thị thông báo
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto' }}>
        <Alert message={error || 'Sản phẩm không tồn tại!'} type="error" showIcon />
      </div>
    );
  }

  return (
    <>
      <UserCartModal visible={cartVisible} onClose={() => setCartVisible(false)} />
      <ProductDetail
        product={product}
        onAddToCart={handleAddToCart}
        userId={userId}
        onSubmitReview={handleSubmitReview}
      />
    </>
  );
}

export default ProductDetailUser;