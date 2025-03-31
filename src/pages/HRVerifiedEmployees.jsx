import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Button, Descriptions, Modal } from 'antd';
import { useAuth } from '../context/AuthContext';
import { getEmployees } from '../api/employees';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const HRVerifiedEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const navigate = useNavigate();

  const loadVerifiedEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees('hr/verified');
      setEmployees(data);
    } catch (error) {
      console.error('Failed to load verified employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifiedEmployees();
  }, []);

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
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Tag color="purple">HR Verified</Tag>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => {
            setSelectedEmployee(record);
            setDetailVisible(true);
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Verified Employees</Title>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/hr')}
        >
          Back to HR Dashboard
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
      />

      {/* Employee Detail Modal */}
      <Modal
        title={
          <div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setDetailVisible(false)}
              style={{ marginRight: 16 }}
            />
            Employee Details
          </div>
        }
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {selectedEmployee && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Employee ID">{selectedEmployee.empId}</Descriptions.Item>
            <Descriptions.Item label="Name">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedEmployee.email}</Descriptions.Item>
            <Descriptions.Item label="Mobile">{selectedEmployee.mobile}</Descriptions.Item>
            <Descriptions.Item label="Designation">{selectedEmployee.designation}</Descriptions.Item>
            <Descriptions.Item label="Salary">{selectedEmployee.salary}</Descriptions.Item>
            <Descriptions.Item label="Verification Status" span={2}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Tag color="green">Assistant HR Verified</Tag>
                <Tag color="blue">Manager Verified</Tag>
                <Tag color="purple">HR Verified</Tag>
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
};

export default HRVerifiedEmployees;