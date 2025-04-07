import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetail } from '../../redux/orderUserSlice'; // Cập nhật import
import { Spin, Alert, Typography, Row, Col, Divider, Tag, Button } from 'antd';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const OrderDetail = () => {
  const { serialNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetail, loading, error } = useSelector((state) => state.orderUser); // Cập nhật state

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để xem chi tiết đơn hàng!');
      navigate('/login');
      return;
    }

    dispatch(fetchOrderDetail(serialNumber));
  }, [dispatch, navigate, serialNumber]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto' }}>
        <Alert message={error || 'Đơn hàng không tồn tại!'} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto', padding: '20px' }}>
      <Title level={2}>Chi tiết đơn hàng #{orderDetail.serialNumber}</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Title level={4}>Thông tin đơn hàng</Title>
          <Text strong>Trạng thái: </Text>
          <Tag color={orderDetail.status === 'WAITING' ? 'blue' : orderDetail.status === 'CONFIRMED' ? 'green' : 'red'}>
            {orderDetail.status}
          </Tag>
          <br />
          <Text strong>Ngày tạo: </Text>
          <Text>{new Date(orderDetail.createdAt).toLocaleString('vi-VN')}</Text>
          <br />
          <Text strong>Tổng tiền: </Text>
          <Text>{orderDetail.totalPrice.toLocaleString()} VNĐ</Text>
          <Divider />
          <Title level={4}>Thông tin người nhận</Title>
          <Text strong>Tên: </Text>
          <Text>{orderDetail.receiveName}</Text>
          <br />
          <Text strong>Số điện thoại: </Text>
          <Text>{orderDetail.receivePhone}</Text>
          <br />
          <Text strong>Địa chỉ: </Text>
          <Text>{orderDetail.receiveAddress}</Text>
        </Col>
        <Col xs={24} md={12}>
          <Title level={4}>Danh sách sản phẩm</Title>
          {orderDetail.items.map((item) => (
            <div key={item.productId} style={{ marginBottom: '16px' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text>Giá: {item.unitPrice.toLocaleString()} VNĐ</Text>
                  <br />
                  <Text>Số lượng: {item.orderQuantity}</Text>
                </Col>
                <Col>
                  <Text strong>{(item.unitPrice * item.orderQuantity).toLocaleString()} VNĐ</Text>
                </Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
            </div>
          ))}
        </Col>
      </Row>
      <Button type="primary" onClick={() => navigate('/history')}>
        Quay lại
      </Button>
    </div>
  );
};

export default OrderDetail;