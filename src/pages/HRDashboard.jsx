import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Typography, Descriptions, Tag, Modal, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployees, verifyEmployee } from '../api/employees';
import { CheckOutlined, ArrowLeftOutlined, FileDoneOutlined } from '@ant-design/icons';

const { Title } = Typography;

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees('hr/unverified');
      setEmployees(data.filter(emp => emp.managerVerified && !emp.hrVerified));
    } catch (error) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleFinalSubmit = async (id) => {
    try {
      await verifyEmployee(id, 'HR');
      message.success('Employee finalized successfully');
      
      // Update the selected employee's status immediately
      setSelectedEmployee(prev => ({
        ...prev,
        hrVerified: true,
        hrVerificationDate: new Date()
      }));
      
      // Show success modal
      Modal.success({
        title: 'Submission Successful',
        content: 'Employee has been finalized and moved to HR records.',
        okText: 'View Verified Employees',
        onOk: () => navigate('/hr/verified')
      });
      
      // Refresh the list
      loadEmployees();
    } catch (error) {
      message.error('Final submission failed: ' + (error.response?.data?.message || error.message));
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
    },
    {
      title: 'Status',
      render: (_, record) => (
        <>
          <Tag color="green">Manager Verified</Tag>
          <Tag color="orange">Pending HR</Tag>
        </>
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
        <Title level={2}>HR Dashboard</Title>
        <Button 
          type="primary" 
          icon={<FileDoneOutlined />}
          onClick={() => navigate('/hr/verified')}
          
        >
          View Verified Employees
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
          <div>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Employee ID">{selectedEmployee.empId}</Descriptions.Item>
              <Descriptions.Item label="Name">{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedEmployee.email}</Descriptions.Item>
              <Descriptions.Item label="Mobile">{selectedEmployee.mobile}</Descriptions.Item>
              <Descriptions.Item label="Designation">{selectedEmployee.designation}</Descriptions.Item>
              <Descriptions.Item label="Salary">{selectedEmployee.salary}</Descriptions.Item>
              <Descriptions.Item label="Verification Status" span={2}>
                <Space>
                  <Tag color="green">Assistant HR Verified</Tag>
                  <Tag color="blue">Manager Verified</Tag>
                  <Tag color={selectedEmployee.hrVerified ? 'purple' : 'orange'}>
                    {selectedEmployee.hrVerified ? 'HR Verified' : 'Pending HR Verification'}
                  </Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                size="large"
                onClick={() => handleFinalSubmit(selectedEmployee.id)}
                style={{ width: 200 }}
                disabled={selectedEmployee.hrVerified}
              >
                {selectedEmployee.hrVerified ? 'Already Verified' : 'Final Submit'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default HRDashboard;