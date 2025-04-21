import React from 'react';
import { Modal, Table } from 'antd';

function ModalOrderDetail({ open, onClose, order }) {
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName', // Đảm bảo khớp với dữ liệu
      key: 'productName',
      render: (productName, record) => {
        // Nếu productName không tồn tại trực tiếp, thử truy cập từ object product
        return productName || record.product?.productName || 'Không có tên sản phẩm';
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'orderQuantity',
      key: 'orderQuantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (unitPrice) => unitPrice.toLocaleString() + ' VNĐ',
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (record) => (record.orderQuantity * record.unitPrice).toLocaleString() + ' VNĐ',
    },
  ];

  return (
    <Modal
      title="Chi tiết đơn hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <p><strong>Mã đơn hàng:</strong> {order?.serialNumber || order?.id}</p>
      <p><strong>Khách hàng:</strong> {order?.username}</p>
      <p><strong>Địa chỉ:</strong> {order?.receiveAddress}</p>
      <p><strong>Tổng tiền:</strong> {order?.totalPrice?.toLocaleString()} VNĐ</p>
      <Table
        columns={columns}
        dataSource={order?.items}
        rowKey={(record) => record.productId}
        pagination={false}
      />
    </Modal>
  );
}

export default ModalOrderDetail;