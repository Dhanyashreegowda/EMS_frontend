import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, InputNumber, message } from 'antd';
import { getEmployee, updateEmployee } from '../api/employees';

const { Title } = Typography;

const EmployeeEditForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await getEmployee(id);
        form.setFieldsValue({
          ...employee,
          salary: parseFloat(employee.salary)
        });
      } catch (error) {
        message.error('Failed to load employee data');
        navigate('/manager');
      }
    };
    fetchEmployee();
  }, [id, form, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateEmployee(id, values);
      message.success('Employee updated successfully');
      navigate('/manager');
    } catch (error) {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
        Edit Employee
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
          <Input disabled />
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

        <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="salary" label="Salary" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Employee
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate('/manager')}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EmployeeEditForm;
