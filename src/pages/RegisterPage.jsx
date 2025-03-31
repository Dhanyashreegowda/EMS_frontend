import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom'; // Added navigate import

const { Title } = Typography;
const { Option } = Select;

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // In RegisterPage.jsx, modify the onFinish handler:

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
      <Card style={{ width: 500 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Register</Title>
        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please input valid email!' }]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 6, message: 'Minimum 6 characters required!' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="mobile_number"
            label="Mobile Number"
            rules={[
                { required: true, message: 'Please input mobile number!' },
                { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10 digit mobile number!' }
            ]}
            >
            <Input prefix={<PhoneOutlined />} />
            </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select placeholder="Select role">
              <Option value="ADMIN">Admin</Option>
              <Option value="ASSISTANT_HR">Assistant HR</Option>
              <Option value="MANAGER">Manager</Option>
              <Option value="HR">HR</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;


