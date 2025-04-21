import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { theme, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUserCart } from '../../redux/userCartSlice';

export default function LoginUser() {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const res = await login(values);
      const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];
      const hasUserRights = roles.includes('USER');

      if (!hasUserRights) {
        toast.error('Quản trị viên không có quyền đăng nhập vào trang này!');
        return;
      }

      const { username, avatar } = res.data || {};
      if (!username) {
        toast.error('Dữ liệu đăng nhập không hợp lệ!');
        return;
      }

      const userInfo = {
        username,
        avatar: avatar || 'https://via.placeholder.com/40',
      };

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      await dispatch(fetchUserCart()).unwrap();
      toast.success('Đăng nhập thành công!');
      navigate('/user-home');
    } catch (err) {
      const errorMessage = err.response?.data;
      toast.error(errorMessage || 'Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <LoginForm
            logo="https://bizweb.dktcdn.net/100/549/670/themes/996396/assets/logo.png?1743518315474"
            title="User Login"
            subTitle="Hệ thống đăng nhập dành cho người dùng"
            submitter={{
              searchConfig: {
                submitText: 'Đăng nhập',
              },
            }}
            onFinish={handleLogin}
          >
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'Tên đăng nhập'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'Mật khẩu'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu!',
                },
              ]}
            />
          </LoginForm>
          <Space style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <span>
              Nếu chưa có tài khoản, xin mời bạn{' '}
              <Link to="/register" style={{ color: '#1890ff' }}>
                đăng ký
              </Link>
            </span>
          </Space>
        </div>
      </div>
    </ProConfigProvider>
  );
}