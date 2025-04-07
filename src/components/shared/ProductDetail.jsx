import React from 'react';
import { Card, Row, Col, Typography, Button, Tag, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = ({ product, onAddToCart }) => {
  if (!product) {
    return <div>Đang tải...</div>;
  }

  return (
    <Card style={{ margin: '20px auto', maxWidth: 1200, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <Row gutter={[24, 24]}>
        {/* Hình ảnh sản phẩm */}
        <Col xs={24} md={12}>
          <img
            src={product.image || 'https://via.placeholder.com/500'} // Hình ảnh mặc định nếu không có
            alt={product.productName}
            style={{ width: '100%', maxWidth: 500, borderRadius: 8, objectFit: 'cover' }}
          />
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} md={12}>
          <Title level={2} style={{ color: '#2c3e50' }}>{product.productName}</Title>
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
            <Paragraph style={{ fontSize: 14, color: '#666' }}>{product.description}</Paragraph>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={onAddToCart}
              disabled={product.stockQuantity === 0}
              style={{ borderRadius: 5, padding: '0 20px' }}
            >
              Thêm vào giỏ hàng
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductDetail;