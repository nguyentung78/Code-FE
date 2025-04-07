import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Image, Typography, Button, Spin, Alert } from 'antd';
import { getProductById } from '../../services/productApi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { addToUserCart, fetchUserCart } from '../../redux/userCartSlice';
import UserCartModal from '../../components/user/UserCartModal';
import Cookies from 'js-cookie';

const { Title, Paragraph } = Typography;

function ProductDetailUser() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.userCart.items || []);

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để xem chi tiết sản phẩm!');
      navigate('/login-user');
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
    dispatch(addToUserCart({ productId: product.id, quantity: 1 }));
    setCartVisible(true);
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
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Card className="product-detail-card">
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Image
              width={400}
              height={400}
              src={product.image || 'https://via.placeholder.com/400'}
              alt={product.productName}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Title level={2} style={{ color: '#1890ff' }}>
                {product.productName}
              </Title>
              <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                {product.description || 'Không có mô tả cho sản phẩm này.'}
              </Paragraph>
              <Paragraph strong style={{ fontSize: '24px', color: '#d32f2f' }}>
                {product.unitPrice.toLocaleString('vi-VN')} đ
              </Paragraph>
              <Paragraph style={{ fontSize: '16px' }}>
                Số lượng tồn kho: <strong>{product.stockQuantity}</strong> sản phẩm
              </Paragraph>
              <Button
                type="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                style={{ marginTop: '16px' }}
              >
                {product.stockQuantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ProductDetailUser;