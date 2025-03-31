import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, InputNumber, message, Upload, Space } from 'antd';
import { UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { getEmployee, updateEmployee } from '../api/employees';
import axios from 'axios';

const { Title } = Typography;

const EmployeeEditForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState({
    passportFile: [],
    aadharFile: [],
    panFile: []
  });
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
        
        // Initialize file list with existing files
        setFileList({
          passportFile: employee.passportFile ? [{
            uid: '-1',
            name: 'passport',
            status: 'done',
            url: employee.passportFile.startsWith('http') ? 
                 employee.passportFile : 
                 `http://localhost:3000${employee.passportFile}`
          }] : [],
          aadharFile: employee.aadharFile ? [{
            uid: '-2',
            name: 'aadhar',
            status: 'done',
            url: employee.aadharFile.startsWith('http') ? 
                 employee.aadharFile : 
                 `http://localhost:3000${employee.aadharFile}`
          }] : [],
          panFile: employee.panFile ? [{
            uid: '-3',
            name: 'pan',
            status: 'done',
            url: employee.panFile.startsWith('http') ? 
                 employee.panFile : 
                 `http://localhost:3000${employee.panFile}`
          }] : []
        });
      } catch (error) {
        message.error('Failed to load employee data');
        navigate('/manager');
      }
    };
    fetchEmployee();
  }, [id, form, navigate]);


  const beforeUpload = (file, field) => {
    const newFile = {
      ...file,
      status: 'done',
      url: URL.createObjectURL(file)
    };
    setFileList(prev => ({
      ...prev,
      [field]: [newFile]
    }));
    return false;
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Prepare the employee data with existing file URLs first
      let employeeData = {
        ...values,
        passportFile: fileList.passportFile[0]?.url?.replace('http://localhost:3000', ''),
        aadharFile: fileList.aadharFile[0]?.url?.replace('http://localhost:3000', ''),
        panFile: fileList.panFile[0]?.url?.replace('http://localhost:3000', ''),
        salary: typeof values.salary === 'string' ? parseFloat(values.salary) : values.salary
      };

      // Check if new files were uploaded
      const hasNewFiles = Object.values(fileList).some(
        files => files[0]?.originFileObj
      );

      if (hasNewFiles) {
        const formData = new FormData();
        
        if (fileList.passportFile[0]?.originFileObj) {
          formData.append('passportFile', fileList.passportFile[0].originFileObj);
        }
        if (fileList.aadharFile[0]?.originFileObj) {
          formData.append('aadharFile', fileList.aadharFile[0].originFileObj);
        }
        if (fileList.panFile[0]?.originFileObj) {
          formData.append('panFile', fileList.panFile[0].originFileObj);
        }

        const uploadResponse = await axios.post('/employees/upload-files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user'))?.access_token}`
          }
        });

        // Update with new file URLs
        employeeData = {
          ...employeeData,
          ...uploadResponse.data
        };
      }

      await updateEmployee(id, employeeData);
      message.success('Employee updated successfully');
      navigate('/manager');
    } catch (error) {
      console.error('Update error:', error);
      message.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const renderFileViewer = (file) => {
    if (!file?.url) return null;
    return (
      <a 
        href={file.url} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ marginLeft: 8 }}
      >
        <EyeOutlined /> View Document
      </a>
    );
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

{/* Passport File */}
        <Form.Item label="Passport Scan">
          <Upload
            fileList={fileList.passportFile}
            beforeUpload={(file) => beforeUpload(file, 'passportFile')}
            onRemove={() => setFileList(prev => ({...prev, passportFile: []}))}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {renderFileViewer(fileList.passportFile[0])}
        </Form.Item>

        {/* Aadhar Card */}
        <Form.Item label="Aadhar Card Scan">
          <Upload
            fileList={fileList.aadharFile}
            beforeUpload={(file) => beforeUpload(file, 'aadharFile')}
            onRemove={() => setFileList(prev => ({...prev, aadharFile: []}))}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {renderFileViewer(fileList.aadharFile[0])}
        </Form.Item>

        {/* PAN Card */}
        <Form.Item label="PAN Card Scan">
          <Upload
            fileList={fileList.panFile}
            beforeUpload={(file) => beforeUpload(file, 'panFile')}
            onRemove={() => setFileList(prev => ({...prev, panFile: []}))}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {renderFileViewer(fileList.panFile[0])}
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
