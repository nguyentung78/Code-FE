import React, { useEffect } from 'react';
import { Modal, Table, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserCart,
  updateUserCartQuantity,
  removeFromUserCart,
  clearUserCart, // Import action clearUserCart
} from '../../redux/userCartSlice';

const UserCartModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error } = useSelector((state) => state.userCart);

  useEffect(() => {
    if (visible) {
      dispatch(fetchUserCart());
    }
  }, [visible, dispatch]);

  const handleQuantityChange = (cartItemId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) {
      dispatch(removeFromUserCart(cartItemId));
    } else {
      dispatch(updateUserCartQuantity({ cartItemId, quantity }));
    }
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromUserCart(cartItemId));
  };

  const handleClearCart = () => {
    if (items.length === 0) {
      return; // Không làm gì nếu giỏ hàng đã rỗng
    }
    dispatch(clearUserCart())
      .unwrap()
      .then(() => {
        // Đã có thông báo trong userCartSlice
      })
      .catch((error) => {
        console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
      });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      onClose();
      return;
    }
    onClose();
    navigate('/checkout');
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'productName'],
      key: 'productName',
      render: (text) => text || 'Không rõ',
    },
    {
      title: 'Giá',
      dataIndex: ['product', 'unitPrice'],
      key: 'unitPrice',
      render: (price) => (price ? `${price.toLocaleString()} VNĐ` : '0 VNĐ'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => handleQuantityChange(record.cartItemId, e.target.value)}
          style={{ width: '60px' }}
          disabled={loading}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button danger onClick={() => handleRemove(record.cartItemId)} disabled={loading}>
          Xóa
        </Button>
      ),
    },
  ];

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product?.unitPrice || 0) * (item.quantity || 0),
    0
  );

  return (
    <Modal
      title="🛒 Giỏ hàng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="clear" danger onClick={handleClearCart} disabled={loading || items.length === 0}>
          Xóa toàn bộ
        </Button>,
        <Button key="close" onClick={onClose} disabled={loading}>
          Đóng
        </Button>,
        <Button
          key="checkout"
          type="primary"
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
        >
          Thanh toán
        </Button>,
      ]}
      width={800}
    >
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table
        dataSource={items}
        columns={columns}
        rowKey={(record) => record.cartItemId}
        loading={loading}
        pagination={false}
      />
      <p style={{ marginTop: '16px', fontWeight: 'bold', textAlign: 'right' }}>
        Tổng tiền: {totalAmount.toLocaleString()} VNĐ
      </p>
    </Modal>
  );
};

export default UserCartModal;