// src/pages/admin/LoginAdmin.jsx
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'; // Thêm import Cookies để kiểm tra roles

export default function LoginAdmin() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleLogin = (values) => {
    login(values)
      .then((res) => {
        // Lấy roles từ Cookies sau khi đăng nhập thành công
        const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];

        // Kiểm tra xem roles có chứa "ADMIN" hoặc "MANAGER" không
        const hasAdminRights = roles.some(
          (role) => role === 'ADMIN' || role === 'MANAGER'
        );

        if (!hasAdminRights) {
          // Nếu chỉ có role "USER" hoặc không có quyền phù hợp
          toast.error('Người dùng không có quyền đăng nhập vào trang này!');
          return; // Ngăn điều hướng
        }

        // Nếu có quyền, hiển thị thông báo thành công và điều hướng
        toast.success('Đăng nhập thành công!');
        navigate('/admin');
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Đăng nhập thất bại!');
      });
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: token.colorBgContainer }}>
        <LoginForm
          logo="https://bizweb.dktcdn.net/100/549/670/themes/996396/assets/logo.png?1743518315474"
          title="Admin Panel"
          subTitle="Hệ thống quản lý dành cho quản trị viên"
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
            placeholder={'Tên đăng nhập: admin hoặc user'}
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
              strengthText:
                'Mật khẩu nên chứa số, chữ cái và ký tự đặc biệt, ít nhất 8 ký tự.',
              statusRender: (value) => {
                const getStatus = () => {
                  if (value && value.length > 12) {
                    return 'ok';
                  }
                  if (value && value.length > 6) {
                    return 'pass';
                  }
                  return 'poor';
                };
                const status = getStatus();
                if (status === 'pass') {
                  return (
                    <div style={{ color: token.colorWarning }}>
                      Độ mạnh: Trung bình
                    </div>
                  );
                }
                if (status === 'ok') {
                  return (
                    <div style={{ color: token.colorSuccess }}>
                      Độ mạnh: Mạnh
                    </div>
                  );
                }
                return (
                  <div style={{ color: token.colorError }}>Độ mạnh: Yếu</div>
                );
              },
            }}
            placeholder={'Mật khẩu'}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          />
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              Tự động đăng nhập
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              Quên mật khẩu
            </a>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}