// src/components/ModalOrderDetail.jsx
import React from 'react';
import { Modal, Table } from 'antd';

function ModalOrderDetail({ open, onClose, order }) {
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product) => product.productName,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
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
            render: (record) => (record.quantity * record.unitPrice).toLocaleString() + ' VNĐ',
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
            <p><strong>Mã đơn hàng:</strong> {order?.id}</p>
            <p><strong>Khách hàng:</strong> {order?.user?.fullname}</p>
            <p><strong>Địa chỉ:</strong> {order?.shippingAddress}</p>
            <p><strong>Tổng tiền:</strong> {order?.totalAmount?.toLocaleString()} VNĐ</p>
            <Table
                columns={columns}
                dataSource={order?.orderDetails}
                rowKey={(record) => record.id}
                pagination={false}
            />
        </Modal>
    );
}

export default ModalOrderDetail;