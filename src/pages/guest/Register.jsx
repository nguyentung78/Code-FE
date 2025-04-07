import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { BASE_URL_AUTH } from '../../api/index'; // Sử dụng BASE_URL_AUTH
import { toast } from 'react-toastify';

function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = ({ fileList }) => {
        setFile(fileList[0]);
    };

    const onFinish = async (values) => {
        setLoading(true);
        if (values.password !== values.confirmPassword) {
            toast.error('Mật khẩu nhập lại không khớp!');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('fullname', values.fullname);
        formData.append('phone', values.phone);
        formData.append('address', values.address);
        if (file?.originFileObj) {
            formData.append('avatar', file.originFileObj);
        }

        try {
            await BASE_URL_AUTH.post('/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Đăng ký thành công!', {
                position: 'top-right',
                autoClose: 1500,
            });
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!', {
                position: 'top-right',
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                            <div className="card-body p-5">
                                <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>Đăng ký tài khoản</h2>
                                <Form
                                    form={form}
                                    name="register"
                                    onFinish={onFinish}
                                    layout="vertical"
                                    requiredMark="optional"
                                >
                                    <Form.Item
                                        name="username"
                                        label="Tên đăng nhập"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                                    >
                                        <Input placeholder="Tên đăng nhập" />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
                                    >
                                        <Input placeholder="Email" />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    >
                                        <Input.Password placeholder="Mật khẩu" />
                                    </Form.Item>
                                    <Form.Item
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                                    >
                                        <Input.Password placeholder="Xác nhận mật khẩu" />
                                    </Form.Item>
                                    <Form.Item
                                        name="fullname"
                                        label="Họ và tên"
                                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                    >
                                        <Input placeholder="Họ và tên" />
                                    </Form.Item>
                                    <Form.Item
                                        name="phone"
                                        label="Số điện thoại"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                    >
                                        <Input placeholder="Số điện thoại" />
                                    </Form.Item>
                                    <Form.Item
                                        name="address"
                                        label="Địa chỉ"
                                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                                    >
                                        <Input placeholder="Địa chỉ" />
                                    </Form.Item>
                                    <Form.Item
                                        name="avatar"
                                        label="Ảnh đại diện"
                                    >
                                        <Upload
                                            onChange={handleFileChange}
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            accept="image/*"
                                        >
                                            <Button icon={<UploadOutlined />}>Tải lên ảnh</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block loading={loading}>
                                            Đăng ký
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;