import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Switch, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";
import Cookies from "js-cookie";
import { logout } from "../../services/authService";
import { toast } from "react-toastify";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.theme);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Kiểm tra phân quyền
  useEffect(() => {
    const roles = Cookies.get("roles") ? JSON.parse(Cookies.get("roles")) : [];
    if (!roles.some((role) => role === "ADMIN" || role === "MANAGER")) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
    navigate("/admin-login");
  };

  const menuItems = [
    {
      key: "category",
      icon: <UnorderedListOutlined />,
      label: "Category",
      onClick: () => navigate("/admin/category"),
    },
    {
      key: "products",
      icon: <ShoppingCartOutlined />,
      label: "Products",
      onClick: () => navigate("/admin/products"),
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: "Orders",
      onClick: () => navigate("/admin/orders"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Reports",
      onClick: () => navigate("/admin/reports"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "Admin" : "Admin Panel"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["category"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Space>
            <Switch
              checked={currentTheme === "dark"}
              onChange={() => dispatch(toggleTheme())}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              style={{ backgroundColor: currentTheme === "dark" ? "#1890ff" : "#d9d9d9" }}
            />
          </Space>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;