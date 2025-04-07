import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Radio, Spin, Alert, Typography, Row, Col, Divider, Select, Modal } from 'antd';
import { toast } from 'react-toastify';
import { fetchUserCart, clearUserCart } from '../../redux/userCartSlice';
import { BASE_URL } from '../../api/index';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;
const { Option } = Select;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading, error } = useSelector((state) => state.userCart);
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState('COD'); // Cho phép thay đổi phương thức thanh toán
  const [submitting, setSubmitting] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  // Lấy thông tin giỏ hàng và địa chỉ người dùng
  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.error('Vui lòng đăng nhập với tài khoản người dùng để thanh toán!');
      navigate('/login-user');
      return;
    }

    dispatch(fetchUserCart());

    const fetchUserAddresses = async () => {
      try {
        const response = await BASE_URL.get('/user/account/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserAddresses(response.data || []);
        if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
          const defaultAddress = response.data[0];
          form.setFieldsValue({
            receiveName: defaultAddress.receiveName,
            receivePhone: defaultAddress.phone,
            receiveAddress: defaultAddress.fullAddress,
          });
        } else {
          setUseNewAddress(true);
        }
      } catch (err) {
        toast.error('Không thể tải danh sách địa chỉ!');
      }
    };
    fetchUserAddresses();
  }, [dispatch, navigate, form]);

  // Tính tổng tiền
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product?.unitPrice || 0) * (item.quantity || 0),
    0
  );

  // Xử lý khi thay đổi lựa chọn địa chỉ
  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setUseNewAddress(true);
      form.setFieldsValue({
        receiveName: '',
        receivePhone: '',
        receiveAddress: '',
      });
    } else {
      setUseNewAddress(false);
      const selectedAddress = userAddresses.find((addr) => addr.id === addressId);
      if (selectedAddress) {
        form.setFieldsValue({
          receiveName: selectedAddress.receiveName,
          receivePhone: selectedAddress.phone,
          receiveAddress: selectedAddress.fullAddress,
        });
      }
    }
  };

  // Xử lý đặt hàng
  const handleCheckout = async (values) => {
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!');
      return;
    }

    const checkoutData = {
      addressId: useNewAddress ? null : selectedAddressId,
      receiveAddress: values.receiveAddress,
      receivePhone: values.receivePhone,
      receiveName: values.receiveName,
      note: values.note || '',
      paymentMethod: paymentMethod.toLowerCase(), // "cod" hoặc "paypal"
    };

    // Xác nhận trước khi đặt hàng
    Modal.confirm({
      title: 'Xác nhận đặt hàng',
      content: `Bạn có chắc chắn muốn đặt hàng với phương thức ${paymentMethod === 'COD' ? 'thanh toán khi nhận hàng' : 'thanh toán qua PayPal'}?`,
      okText: 'Đặt hàng',
      cancelText: 'Hủy',
      onOk: async () => {
        setSubmitting(true);
        try {
          const response = await BASE_URL.post('/user/cart/checkout', checkoutData, {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
          });

          if (paymentMethod === 'PayPal' && response.data.redirectUrl) {
            // Chuyển hướng tới PayPal nếu chọn thanh toán PayPal
            toast.info('Đang chuyển hướng tới PayPal...');
            window.location.href = response.data.redirectUrl;
          } else {
            // Xử lý COD
            toast.success('Đặt hàng thành công!');
            dispatch(clearUserCart());
            navigate('/user-home'); // Hoặc trang lịch sử đơn hàng
          }
        } catch (error) {
          toast.error(error.response?.data || 'Lỗi khi đặt hàng!');
        } finally {
          setSubmitting(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto' }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 1200, margin: '20px auto' }}>
        <Alert message="Giỏ hàng của bạn đang trống!" type="info" showIcon />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto', padding: '20px' }}>
      <Title level={2}>Thanh toán</Title>
      <Row gutter={[24, 24]}>
        {/* Cột bên trái: Thông tin người nhận và phương thức thanh toán */}
        <Col xs={24} md={12}>
          <Title level={4}>Thông tin người nhận</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCheckout}
            initialValues={{
              receiveName: '',
              receivePhone: '',
              receiveAddress: '',
              note: '',
            }}
          >
            <Form.Item label="Chọn địa chỉ giao hàng">
              <Select
                value={useNewAddress ? 'new' : selectedAddressId}
                onChange={handleAddressChange}
                placeholder="Chọn địa chỉ"
              >
                {userAddresses.map((address) => (
                  <Option key={address.id} value={address.id}>
                    {address.receiveName} - {address.phone} - {address.fullAddress}
                  </Option>
                ))}
                <Option value="new">Thêm địa chỉ mới</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Họ và tên người nhận"
              name="receiveName"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input placeholder="Nhập họ và tên" disabled={!useNewAddress && selectedAddressId} />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="receivePhone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" disabled={!useNewAddress && selectedAddressId} />
            </Form.Item>
            <Form.Item
              label="Địa chỉ nhận hàng"
              name="receiveAddress"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ nhận hàng" disabled={!useNewAddress && selectedAddressId} />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea placeholder="Nhập ghi chú (tối đa 100 ký tự)" maxLength={100} />
            </Form.Item>

            <Title level={4}>Phương thức thanh toán</Title>
            <Form.Item>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)} // Cập nhật paymentMethod
              >
                <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                <Radio value="PayPal">Thanh toán qua PayPal</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={items.length === 0}
                block
              >
                Đặt hàng
              </Button>
            </Form.Item>
          </Form>
        </Col>

        {/* Cột bên phải: Thông tin đơn hàng */}
        <Col xs={24} md={12}>
          <Title level={4}>Thông tin đơn hàng</Title>
          {items.map((item) => (
            <div key={item.cartItemId} style={{ marginBottom: '16px' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong>{item.product?.productName || 'Không rõ'}</Text>
                  <br />
                  <Text>Giá: {(item.product?.unitPrice || 0).toLocaleString()} VNĐ</Text>
                  <br />
                  <Text>Số lượng: {item.quantity}</Text>
                </Col>
                <Col>
                  <Text strong>
                    {(item.product?.unitPrice * item.quantity || 0).toLocaleString()} VNĐ
                  </Text>
                </Col>
              </Row>
              <Divider style={{ margin: '8px 0' }} />
            </div>
          ))}
          <Divider />
          <Row justify="space-between">
            <Col>
              <Title level={4}>Tổng tiền:</Title>
            </Col>
            <Col>
              <Title level={4} style={{ color: '#d32f2f' }}>
                {totalAmount.toLocaleString()} VNĐ
              </Title>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;