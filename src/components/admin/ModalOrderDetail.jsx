import React from 'react';
import { Modal, Table } from 'antd';

function ModalOrderDetail({ open, onClose, order }) {
    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productName', // Đổi từ 'product' thành 'name' để khớp với OrderDetailDTO
            key: 'productName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'orderQuantity', // Đổi từ 'quantity' thành 'orderQuantity'
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
                dataSource={order?.items} // Đổi từ orderDetails thành items để khớp với OrderResponseDTO
                rowKey={(record) => record.productId} // Dùng productId làm key
                pagination={false}
            />
        </Modal>
    );
}

export default ModalOrderDetail;