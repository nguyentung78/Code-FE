import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Image, Typography, Button, Spin, Alert } from "antd";
import { BASE_URL } from "../../api/index";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToUserCart } from "../redux/userCartSlice"; // Sử dụng userCartSlice
import Cookies from "js-cookie";

const { Title, Paragraph } = Typography;

function ProductDetailUser() {
  const { productId } = useParams(); // Lấy productId từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.userCart.items); // Lấy giỏ hàng từ userCart

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const token = Cookies.get("token");
    const roles = Cookies.get("roles") ? JSON.parse(Cookies.get("roles")) : [];

    if (!token || !roles.includes("USER")) {
      toast.error("Vui lòng đăng nhập với tài khoản người dùng để xem chi tiết sản phẩm!");
      navigate("/login-user");
    }
  }, [navigate]);

  // Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await BASE_URL.get(`/public/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau!");
        toast.error("Lỗi khi tải sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!product) return;
    const existingItem = cart.find((item) => item.product?.id === product.id); // Kiểm tra product.id
    if (existingItem && existingItem.quantity >= product.stockQuantity) {
      toast.warning(`Số lượng trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`);
      return;
    }
    dispatch(addToUserCart({ productId: product.id, quantity: 1 })); // Sử dụng addToUserCart
    toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  // Hiển thị loading
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Đang tải sản phẩm..." />
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error || !product) {
    return (
      <div style={{ maxWidth: 1200, margin: "20px auto" }}>
        <Alert message={error || "Sản phẩm không tồn tại!"} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px" }}>
      <Card className="product-detail-card">
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {/* Hình ảnh sản phẩm */}
          <Image
            width={400}
            height={400}
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.productName}
            style={{ objectFit: "cover", borderRadius: "8px" }}
          />
          {/* Thông tin sản phẩm */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <Title level={2} style={{ color: "#1890ff" }}>
              {product.productName}
            </Title>
            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              {product.description || "Không có mô tả cho sản phẩm này."}
            </Paragraph>
            <Paragraph strong style={{ fontSize: "24px", color: "#d32f2f" }}>
              {product.unitPrice.toLocaleString("vi-VN")} đ
            </Paragraph>
            <Paragraph style={{ fontSize: "16px" }}>
              Số lượng tồn kho: <strong>{product.stockQuantity}</strong> sản phẩm
            </Paragraph>
            <Button
              type="primary"
              size="large"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              style={{ marginTop: "16px" }}
            >
              {product.stockQuantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProductDetailUser;