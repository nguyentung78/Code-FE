import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Spin, Switch } from 'antd'; // Thêm Switch
import { BASE_URL_ADMIN } from '../../api/index';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";

function ModalCategory({ open, onClose, category, fetchCategories }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            form.setFieldsValue({
                categoryName: category.categoryName,
                description: category.description,
                status: category.status, // Thêm status vào giá trị ban đầu
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ status: true }); // Mặc định status là true khi tạo mới
        }
    }, [category, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (category) {
                await BASE_URL_ADMIN.put(`/categories/${category.categoryId}`, values, { // Sử dụng categoryId thay vì id
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                toast.success("Cập nhật danh mục thành công!");
            } else {
                await BASE_URL_ADMIN.post("/categories", values, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    },
                });
                toast.success("Tạo danh mục thành công!");
            }
            fetchCategories();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={category ? 'Cập nhật danh mục' : 'Tạo danh mục mới'}
            open={open}
            onCancel={onClose}
            footer={null}
        >
            {loading ? (
                <div className="text-center">
                    <Spin size="large" />
                </div>
            ) : (
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="categoryName"
                        label="Tên danh mục"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Tên danh mục" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input.TextArea placeholder="Mô tả danh mục" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        valuePropName="checked" // Dùng với Switch
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {category ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
}

export default ModalCategory;