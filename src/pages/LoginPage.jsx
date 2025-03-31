import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Modify the onFinish function in LoginPage.jsx:
// Add this to your LoginPage.jsx's onFinish function:
const onFinish = async (values) => {
  setLoading(true);
  try {
    const response = await login(values);
    if (response?.access_token) {
      const role = authLogin(response);
      // Redirect based on role
      switch(role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'ASSISTANT_HR':
          navigate('/assistant-hr');
          break;
        case 'MANAGER':
          navigate('/manager');
          break;
        case 'HR':
          navigate('/hr');
          break;
        default:
          navigate('/');
      }
    }
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Employee Management System
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="your@email.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              size="large"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="link" onClick={() => navigate('/register')}>
            Don't have an account? Register
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;



