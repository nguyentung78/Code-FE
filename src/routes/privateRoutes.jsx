import Category from "../pages/admin/Category";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Reports from "../pages/admin/Reports";

export const privateRoutes = [
  {
    path: "/admin/category",
    element: Category,
  },
  {
    path: "/admin/products",
    element: Products,
  },
  {
    path: "/admin/orders",
    element: Orders,
  },
  {
    path: "/admin/users",
    element: Users,
  },
  {
    path: "/admin/reports",
    element: Reports,
  },
];