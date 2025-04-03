import React, { useState, useEffect } from 'react';
import { Table, Button, message, Card, Typography, Descriptions, Tag, Modal, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, verifyEmployee } from '../../api/employees';
import { CheckOutlined, ArrowLeftOutlined, FileDoneOutlined } from '@ant-design/icons';
import './HRDashboard.css';

const { Title, Text } = Typography;

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
      
      setSelectedEmployee(prev => ({
        ...prev,
        hrVerified: true,
        hrVerificationDate: new Date()
      }));
      
      Modal.success({
        title: 'Submission Successful',
        content: 'Employee has been finalized and moved to HR records.',
        okText: 'View Verified Employees',
        onOk: () => navigate('/hr/verified')
      });
      
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
      responsive: ['md'],
    },
    {
      title: 'Name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      responsive: ['sm'],
    },
    {
      title: 'Status',
      render: (_, record) => (
        <Space size={[4, 8]} wrap>
          <Tag color="green">Manager Verified</Tag>
          <Tag color="orange">Pending HR</Tag>
        </Space>
      ),
      responsive: ['sm', 'md', 'lg'],
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
          size="small"
          className="view-details-btn"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="hr-dashboard-container">
      <Card className="dashboard-card">
        <div className="card-header">
          <div className="header-content">
            <Title level={3} className="dashboard-title">
              HR Verification Dashboard
            </Title>
            {/* <Text type="secondary" className="dashboard-subtitle">
              Pending HR verifications
            </Text> */}
          </div>
          <div className="header-actions">
            <Button 
              type="primary" 
              icon={<FileDoneOutlined />}
              onClick={() => navigate('/hr/verified')}
              className="verified-employees-btn"
            >
              <span className="btn-text">Verified Employees</span>
              <span className="btn-icon-only">
                <FileDoneOutlined />
              </span>
            </Button>
          </div>
        </div>

        <div className="table-container">
          <Table
            columns={columns}
            dataSource={employees}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              responsive: true,
              showSizeChanger: false,
            }}
            scroll={{ x: true }}
            className="employees-table"
          />
        </div>
      </Card>

      {/* Employee Detail Modal */}
      <Modal
        title={
          <div className="modal-header">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => setDetailVisible(false)}
              className="back-button"
              type="text"
            />
            <span className="modal-title">Employee Verification Details</span>
          </div>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width="80%"
        className="employee-detail-modal"
        bodyStyle={{ padding: '24px' }}
      >
        {selectedEmployee && (
          <div className="employee-detail-content">
            <Descriptions 
              bordered 
              column={{ xs: 1, sm: 2 }}
              size="middle"
              className="employee-descriptions"
            >
              <Descriptions.Item label="Employee ID" className="description-item">
                <Text strong>{selectedEmployee.empId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Name" className="description-item">
                <Text strong>{`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email" className="description-item">
                <Text copyable>{selectedEmployee.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mobile" className="description-item">
                <Text copyable>{selectedEmployee.mobile}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Designation" className="description-item">
                {selectedEmployee.designation}
              </Descriptions.Item>
              <Descriptions.Item label="Salary" className="description-item">
                {selectedEmployee.salary}
              </Descriptions.Item>
              <Descriptions.Item label="Verification Status" span={2} className="status-item">
                <Space size={[8, 16]} wrap>
                  <Tag color="green" className="status-tag">Assistant HR Verified</Tag>
                  <Tag color="blue" className="status-tag">Manager Verified</Tag>
                  <Tag 
                    color={selectedEmployee.hrVerified ? 'purple' : 'orange'} 
                    className="status-tag"
                  >
                    {selectedEmployee.hrVerified ? 'HR Verified' : 'Pending HR Verification'}
                  </Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <div className="verification-action">
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
                size="large"
                onClick={() => handleFinalSubmit(selectedEmployee.id)}
                className="verify-button"
                disabled={selectedEmployee.hrVerified}
                block
              >
                {selectedEmployee.hrVerified ? 'Already Verified' : 'Final Verification'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HRDashboard;