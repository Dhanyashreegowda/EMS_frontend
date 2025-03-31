import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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

  return (
    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontWeight: 'bold' }}>
          <Link to="/" style={{ color: 'white', fontSize: '18px' }}>
            Employee Management System
          </Link>
        </div>
        
        {user ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar 
                style={{ backgroundColor: '#1890ff' }} 
                icon={<UserOutlined />} 
              />
              <span style={{ color: 'white', marginLeft: 8 }}>
                {user.user.email} ({user.user.role})
              </span>
            </div>
          </Dropdown>
        ) : (
          <div>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;