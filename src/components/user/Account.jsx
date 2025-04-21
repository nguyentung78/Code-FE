import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Tabs,
  List,
  Modal,
  Table,
  Tag,
  Spin,
  Typography,
  Divider,
  Alert,
  Avatar,
  Card,
  Image,
  Pagination,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchUserProfile,
  updateUserProfile,
  changePassword,
  fetchAddresses,
  addAddress,
  deleteAddress,
  clearError,
} from '../../redux/accountSlice';
import { fetchWishList, removeFromWishList } from '../../redux/wishListSlice';
import { fetchOrderHistory, cancelOrder, fetchOrderDetail } from '../../redux/orderUserSlice';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, addresses, loading: accountLoading, error: accountError } = useSelector((state) => state.account);
  const { wishList, page, size, totalElements, totalPages, loading: wishListLoading, error: wishListError } = useSelector((state) => state.wishList);
  const { orders, orderDetail, loading: orderLoading, error: orderError } = useSelector((state) => state.orderUser);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [fileList, setFileList] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem thông tin tài khoản!');
      navigate('/login');
      return;
    }
    dispatch(fetchUserProfile());
    dispatch(fetchAddresses());
    dispatch(fetchWishList({ page: currentPage - 1, size: 10 }));
    dispatch(fetchOrderHistory());
  }, [dispatch, navigate, currentPage]);

  useEffect(() => {
    if (profile) {
      profileForm.setFieldsValue({
        username: profile.username,
        email: profile.email,
        fullname: profile.fullname,
        phone: profile.phone,
        address: profile.address,
      });
    }
    if (accountError) {
      message.error(accountError);
      dispatch(clearError());
    }
  }, [profile, accountError, profileForm, dispatch]);

  const onProfileFinish = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key]) formData.append(key, values[key]);
    });
    if (fileList) {
      formData.append('avatar', fileList);
    }
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      message.success('Cập nhật thông tin thành công!');
      setFileList([]);
      dispatch(fetchUserProfile());
    } catch (err) {
      message.error(err || 'Cập nhật thông tin thất bại!');
    }
  };

  const onPasswordFinish = async (values) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
    } catch (err) {
      message.error(err || 'Đổi mật khẩu thất bại!');
    }
  };

  const onAddressFinish = async (values) => {
    try {
      await dispatch(addAddress(values)).unwrap();
      message.success('Thêm địa chỉ thành công!');
      addressForm.resetFields();
      dispatch(fetchAddresses());
    } catch (err) {
      message.error(err || 'Thêm địa chỉ thất bại!');
    }
  };

  const handleDeleteAddress = (addressId) => {
    Modal.confirm({
      title: 'Xác nhận xóa địa chỉ',
      content: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
      onOk: async () => {
        await dispatch(deleteAddress(addressId)).unwrap();
        message.success('Xóa địa chỉ thành công!');
      },
    });
  };

  const handleRemoveFromWishList = (productId) => {
    dispatch(removeFromWishList(productId))
      .then(() => {
        toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích!');
        dispatch(fetchWishList({ page: currentPage - 1, size: 10 }));
      })
      .catch(() => toast.error('Lỗi khi xóa sản phẩm!'));
  };

  const handleCancelOrder = (orderId) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      onOk: async () => {
        await dispatch(cancelOrder(orderId)).unwrap();
        message.success('Hủy đơn hàng thành công!');
        dispatch(fetchOrderHistory());
      },
    });
  };

  const handleViewOrderDetail = (serialNumber) => {
    setSelectedOrder(serialNumber);
    dispatch(fetchOrderDetail(serialNumber)).then(() => setIsModalVisible(true));
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const uploadProps = {
    onRemove: () => setFileList([]),
    beforeUpload: (file) => {
      setFileList(file);
      return false;
    },
  };

  const orderColumns = [
    { title: 'Mã đơn hàng', dataIndex: 'serialNumber', key: 'serialNumber' },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'WAITING' ? 'blue' : status === 'CONFIRMED' ? 'green' : 'red';
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
              Hủy đơn
            </Button>
          )}
        </>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (accountLoading || wishListLoading || orderLoading) {
    return <Spin tip="Đang tải..." size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (accountError || wishListError || orderError) {
    return (
      <Alert
        message={accountError || wishListError || orderError}
        type="error"
        showIcon
        style={{ margin: '20px auto', maxWidth: '600px' }}
      />
    );
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp đơn hàng

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Quản lý tài khoản
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Danh sách yêu thích" key="1">
          {wishList.length === 0 ? (
            <Alert message="Danh sách yêu thích trống!" type="info" showIcon />
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {wishList.map((item) => (
                  <Card
                    key={item.productId}
                    style={{ width: 300 }}
                    cover={
                      <Image
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.productName}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          padding: '10px',
                        }}
                      />
                    }
                    actions={[
                      <Button type="link" onClick={() => navigate(`/user/product-detail/${item.productId}`)}>
                        Xem chi tiết
                      </Button>,
                      <Button type="link" danger onClick={() => handleRemoveFromWishList(item.productId)}>
                        Xóa
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={item.productName}
                      description={`${item.unitPrice?.toLocaleString('vi-VN')} VNĐ`}
                    />
                  </Card>
                ))}
              </div>
              <Pagination
                current={currentPage}
                pageSize={size}
                total={totalElements}
                onChange={handlePageChange}
                style={{ marginTop: '20px', textAlign: 'center' }}
              />
            </>
          )}
        </TabPane>

        <TabPane tab="Thông tin cá nhân" key="2">
          <Form form={profileForm} layout="vertical" onFinish={onProfileFinish}>
            <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="fullname" label="Họ tên">
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
            <Form.Item label="Avatar hiện tại" name="avatar">
              {profile?.avatar ? <Avatar src={profile.avatar} size={64} /> : <Text type="secondary">Chưa có avatar</Text>}
            </Form.Item>
            <Form.Item label="Cập nhật Avatar">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={accountLoading}>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Đổi mật khẩu" key="3">
          <Form form={passwordForm} layout="vertical" onFinish={onPasswordFinish}>
            <Form.Item
              name="oldPassword"
              label="Mật khẩu cũ"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu phải từ 6 ký tự trở lên!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label="Xác nhận mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Mật khẩu xác nhận không khớp!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={accountLoading}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Quản lý địa chỉ" key="4">
          <Title level={4}>Thêm địa chỉ mới</Title>
          <Form form={addressForm} layout="vertical" onFinish={onAddressFinish}>
            <Form.Item
              name="fullAddress"
              label="Địa chỉ đầy đủ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^\d{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="receiveName"
              label="Tên người nhận"
              rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={accountLoading}>
                Thêm địa chỉ
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Title level={4}>Danh sách địa chỉ</Title>
          <List
            dataSource={addresses}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" danger onClick={() => handleDeleteAddress(item.id)}>
                    Xóa
                  </Button>,
                ]}
              >
                <div>
                  <Text strong>{item.receiveName}</Text> - <Text>{item.phone}</Text>
                  <br />
                  <Text>{item.fullAddress}</Text>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: 'Chưa có địa chỉ nào!' }}
          />
        </TabPane>

        <TabPane tab="Quản lý đơn hàng" key="5">
          {sortedOrders.length === 0 ? (
            <Alert message="Bạn chưa có đơn hàng nào!" type="info" showIcon />
          ) : (
            <Table
              columns={orderColumns}
              dataSource={sortedOrders}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </TabPane>
      </Tabs>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[<Button key="close" onClick={handleModalClose}>Đóng</Button>]}
        width={600}
      >
        {orderLoading ? (
          <Spin tip="Đang tải chi tiết đơn hàng..." style={{ display: 'block', margin: '20px auto' }} />
        ) : !orderDetail ? (
          <Alert message="Không tìm thấy chi tiết đơn hàng!" type="error" showIcon />
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
            <Text>{orderDetail.totalPrice.toLocaleString('vi-VN')} VNĐ</Text>
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
                <Text strong>{item.productName}</Text>
                <br />
                <Text>Giá: {item.unitPrice.toLocaleString('vi-VN')} VNĐ</Text>
                <br />
                <Text>Số lượng: {item.orderQuantity}</Text>
                <br />
                <Text strong>Tổng: {(item.unitPrice * item.orderQuantity).toLocaleString('vi-VN')} VNĐ</Text>
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