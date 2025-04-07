import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spin, Alert, Tag, Modal } from 'antd';
import { fetchOrderHistory, cancelOrder } from '../../redux/orderUserSlice'; // Cập nhật import
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orderUser); // Cập nhật state

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để xem lịch sử đơn hàng!');
      navigate('/login');
      return;
    }

    dispatch(fetchOrderHistory());
  }, [dispatch, navigate]);

  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        dispatch(cancelOrder(orderId));
      },
    });
  };

  const handleViewDetail = (serialNumber) => {
    navigate(`/history/${serialNumber}`);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        switch (status) {
          case 'WAITING':
            color = 'blue';
            break;
          case 'CONFIRMED':
            color = 'green';
            break;
          case 'CANCELLED':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewDetail(record.serialNumber)}>
            Xem chi tiết
          </Button>
          {record.status === 'WAITING' && (
            <Button type="link" danger onClick={() => handleCancelOrder(record.id)}>
              Hủy đơn hàng
            </Button>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải lịch sử đơn hàng..." />
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
    <div style={{ maxWidth: 1200, margin: '20px auto', padding: '20px' }}>
      <h2>Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <Alert message="Bạn chưa có đơn hàng nào!" type="info" showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default OrderHistory;