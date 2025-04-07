import { theme } from "antd";

// Theme cho chế độ sáng
export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#1890ff", // Màu chính (xanh mặc định của Ant Design)
    colorBgBase: "#ffffff", // Màu nền
    colorTextBase: "#000000", // Màu chữ
    colorBorder: "#d9d9d9", // Màu viền
  },
};

// Theme cho chế độ tối
export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#1890ff", // Giữ màu chính
    colorBgBase: "#1f1f1f", // Màu nền tối
    colorTextBase: "#ffffff", // Màu chữ sáng
    colorBorder: "#434343", // Màu viền tối
  },
};