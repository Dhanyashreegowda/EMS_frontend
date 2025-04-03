import React from 'react';
import { Button, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HomePage.css'; // We'll create this CSS file

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <Title level={2} className="main-title">
          Welcome to Employee Management System
        </Title>
        <Text className="subtitle">
          Efficiently manage your workforce with our comprehensive solution
        </Text>
        
        <Row justify="center" className="action-row">
          <Col xs={24} md={12} className="action-col">
            {isAuthenticated ? (
              <div className="auth-section">
                <Title level={4} className="welcome-text">
                  Welcome back, {user.user.email} <span>({user.user.role})</span>
                </Title>
                <div className="button-group">
                  <Button 
                    type="primary" 
                    onClick={() => navigate(`/${user.user.role.toLowerCase()}`)}
                    className="dashboard-btn"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    onClick={logout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="unauth-section">
                <Title level={4} className="welcome-text">
                  Get started with our platform
                </Title>
                <div className="button-group">
                  <Button 
                    type="primary" 
                    onClick={() => navigate('/login')}
                    className="login-btn"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="register-btn"
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
