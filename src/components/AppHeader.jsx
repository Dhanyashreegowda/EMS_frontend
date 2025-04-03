import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './AppHeader.css'; // We'll create this CSS file

const { Header } = Layout;

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const mobileMenu = (
    <Menu>
      {user ? (
        <>
          <Menu.Item key="profile" icon={<UserOutlined />}>
            {user.user.email} ({user.user.role})
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item key="login" onClick={() => navigate('/login')}>
            Login
          </Menu.Item>
          <Menu.Item key="register" onClick={() => navigate('/register')}>
            Register
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" className="logo">
            Employee Management System
          </Link>
        </div>
        
        {/* Desktop View */}
        <div className="desktop-menu">
          {user ? (
            <Dropdown overlay={menu} placement="bottomRight">
              <div className="user-profile">
                <Avatar 
                  className="user-avatar"
                  icon={<UserOutlined />} 
                />
                <span className="user-info">
                  {user.user.email} ({user.user.role})
                </span>
              </div>
            </Dropdown>
          ) : (
            <div className="auth-buttons">
              <Button 
                type="text" 
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                type="text" 
                className="auth-button"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="mobile-menu">
          <Dropdown overlay={mobileMenu} trigger={['click']}>
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              className="mobile-menu-button"
            />
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;