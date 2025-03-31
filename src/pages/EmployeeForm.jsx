import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, InputNumber } from 'antd';
import { createEmployee } from '../api/employees';


const { Title } = Typography;

const EmployeeForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (typeof values.salary === 'string') {
        values.salary = parseFloat(values.salary);
      }
      
      // Ensure alternateEmail is different from primary email
      if (values.alternateEmail === values.email) {
        values.alternateEmail = ''; // or show error
      }
  
      await createEmployee(values);
      message.success('Employee created successfully!');
      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        message.error('Employee with this email already exists');
      } else {
        message.error('Failed to create employee');
      }
      console.error('Creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Add New Employee
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="alternateEmail" label="Alternate Email" rules={[{ type: 'email' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="mobile" label="Mobile" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="alternateMobile" label="Alternate Mobile">
          <Input />
        </Form.Item>

        <Form.Item name="empId" label="Employee ID" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="passportNumber" label="Passport Number">
            <Input />
        </Form.Item>

        <Form.Item name="aadharNumber" label="Aadhar Number">
            <Input />
        </Form.Item>

        <Form.Item name="panCardNumber" label="PAN Card Number">
            <Input />
        </Form.Item>

        <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ width: '100%' }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EmployeeForm;