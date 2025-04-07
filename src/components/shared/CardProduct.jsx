// src/components/shared/CardProduct.js
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { NavLink, useLocation } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa'; // Thêm icon giỏ hàng
import { toast } from 'react-toastify';

function CardProduct({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart(product); // Gọi hàm thêm vào giỏ hàng từ props
  };
  const location = useLocation();
  const isUser = location.pathname.startsWith('/user');

  const detailLink = isUser
    ? `/user/product-detail/${product.id}`
    : `/product-detail/${product.id}`;
  return (
    <Card style={{ width: '100%', maxWidth: '300px', border: '1px solid #e0e0e0', borderRadius: '8px', position: 'relative' }}>
      {/* Logo thương hiệu (NANOMAX) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {product.brand || 'EGA'}
      </div>

      {/* Nhãn khuyến mãi (Flash Sale) */}
      {/* <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '0',
          background: 'linear-gradient(to right, #ff4d4d, #ff8c00)',
          color: 'white',
          padding: '5px 10px',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '0 4px 4px 0',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span style={{ marginRight: '5px' }}>⚡ FLASH SALE</span>
        <span style={{ backgroundColor: '#ff4d4d', padding: '2px 5px', borderRadius: '4px' }}>
          ƯU ĐÃI ĐẾN 50%
        </span>
        <span style={{ marginLeft: '5px', backgroundColor: '#ff4d4d', padding: '2px 5px', borderRadius: '4px' }}>
          GIAO HÀNG TỐC 2H
        </span>
      </div> */}

      {/* Ảnh sản phẩm */}
      <Card.Img
        variant="top"
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.productName}
        style={{ height: '200px', objectFit: 'cover', padding: '10px' }}
      />

      <Card.Body>
        {/* Tên sản phẩm */}
        <Card.Title style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
          {product.productName}
        </Card.Title>

        {/* Đánh giá (5 sao) */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} style={{ color: '#fadb14', fontSize: '14px', marginRight: '2px' }} />
          ))}
        </div>

        {/* Giá hiện tại và giá gốc */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4d', marginRight: '10px' }}>
            {product.unitPrice?.toLocaleString('vi-VN')}đ
          </span>
          <span style={{ fontSize: '14px', color: '#888', textDecoration: 'line-through' }}>
            {product.originalPrice?.toLocaleString('vi-VN')}đ
          </span>
          {product.originalPrice && (
            <span
              style={{
                marginLeft: '10px',
                backgroundColor: '#ff4d4d',
                color: 'white',
                padding: '2px 5px',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              -{Math.round(((product.originalPrice - product.unitPrice) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Nút Xem chi tiết và Thêm vào giỏ hàng */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink
            className="btn btn-primary"
            to={detailLink }
            style={{ flex: 1, textAlign: 'center' }}
          >
            Xem chi tiết
          </NavLink>
          <Button
            variant="outline-primary"
            onClick={handleAddToCart}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaShoppingCart style={{ marginRight: '5px' }} />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CardProduct;