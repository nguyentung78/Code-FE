// src/pages/user/CheckoutCancel.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spin, Alert, Button } from 'antd';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../api/index';
import Cookies from 'js-cookie';

const CheckoutCancel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const cancelPayment = async () => {
      const orderId = searchParams.get('orderId');

      if (!orderId) {
        toast.error('Thông tin đơn hàng không hợp lệ!');
        navigate('/user-home');
        return;
      }

      try {
        const response = await BASE_URL.get(
          `/user/cart/checkout/cancel?orderId=${orderId}`,
          {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          }
        );
        setMessage(response.data || 'Thanh toán đã bị hủy!');
        toast.info('Thanh toán đã bị hủy!');
      } catch (error) {
        setMessage(error.response?.data || 'Lỗi khi hủy thanh toán!');
        toast.error(error.response?.data || 'Lỗi khi hủy thanh toán!');
      } finally {
        setLoading(false);
      }
    };

    cancelPayment();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang xử lý..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center' }}>
      <Alert message={message} type={message.includes('hủy') ? 'warning' : 'error'} showIcon />
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

export default CheckoutCancel;