import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Select, Tag } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import {
    getOrdersThunk,
    getOrdersByStatusThunk,
    getOrderDetailThunk,
    updateOrderStatusThunk,
    resetOrderDetail,
} from '../../redux/orderSlice';
import ModalOrderDetail from '../../components/admin/ModalOrderDetail';
import ModalOrderStatus from '../../components/admin/ModalOrderStatus';
import { toast } from 'react-toastify';

const { Option } = Select;

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, orderDetail, loading, error, totalElements } = useSelector((state) => state.orders);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState(null);

    useEffect(() => {
        if (statusFilter) {
            dispatch(getOrdersByStatusThunk({ orderStatus: statusFilter, page: currentPage - 1, size: pageSize }));
        } else {
            dispatch(getOrdersThunk({ page: currentPage - 1, size: pageSize, direction: 'desc', sortBy: 'createdAt' }));
        }
    }, [dispatch, currentPage, pageSize, statusFilter]);

    useEffect(() => {
        if (orderDetail) {
            setOpenDetailModal(true);
        }
    }, [orderDetail]);

    const handleViewDetail = (orderId) => {
        dispatch(getOrderDetailThunk(orderId));
    };

    const onCloseDetailModal = () => {
        setOpenDetailModal(false);
        dispatch(resetOrderDetail());
    };

    const handleUpdateStatus = (order) => {
        setSelectedOrder(order);
        setOpenStatusModal(true);
    };

    const onCloseStatusModal = () => {
        setOpenStatusModal(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = (orderId, status) => {
        return dispatch(updateOrderStatusThunk({ orderId, status }))
            .unwrap()
            .then(() => {
                if (statusFilter) {
                    dispatch(getOrdersByStatusThunk({ orderStatus: statusFilter, page: currentPage - 1, size: pageSize }));
                } else {
                    dispatch(getOrdersThunk({ page: currentPage - 1, size: pageSize, direction: 'desc', sortBy: 'createdAt' }));
                }
            });
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value || null);
        setCurrentPage(1);
    };

    const getStatusTag = (status) => {
        let color;
        let label;

        switch (status) {
            case 'WAITING':
                color = 'gold';
                label = 'Chờ xác nhận';
                break;
            case 'CONFIRMED':
                color = 'blue';
                label = 'Đã xác nhận';
                break;
            case 'DELIVERING':
                color = 'purple';
                label = 'Đang giao';
                break;
            case 'DELIVERED':
                color = 'green';
                label = 'Đã giao';
                break;
            case 'CANCELLED':
                color = 'red';
                label = 'Đã hủy';
                break;
            default:
                color = 'default';
                label = status;
        }

        return (
            <Tag color={color} style={{ fontWeight: 'bold', borderRadius: '12px', padding: '2px 8px' }}>
                {label}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        { title: 'Mã đơn hàng', dataIndex: 'serialNumber', key: 'serialNumber' },
        { title: 'Khách hàng', dataIndex: 'username', key: 'username' },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price.toLocaleString()} VND`,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record.id)}
                        title="Xem chi tiết"
                    />
                    <Button
                        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        icon={<EditOutlined />}
                        onClick={() => handleUpdateStatus(record)}
                        title="Cập nhật trạng thái"
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản lý đơn hàng</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Select
                placeholder="Lọc theo trạng thái"
                onChange={handleStatusFilterChange}
                allowClear
                style={{ width: 200, marginBottom: 16 }}
            >
                <Option value="WAITING">Chờ xác nhận</Option>
                <Option value="CONFIRMED">Đã xác nhận</Option>
                <Option value="DELIVERING">Đang giao</Option>
                <Option value="DELIVERED">Đã giao</Option>
                <Option value="CANCELLED">Đã hủy</Option>
            </Select>
            <Table
                columns={columns}
                dataSource={orders}
                loading={loading}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalElements,
                    onChange: (page) => setCurrentPage(page),
                }}
            />
            <ModalOrderDetail
                open={openDetailModal}
                onClose={onCloseDetailModal}
                order={orderDetail}
            />
            <ModalOrderStatus
                open={openStatusModal}
                onClose={onCloseStatusModal}
                order={selectedOrder}
                fetchOrders={handleStatusChange} // Truyền hàm thay vì fetchOrders
            />
        </div>
    );
};

export default Orders;