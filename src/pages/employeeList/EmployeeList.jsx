import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Tag, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmployees, verifyEmployee } from '../../api/employees';
import './EmployeeList.css'; // Import CSS

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const verifiedStatus = {
        'ASSISTANT_HR': 'ASSISTANT_HR',
        'MANAGER': 'MANAGER',
        'HR': 'HR'
      }[user.user.role];

      const data = await getEmployees(verifiedStatus);
      setEmployees(data);
    } catch (error) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [user.user.role]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleVerify = async (id) => {
    try {
      await verifyEmployee(id, user.user.role);
      message.success('Employee verified successfully');
      loadEmployees();
    } catch (error) {
      message.error('Failed to verify employee');
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
        <>
          {record.hrVerified && <Tag color="green">HR Approved</Tag>}
          {record.managerVerified && <Tag color="blue">Manager Verified</Tag>}
          {record.assistantHrVerified && <Tag color="orange">Assistant HR Verified</Tag>}
          {!record.assistantHrVerified && <Tag color="red">Pending</Tag>}
        </>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => navigate(`/employee/${record.id}`)}>View</Button>
          {((user.user.role === 'ASSISTANT_HR' && !record.assistantHrVerified) ||
            (user.user.role === 'MANAGER' && !record.managerVerified) ||
            (user.user.role === 'HR' && !record.hrVerified)) && (
            <Button type="primary" onClick={() => handleVerify(record.id)}>
              Verify
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="table-container">
      <Table
        columns={columns}
        dataSource={employees}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default EmployeeList;
