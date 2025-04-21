import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetail from '../../components/shared/ProductDetail';
import { getProductById } from '../../services/productApi';
import { Spin, Alert } from 'antd';
import { toast } from 'react-toastify';

const GuestProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [productId]);

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
      <ProductDetail product={product} />
    </div>
  );
};

export default GuestProductDetail;