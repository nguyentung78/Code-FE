import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { toast } from 'react-toastify';

const { Option } = Select;

const ModalOrderStatus = ({ open, onClose, order, fetchOrders }) => { // Đổi onUpdate thành fetchOrders
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (order) {
            form.setFieldsValue({ status: order.status });
        } else {
            form.resetFields();
        }
    }, [order, form]);

    const onFinish = async (values) => {
        if (!values.status) {
            toast.error('Vui lòng chọn trạng thái!');
            return;
        }

        setLoading(true);
        try {
            await fetchOrders(order.id, values.status); // Gọi hàm từ cha để cập nhật
            toast.success('Cập nhật trạng thái thành công!');
            form.resetFields();
            onClose();
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Cập nhật trạng thái đơn hàng"
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} onFinish={onFinish} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Form.Item
                    label="Trạng thái"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="WAITING">Chờ xác nhận</Option>
                        <Option value="CONFIRMED">Đã xác nhận</Option>
                        <Option value="DELIVERING">Đang giao</Option>
                        <Option value="DELIVERED">Đã giao</Option>
                        <Option value="CANCELLED">Đã hủy</Option>
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalOrderStatus;