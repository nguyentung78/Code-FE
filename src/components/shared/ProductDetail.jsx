import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space, List, Avatar, Rate, Form, Input, Spin, Alert } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import reviewService from '../../services/reviewService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProductDetail = ({ product, onAddToCart, userId, onSubmitReview }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [form] = Form.useForm();

  if (!product) {
    return <div>Đang tải...</div>;
  }

  // Lấy danh sách đánh giá của sản phẩm
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await reviewService.getReviewsByProduct(product.id, 0, 5);
        setReviews(data.content || []);
      } catch (error) {
        toast.error('Không thể tải đánh giá!');
        console.error('Lỗi khi lấy đánh giá:', error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [product.id]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    const token = Cookies.get('token');
    const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

    if (!token || !roles.includes('USER')) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }

    onAddToCart(product);
  };

  // Xử lý gửi đánh giá
  const handleSubmitReview = async (values) => {
    setSubmittingReview(true);
    setReviewError(null);
    try {
      await onSubmitReview({ ...values, productId: product.id });
      form.resetFields();
      const updatedReviews = await reviewService.getReviewsByProduct(product.id, 0, 5);
      setReviews(updatedReviews.content || []);
      toast.success('Đánh giá của bạn đã được gửi thành công!');
    } catch (error) {
      const errorMessage = error.response?.data || 'Không thể gửi đánh giá! Vui lòng thử lại.';
      setReviewError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '20px auto' }}>
      {/* Thông tin sản phẩm */}
      <Card
        style={{
          borderRadius: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.productName}
              style={{ width: '100%', maxWidth: 500, borderRadius: 8, objectFit: 'cover' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={2} style={{ color: '#2c3e50' }}>
              {product.productName}
            </Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Text strong style={{ fontSize: 16 }}>
                Danh mục:{' '}
                <span style={{ color: '#1890ff' }}>
                  {product.category ? product.category.categoryName : 'Không có danh mục'}
                </span>
              </Text>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                Giá: {product.unitPrice.toLocaleString('vi-VN')} VNĐ
              </Text>
              <Text>
                Tồn kho:{' '}
                {product.stockQuantity > 0 ? (
                  <Tag color="green">{product.stockQuantity} sản phẩm</Tag>
                ) : (
                  <Tag color="red">Hết hàng</Tag>
                )}
              </Text>
              <Text>
                Nổi bật:{' '}
                <Tag color={product.featured ? 'green' : 'red'}>
                  {product.featured ? 'Có' : 'Không'}
                </Tag>
              </Text>
              <Paragraph style={{ fontSize: 14, color: '#666' }}>
                {product.description || 'Không có mô tả.'}
              </Paragraph>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                style={{ borderRadius: 5, padding: '0 20px' }}
              >
                Thêm vào giỏ hàng
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Form đánh giá (chỉ hiển thị nếu đã đăng nhập) */}
      {userId && (
        <Card
          title="Viết đánh giá của bạn"
          style={{
            marginTop: 20,
            borderRadius: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        >
          {reviewError && (
            <Alert
              message={reviewError}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Form
            form={form}
            onFinish={handleSubmitReview}
            layout="vertical"
          >
            <Form.Item
              label="Đánh giá của bạn"
              name="rating"
              rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              label="Nhận xét"
              name="comment"
              rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
            >
              <TextArea rows={4} placeholder="Nhập nhận xét của bạn về sản phẩm..." />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submittingReview}
              >
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Danh sách đánh giá */}
      <Card
        title="Đánh giá sản phẩm"
        style={{
          marginTop: 20,
          borderRadius: 10,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        {loadingReviews ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin tip="Đang tải đánh giá..." />
          </div>
        ) : reviews.length > 0 ? (
          <List
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item
                style={{ borderBottom: '1px solid #e8e8e8', padding: '16px 0' }}
              >
                <List.Item.Meta
                  avatar={<Avatar>{review.username?.[0]?.toUpperCase() || 'U'}</Avatar>}
                  title={
                    <Space>
                      <Text strong>{review.username || 'Ẩn danh'}</Text>
                      <Text type="secondary">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleString('vi-VN')
                          : 'Không xác định'}
                      </Text>
                    </Space>
                  }
                  description={
                    <>
                      <Rate
                        disabled
                        value={review.rating || 0}
                        style={{ fontSize: 14, marginBottom: 8 }}
                      />
                      <Paragraph>{review.comment || 'Không có bình luận'}</Paragraph>
                      {/* Hiển thị tất cả phản hồi từ admin */}
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
                              <Space>
                                <Avatar
                                  size="small"
                                  src={reply.adminAvatar}
                                  style={{ backgroundColor: '#1890ff' }}
                                >
                                  {reply.adminUsername?.[0]?.toUpperCase() || 'A'}
                                </Avatar>
                                <Text strong style={{ color: '#1890ff' }}>
                                  {reply.adminUsername || 'Admin'}
                                </Text>
                                <Text type="secondary">
                                  {reply.createdAt
                                    ? new Date(reply.createdAt).toLocaleString('vi-VN')
                                    : 'Không xác định'}
                                </Text>
                              </Space>
                              <Paragraph style={{ marginTop: 8, color: '#333' }}>
                                {reply.reply}
                              </Paragraph>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Chưa có đánh giá nào cho sản phẩm này.
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;