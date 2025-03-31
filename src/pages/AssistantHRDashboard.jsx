import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getEmployees, verifyEmployee } from '../api/employees';

const { Title } = Typography;

const AssistantHRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees('unverified');
      setEmployees(data);
    } catch (error) {
      message.error('Failed to load employees: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

 // In AssistantHRDashboard.jsx
const handleVerify = async (id) => {
  try {
    await verifyEmployee(id, 'ASSISTANT_HR');
    message.success('Employee passed to Manager successfully');
    loadEmployees(); // Refresh the list
    
    // Optional: Auto-navigate to manager dashboard
    // navigate('/manager'); 
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
        <Tag color={record.assistantHrVerified ? 'green' : 'orange'}>
          {record.assistantHrVerified ? 'Verified' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/employee/${record.id}`)}>View</Button>
          {!record.assistantHrVerified && (
            <Button 
              type="primary" 
              onClick={() => handleVerify(record.id)}
            >
              Pass to Manager
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ padding: '24px' }}>
      <Title level={2}>Assistant HR Dashboard</Title>
      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
        locale={{ emptyText: 'No employees awaiting verification' }}
      />
    </Card>
  );
};

export default AssistantHRDashboard;


