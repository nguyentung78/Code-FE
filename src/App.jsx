// src/App.jsx
import { ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { lightTheme, darkTheme } from "./themes";
import Routers from "./routes/routers"; // Sử dụng Routers
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { clearGuestCart } from "./redux/guestCartSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const selectedTheme = theme === "light" ? lightTheme : darkTheme;
  useEffect(() => {
    dispatch(clearGuestCart());
  }, []);
  return (
    <ConfigProvider theme={selectedTheme}>
      <Routers />
      <ToastContainer />
    </ConfigProvider>
  );
}

export default App;