import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Card, Typography, Popconfirm, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getEmployees, verifyEmployee, deleteEmployee ,getEmployeesForManager} from '../api/employees';
import { CheckOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      message.success('Employee deleted successfully');
      loadEmployees();
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Deletion failed');
    }
  };

const loadEmployees = async () => {
  setLoading(true);
  try {
    const data = await getEmployeesForManager(); // Use the new endpoint
    setEmployees(data);
  } catch (error) {
    console.error('Error loading employees:', error);
    message.error('Failed to load employees');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadEmployees();
  }, []);

  // In ManagerDashboard.jsx
const handleVerify = async (id) => {
  try {
    await verifyEmployee(id, 'MANAGER');
    message.success('Employee verified and passed to HR successfully');
    loadEmployees();
    
    // Optional: Auto-navigate to HR dashboard
    // navigate('/hr'); 
  } catch (error) {
    message.error('Verification failed: ' + (error.response?.data?.message || error.message));
  }
};

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'empId',
      key: 'empId',
    },
    {
      title: 'Name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Space>
          <Tag color={record.assistantHrVerified ? 'green' : 'red'}>
            {record.assistantHrVerified ? 'Assistant HR Verified' : 'Pending Assistant HR'}
          </Tag>
          <Tag color={record.managerVerified ? 'blue' : 'orange'}>
            {record.managerVerified ? 'Manager Verified' : 'Pending Manager'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => navigate(`/employee/${record.id}/edit`)}
            />
          </Tooltip>
          
          {!record.managerVerified && (
            <Tooltip title="Verify">
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                onClick={() => handleVerify(record.id)}
              />
            </Tooltip>
          )}
          
          <Tooltip title="View">
            <Button 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/employee/${record.id}`)}
            />
          </Tooltip>
          
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this employee?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <Card style={{ padding: '24px' }}>
      <Title level={2}>Manager Dashboard</Title>
      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default ManagerDashboard;


