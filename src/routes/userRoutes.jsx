// src/routes/userRoutes.js
import ProductDetailUser from "../pages/user/ProductDetailUser";
import UserHome from "../pages/user/UserHome";
import Account from "../components/user/Account";
import Checkout from "../components/user/Checkout"; // Đã có sẵn trong Routers.js
import CheckoutSuccess from "../pages/user/CheckoutSuccess"; // Tạo mới
import CheckoutCancel from "../pages/user/CheckoutCancel"; // Tạo mới

export const userRoutes = [
  { path: "/user-home", element: UserHome },
  { path: "/user/product-detail/:productId", element: ProductDetailUser },
  { path: "/account", element: Account },
  { path: "/user/cart/checkout", element: Checkout }, // Thêm route cho Checkout
  { path: "/user/cart/checkout/success", element: CheckoutSuccess }, // Route cho thanh toán thành công
  { path: "/user/cart/checkout/cancel", element: CheckoutCancel }, // Route cho hủy thanh toán
];