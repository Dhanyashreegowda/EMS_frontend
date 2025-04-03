import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, InputNumber } from 'antd';
import { createEmployee } from '../../api/employees';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './EmployeeForm.css';


const { Title } = Typography;

const EmployeeForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [fileList, setFileList] = useState({
    passportFile: [],
    aadharFile: [],
    panFile: []
  });

  const beforeUpload = (file, field) => {
    setFileList(prev => ({
      ...prev,
      [field]: [file]
    }));
    return false; // Prevent automatic upload
  };


  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Create new FormData for file uploads
      const uploadFormData = new FormData();
      
      // Append files with correct field names
      if (fileList.passportFile[0]) {
        uploadFormData.append('passportFile', fileList.passportFile[0]);
      }
      if (fileList.aadharFile[0]) {
        uploadFormData.append('aadharFile', fileList.aadharFile[0]);
      }
      if (fileList.panFile[0]) {
        uploadFormData.append('panFile', fileList.panFile[0]);
      }
      
      let fileUrls = {};
      // Only upload if files were selected
      if (uploadFormData.entries().next().value) {
        const uploadResponse = await axios.post(
          'http://localhost:3000/employees/upload-files',
          uploadFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.access_token}`
            }
          }
        );
        fileUrls = uploadResponse.data;
      }
  
      // Prepare employee data
      const employeeData = {
        ...values,
        ...fileUrls,
        salary: typeof values.salary === 'string' ? parseFloat(values.salary) : values.salary
      };
  
      if (employeeData.alternateEmail === employeeData.email) {
        employeeData.alternateEmail = '';
      }
  
      await createEmployee(employeeData);
      message.success('Employee created successfully!');
      form.resetFields();
      setFileList({ passportFile: [], aadharFile: [], panFile: [] }); // Reset file list
      onSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      message.error(error.response?.data?.message || 'Failed to create employee');
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

        {/* // Add to the form items (before the submit button) */}
        <Form.Item name="passportFile" label="Passport Scan">
        <Upload
          beforeUpload={(file) => beforeUpload(file, 'passportFile')}
          fileList={fileList.passportFile}
          onRemove={() => setFileList(prev => ({...prev, passportFile: []}))}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

        <Form.Item name="aadharFile" label="Aadhar Card Scan">
        <Upload
          beforeUpload={(file) => beforeUpload(file, 'aadharFile')}
          fileList={fileList.aadharFile}
          onRemove={() => setFileList(prev => ({...prev, aadharFile: []}))}
        >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="panFile" label="PAN Card Scan">
        <Upload
          beforeUpload={(file) => beforeUpload(file, 'panFile')}
          fileList={fileList.panFile}
          onRemove={() => setFileList(prev => ({...prev, panFile: []}))}
        >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
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

