// src/routes/publicRoutes.js
import GuestHome from "../pages/guest/GuestHome";
import GuestProductsSearch from "../pages/guest/GuestProductsSearch";
import GuestProductDetail from "../pages/guest/GuestProductDetail";
import Register from "../pages/guest/Register";
import LoginAdmin from "../pages/admin/LoginAdmin";

export const publicRoutes = [
  { path: "/", element: GuestHome },
  { path: "/product", element: GuestProductsSearch},
  { path: "/product-detail/:productId", element: GuestProductDetail },
  { path: "/register", element: Register },
  { path: "/admin-login", element: LoginAdmin },
];