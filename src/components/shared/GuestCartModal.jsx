import React from 'react';
import { Modal, Table, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToGuestCart, updateGuestQuantity, removeFromGuestCart } from '../../redux/guestCartSlice';

const GuestCartModal = ({ visible, onClose, onCheckout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.guestCart);

  const columns = [
    { 
      title: 'Sản phẩm', 
      dataIndex: ['product', 'productName'], 
      key: 'productName',
      render: (text) => text || 'Không có tên'
    },
    { 
      title: 'Giá', 
      dataIndex: ['product', 'unitPrice'], 
      key: 'unitPrice',
      render: (price) => (price ? `${price.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ')
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
          onChange={(e) => {
            const newQuantity = parseInt(e.target.value) || 1;
            dispatch(updateGuestQuantity({ productId: record.product.id, quantity: newQuantity }));
          }}
          style={{ width: '60px' }}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button 
          danger 
          onClick={() => dispatch(removeFromGuestCart(record.product.id))}
        >
          Xóa
        </Button>
      ),
    },
  ];

  const totalAmount = items.reduce((sum, item) => sum + (item.product.unitPrice || 0) * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống!');
    } else {
      onCheckout(); // Gọi hàm từ props
    }
  };

  return (
    <Modal 
      title="Giỏ hàng (Khách)" 
      visible={visible} 
      onCancel={onClose} 
      footer={null}
      width={800}
    >
      <Table 
        dataSource={items} 
        columns={columns} 
        rowKey={(record) => record.product.id} 
        pagination={false}
      />
      <div style={{ marginTop: '16px', textAlign: 'right' }}>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
        </p>
        <Button 
          type="primary" 
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Thanh toán
        </Button>
      </div>
    </Modal>
  );
};

export default GuestCartModal;