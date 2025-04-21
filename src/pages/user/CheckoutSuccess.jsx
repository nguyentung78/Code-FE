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
  const [isProcessed, setIsProcessed] = useState(false); // Biến kiểm soát trạng thái xử lý

  useEffect(() => {
    const completePayment = async () => {
      const paymentId = searchParams.get('paymentId');
      const payerId = searchParams.get('PayerID');
      const orderId = searchParams.get('orderId');

      if (!paymentId || !payerId || !orderId) {
        toast.error('Thông tin thanh toán không hợp lệ!');
        setLoading(false);
        navigate('/user-home');
        return;
      }

      if (isProcessed) return; // Ngăn gọi lại API nếu đã xử lý

      setIsProcessed(true); // Đánh dấu đã xử lý
      try {
        const response = await BASE_URL.get(
          `/user/cart/checkout/success?paymentId=${paymentId}&PayerID=${payerId}&orderId=${orderId}`
        );
        setMessage(response.data || 'Thanh toán thành công!');
        toast.success('Thanh toán thành công!');
      } catch (error) {
        const errorMessage = error.response?.data || 'Lỗi khi hoàn tất thanh toán!';
        // Không hiển thị thông báo lỗi nếu đơn hàng đã được xác nhận
        if (errorMessage.includes('đã được xác nhận trước đó')) {
          setMessage('Thanh toán thành công! Đơn hàng đã được xác nhận.');
          toast.success('Thanh toán thành công!');
        } else {
          setMessage(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    completePayment();
  }, [navigate, searchParams]); // Xóa `isProcessed` khỏi dependency để tránh lặp

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