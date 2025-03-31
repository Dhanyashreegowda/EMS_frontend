import React from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>
        Welcome to Employee Management System
      </Title>
      
      <Row justify="center" style={{ marginTop: '40px' }}>
        <Col span={12} style={{ textAlign: 'center' }}>
          {isAuthenticated ? (
            <>
              <Title level={4}>Welcome, {user.user.email} ({user.user.role})</Title>
              <Button 
                type="primary" 
                onClick={() => navigate(`/${user.user.role.toLowerCase()}`)}
                style={{ marginRight: '16px' }}
              >
                Go to Dashboard
              </Button>
              <Button onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button 
                type="primary" 
                onClick={() => navigate('/login')}
                style={{ marginRight: '16px' }}
              >
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;

