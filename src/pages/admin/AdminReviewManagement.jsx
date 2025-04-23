import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Modal, Form, List, Avatar, Rate, Typography, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import reviewService from '../../services/reviewService';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const AdminReviewManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [replyForm] = Form.useForm();
  const [reviewPage, setReviewPage] = useState(0); // Trang hiện tại của đánh giá trong modal
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn đánh giá để tải thêm

  useEffect(() => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];
    if (!token || !roles.includes('ADMIN')) {
      toast.error('Vui lòng đăng nhập với tài khoản admin!');
      navigate('/login');
      return;
    }
    fetchProducts();
  }, [currentPage, searchKeyword, navigate]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getProductsWithAverageRating(currentPage - 1, pageSize, 'id', 'asc', searchKeyword);
      if (!data.content) {
        throw new Error('Dữ liệu sản phẩm không hợp lệ');
      }
      setProducts(data.content.map(item => ({
        id: item.id,
        productName: item.productName || 'Không xác định',
        averageRating: item.averageRating || 0,
        reviewCount: item.reviewCount || 0,
      })));
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm!');
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (productId, page = 0, loadMore = false) => {
    if (!productId) {
      toast.error('ID sản phẩm không hợp lệ!');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await reviewService.getReviewsByProduct(productId, page, 5);
      setReviews(loadMore ? [...reviews, ...data.content] : data.content || []);
      setReviewPage(page);
      setHasMore(data.content.length === 5); // Nếu trả về đủ 5 đánh giá, có thể còn dữ liệu
    } catch (error) {
      toast.error('Không thể tải danh sách đánh giá!');
      console.error('Lỗi khi lấy đánh giá:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReviews = (product) => {
    if (!product.id) {
      toast.error('Sản phẩm không có ID hợp lệ!');
      return;
    }
    setSelectedProduct(product);
    setReviewPage(0); // Reset page khi mở modal
    setReviews([]); // Reset danh sách đánh giá
    fetchReviews(product.id, 0);
    setIsModalVisible(true);
  };

  const handleLoadMoreReviews = () => {
    if (selectedProduct) {
      fetchReviews(selectedProduct.id, reviewPage + 1, true);
    }
  };

  const handleReplyReview = async (values) => {
    try {
      await reviewService.replyToReview(values.reviewId, values.reply);
      toast.success('Gửi phản hồi thành công!');
      if (selectedProduct?.id) {
        fetchReviews(selectedProduct.id, reviewPage); // Tải lại đánh giá với trang hiện tại
      }
      replyForm.resetFields();
    } catch (error) {
      toast.error('Không thể gửi phản hồi!');
      console.error('Lỗi khi gửi phản hồi:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setReviews([]);
    setReviewPage(0);
    setHasMore(true);
    replyForm.resetFields();
  };

  const handleSearch = (value) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Số sao trung bình',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating) => (
        <Rate disabled value={rating || 0} style={{ fontSize: 14 }} allowHalf />
      ),
    },
    {
      title: 'Số lượng đánh giá',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewReviews(record)}>
          Xem đánh giá
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>
        Quản lý đánh giá sản phẩm
      </Title>

      <Search
        placeholder="Tìm kiếm sản phẩm..."
        prefix={<SearchOutlined />}
        onSearch={handleSearch}
        style={{ marginBottom: '20px', maxWidth: '400px' }}
      />

      {loading && !isModalVisible ? (
        <Spin tip="Đang tải..." size="large" style={{ display: 'block', margin: '50px auto' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalElements,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}

      <Modal
        title={`Đánh giá sản phẩm: ${selectedProduct?.productName || 'Không xác định'}`}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {loading ? (
          <Spin tip="Đang tải đánh giá..." style={{ display: 'block', margin: '20px auto' }} />
        ) : reviews.length === 0 ? (
          <Alert message="Chưa có đánh giá nào cho sản phẩm này!" type="info" showIcon />
        ) : (
          <>
            <List
              dataSource={reviews}
              renderItem={(review) => (
                <List.Item key={review.id} style={{ borderBottom: '1px solid #e8e8e8', padding: '16px 0' }}>
                  <List.Item.Meta
                    avatar={<Avatar>{review.username?.[0]?.toUpperCase() || 'U'}</Avatar>}
                    title={
                      <div>
                        <Text strong>{review.username || 'Ẩn danh'}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN') : 'Không xác định'}
                        </Text>
                      </div>
                    }
                    description={
                      <>
                        <Rate disabled value={review.rating || 0} style={{ fontSize: 14, marginBottom: 8 }} />
                        <Paragraph>{review.comment || 'Không có bình luận'}</Paragraph>
                        {review.replies && review.replies.length > 0 && (
                          <div style={{ marginTop: 12 }}>
                            {review.replies.map((reply) => (
                              <div
                                key={reply.id}
                                style={{
                                  background: '#f5f5f5',
                                  padding: '10px 16px',
                                  borderRadius: 6,
                                  marginBottom: 8,
                                  borderLeft: '3px solid #1890ff',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                  <Avatar
                                    size="small"
                                    src={reply.adminAvatar}
                                    style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                                  >
                                    {reply.adminUsername?.[0]?.toUpperCase() || 'A'}
                                  </Avatar>
                                  <Text strong style={{ color: '#1890ff' }}>
                                    {reply.adminUsername || 'Admin'}
                                  </Text>
                                  <Text type="secondary" style={{ marginLeft: 8 }}>
                                    {reply.createdAt
                                      ? new Date(reply.createdAt).toLocaleString('vi-VN')
                                      : 'Không xác định'}
                                  </Text>
                                </div>
                                <Paragraph style={{ color: '#333' }}>{reply.reply}</Paragraph>
                              </div>
                            ))}
                          </div>
                        )}
                        <Form
                          form={replyForm}
                          onFinish={(values) => handleReplyReview({ ...values, reviewId: review.id })}
                          layout="vertical"
                          style={{ marginTop: 16 }}
                        >
                          <Form.Item
                            name="reply"
                            rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
                          >
                            <Input.TextArea rows={3} placeholder="Nhập phản hồi của bạn..." />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit">
                              Gửi phản hồi
                            </Button>
                          </Form.Item>
                        </Form>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button onClick={handleLoadMoreReviews} loading={loading}>
                  Tải thêm đánh giá
                </Button>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminReviewManagement;