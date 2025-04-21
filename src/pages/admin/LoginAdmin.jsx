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
import Cookies from 'js-cookie';

export default function LoginAdmin() {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const res = await login(values);
      const roles = Cookies.get('roles') ? JSON.parse(Cookies.get('roles')) : [];
      const hasAdminRights = roles.some(
        (role) => role === 'ADMIN' || role === 'MANAGER'
      );
      if (!hasAdminRights) {
        toast.error('Người dùng không có quyền đăng nhập vào trang này!');
        return;
      }
      toast.success('Đăng nhập thành công!');
      navigate('/admin/category');
    } catch (err) {
      const errorMessage = err.response?.data; // Lấy thông báo lỗi từ BE
      toast.error(errorMessage || 'Tên đăng nhập hoặc mật khẩu không đúng!');
    }
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
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
}