import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Upload, message, Tabs, List, Modal, Table, Tag, Spin, Typography, Divider, Alert, Avatar } from 'antd'; // Thêm Avatar
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  fetchAddresses,
  addAddress,
  deleteAddress,
  clearError,
} from '../../redux/accountSlice';
import { fetchOrderHistory, cancelOrder, fetchOrderDetail } from '../../redux/orderUserSlice';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, addresses, loading, error } = useSelector((state) => state.account);
  const { orders, orderDetail, loading: orderLoading, error: orderError } = useSelector((state) => state.orderUser);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchUserProfile()).then((action) => {
      console.log('Profile data:', action.payload);
    });
    dispatch(fetchAddresses());
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue(profile);
    }
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [profile, error, profileForm, dispatch]);

  const onProfileFinish = (values) => {
    const data = new FormData();
    data.append('username', values.username || '');
    data.append('email', values.email || '');
    data.append('fullname', values.fullname || '');
    data.append('phone', values.phone || '');
    data.append('address', values.address || '');
    if (fileList.length > 0) {
      data.append('avatar', fileList[0].originFileObj);
    }
  
    dispatch(updateUserProfile(data)).then(() => {
      message.success('Cập nhật thông tin thành công!');
      setFileList([]);
    });
  };
  
  

  const onPasswordFinish = (values) => {
    dispatch(changePassword(values)).then(() => {
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    });
  };

  const onAddressFinish = (values) => {
    dispatch(addAddress(values)).then(() => {
      message.success('Thêm địa chỉ thành công!');
      addressForm.resetFields();
      dispatch(fetchAddresses());
    });
  };

  const handleDeleteAddress = (addressId) => {
    Modal.confirm({
      title: 'Xác nhận xóa địa chỉ',
      content: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      onOk: () => {
        dispatch(deleteAddress(addressId)).then(() => {
          message.success('Xóa địa chỉ thành công!');
        });
      },
    });
  };

  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        dispatch(cancelOrder(orderId));
      },
    });
  };

  const handleViewOrderDetail = (serialNumber) => {
    setSelectedOrder(serialNumber);
    dispatch(fetchOrderDetail(serialNumber)).then(() => {
      setIsModalVisible(true);
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color;
        switch (status) {
          case 'WAITING':
            color = 'blue';
            break;
          case 'CONFIRMED':
            color = 'green';
            break;
          case 'CANCELLED':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleViewOrderDetail(record.serialNumber)}>
            Xem chi tiết
          </Button>
          {record.status === 'WAITING' && (
            <Button type="link" danger onClick={() => handleCancelOrder(record.id)}>
              Hủy đơn hàng
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Quản lý tài khoản</h2>
      <Tabs defaultActiveKey="1">
        {/* Tab Thông tin cá nhân */}
        <TabPane tab="Thông tin cá nhân" key="1">
          <Form form={profileForm} layout="vertical" onFinish={onProfileFinish}>
            <Form.Item name="username" label="Tên đăng nhập">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="fullname" label="Họ tên">
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item label="Avatar hiện tại">
              {profile && profile.avatar ? (
                <Avatar src={profile.avatar} size={64} />
              ) : (
                <Text type="secondary">Không có</Text>
              )}
            </Form.Item>
            <Form.Item label="Cập nhật Avatar">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Tab Đổi mật khẩu */}
        <TabPane tab="Đổi mật khẩu" key="2">
          <Form form={passwordForm} layout="vertical" onFinish={onPasswordFinish}>
            <Form.Item
              name="oldPassword"
              label="Mật khẩu cũ"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, min: 6, message: 'Mật khẩu mới phải từ 6 ký tự trở lên' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label="Xác nhận mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Mật khẩu xác nhận không khớp');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        {/* Tab Quản lý địa chỉ */}
        <TabPane tab="Quản lý địa chỉ" key="3">
          <h3>Thêm địa chỉ mới</h3>
          <Form form={addressForm} layout="vertical" onFinish={onAddressFinish}>
            <Form.Item
              name="fullAddress"
              label="Địa chỉ đầy đủ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="receiveName"
              label="Tên người nhận"
              rules={[{ required: true, message: 'Vui lòng nhập tên người nhận' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm địa chỉ
              </Button>
            </Form.Item>
          </Form>

          <h3>Danh sách địa chỉ</h3>
          <List
            dataSource={addresses}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button danger onClick={() => handleDeleteAddress(item.id)}>
                    Xóa
                  </Button>,
                ]}
              >
                <div>
                  <p><strong>{item.receiveName}</strong> - {item.phone}</p>
                  <p>{item.fullAddress}</p>
                </div>
              </List.Item>
            )}
          />
        </TabPane>

        {/* Tab Quản lý đơn hàng */}
        <TabPane tab="Quản lý đơn hàng" key="4">
          {orderLoading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" tip="Đang tải lịch sử đơn hàng..." />
            </div>
          ) : orderError ? (
            <Alert message={orderError} type="error" showIcon />
          ) : orders.length === 0 ? (
            <Alert message="Bạn chưa có đơn hàng nào!" type="info" showIcon />
          ) : (
            <Table
              columns={orderColumns}
              dataSource={orders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </TabPane>
      </Tabs>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {orderLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
          </div>
        ) : orderError || !orderDetail ? (
          <Alert message={orderError || 'Đơn hàng không tồn tại!'} type="error" showIcon />
        ) : (
          <div>
            <Title level={4}>Thông tin đơn hàng</Title>
            <Text strong>Trạng thái: </Text>
            <Tag color={orderDetail.status === 'WAITING' ? 'blue' : orderDetail.status === 'CONFIRMED' ? 'green' : 'red'}>
              {orderDetail.status}
            </Tag>
            <br />
            <Text strong>Ngày tạo: </Text>
            <Text>{new Date(orderDetail.createdAt).toLocaleString('vi-VN')}</Text>
            <br />
            <Text strong>Tổng tiền: </Text>
            <Text>{orderDetail.totalPrice.toLocaleString()} VNĐ</Text>
            <Divider />

            <Title level={4}>Thông tin người nhận</Title>
            <Text strong>Tên: </Text>
            <Text>{orderDetail.receiveName}</Text>
            <br />
            <Text strong>Số điện thoại: </Text>
            <Text>{orderDetail.receivePhone}</Text>
            <br />
            <Text strong>Địa chỉ: </Text>
            <Text>{orderDetail.receiveAddress}</Text>
            <Divider />

            <Title level={4}>Danh sách sản phẩm</Title>
            {orderDetail.items.map((item) => (
              <div key={item.productId} style={{ marginBottom: '16px' }}>
                <Text strong>{item.name}</Text>
                <br />
                <Text>Giá: {item.unitPrice.toLocaleString()} VNĐ</Text>
                <br />
                <Text>Số lượng: {item.orderQuantity}</Text>
                <br />
                <Text strong>Tổng: {(item.unitPrice * item.orderQuantity).toLocaleString()} VNĐ</Text>
                <Divider style={{ margin: '8px 0' }} />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Account;