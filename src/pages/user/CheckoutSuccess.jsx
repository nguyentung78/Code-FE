// src/pages/user/CheckoutSuccess.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Alert, Button } from 'antd';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../api/index';
import Cookies from 'js-cookie';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const completePayment = async () => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
      const orderId = searchParams.get('orderId');
  
      if (!paymentId || !payerId || !orderId) {
        toast.error('Thông tin thanh toán không hợp lệ!');
        navigate('/user-home');
        return;
      }
  
      try {
        // Không cần thêm header Authorization vì interceptor đã xử lý,
        // nhưng endpoint permitAll nên không cần token
        const response = await BASE_URL.get(
          `/user/cart/checkout/success?paymentId=${paymentId}&PayerID=${payerId}&orderId=${orderId}`
        );
        setMessage(response.data || 'Thanh toán thành công!');
        toast.success('Thanh toán thành công!');
      } catch (error) {
        setMessage(error.response?.data || 'Lỗi khi hoàn tất thanh toán!');
        toast.error(error.response?.data || 'Lỗi khi hoàn tất thanh toán!');
      } finally {
        setLoading(false);
      }
    };
  
    completePayment();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang xử lý thanh toán..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
      <Alert message={message} type={message.includes('thành công') ? 'success' : 'error'} showIcon />
      <Button
        type="primary"
        onClick={() => navigate('/user-home')}
        style={{ marginTop: 20 }}
      >
        Quay lại trang chính
      </Button>
    </div>
  );
};

export default CheckoutSuccess;