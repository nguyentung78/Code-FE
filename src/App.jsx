import { ConfigProvider } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { lightTheme, darkTheme } from "./themes";
import Routers from "./routes/routers";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


function App() {
  const dispatch = useDispatch(); // Khai báo dispatch trước useEffect
  const { theme } = useSelector((state) => state.theme);
  const selectedTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <ConfigProvider theme={selectedTheme}>
      <Routers />
      <ToastContainer />
    </ConfigProvider>
  );
}

export default App; 