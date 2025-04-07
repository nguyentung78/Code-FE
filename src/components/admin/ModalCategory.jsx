import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { BASE_URL_ADMIN } from '../../api/index'; // Sử dụng BASE_URL_ADMIN
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
            });
        } else {
            form.resetFields();
        }
    }, [category, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
          if (category) {
            await BASE_URL_ADMIN.put(`/categories/${category.id}`, values, {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
              },
            });
            toast.success("Cập nhật danh mục thành công!");
          } else {
            await BASE_URL_ADMIN.post("/categories", values, {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
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