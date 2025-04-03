import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Button, Descriptions, Modal, Space } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../api/employees';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './HRVerifiedEmployees.css';

const { Title, Text } = Typography;

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
      setEmployees(data.filter(emp => emp.hrVerified));
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
        <Tag color="purple" className="status-tag">HR Verified</Tag>
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
          <span className="btn-text">View</span>
          <span className="btn-icon-only">Details</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="verified-employees-container">
      <Card className="dashboard-card">
        <div className="card-header">
          <div className="header-content">
            <Title level={3} className="dashboard-title">
              Verified Employees
            </Title>
            {/* <Text type="secondary" className="dashboard-subtitle">
              HR verified employee records
            </Text> */}
          </div>
          <div className="header-actions">
            <Button 
              type="default" 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/hr')}
              className="back-to-dashboard-btn"
            >
              <span className="btn-text">Back to Dashboard</span>
              <span className="btn-icon-only">
                <ArrowLeftOutlined />
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
            <span className="modal-title">Employee Details</span>
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
                  <Tag color="purple" className="status-tag">HR Verified</Tag>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HRVerifiedEmployees;

