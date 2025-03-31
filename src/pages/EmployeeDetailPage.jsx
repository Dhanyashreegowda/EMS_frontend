import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Typography, Tag, message, Spin } from 'antd';
import { getEmployee } from '../api/employees';

const { Title, Text } = Typography;

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await getEmployee(id);
        console.log('Employee data:', data);
        setEmployee(data);
      } catch (err) {
        console.error('Error fetching employee:', err);
        setError(err);
        message.error('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <Spin size="large" />;
  if (error) return <Text type="danger">Error loading employee details</Text>;
  if (!employee) return <Text>Employee not found</Text>;

  return (
    <Card style={{ padding: '24px' }}>
      <Title level={2}>Employee Details</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Employee ID">{employee.empId}</Descriptions.Item>
        <Descriptions.Item label="Name">{employee.firstName} {employee.lastName}</Descriptions.Item>
        <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
        <Descriptions.Item label="Alternate Email">{employee.alternateEmail || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Mobile">{employee.mobile}</Descriptions.Item>
        <Descriptions.Item label="Alternate Mobile">{employee.alternateMobile || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Designation">{employee.designation}</Descriptions.Item>
        <Descriptions.Item label="Salary">{employee.salary}</Descriptions.Item>
        <Descriptions.Item label="Passport Number">{employee.passportNumber || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Aadhar Number">{employee.aadharNumber || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="PAN Number">{employee.panCardNumber || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Status">
          {employee.assistantHrVerified && <Tag color="green">Assistant HR Verified</Tag>}
          {employee.managerVerified && <Tag color="blue">Manager Verified</Tag>}
          {employee.hrVerified && <Tag color="purple">HR Approved</Tag>}
          {!employee.assistantHrVerified && <Tag color="orange">Pending Assistant HR</Tag>}
          {employee.assistantHrVerified && !employee.managerVerified && <Tag color="orange">Pending Manager</Tag>}
          {employee.managerVerified && !employee.hrVerified && <Tag color="orange">Pending HR</Tag>}
        </Descriptions.Item>

        {/* // Add to the Descriptions component */}
        <Descriptions.Item label="Passport File">
        {employee.passportFile ? (
          <a 
            href={employee.passportFile.startsWith('http') ? 
              employee.passportFile : 
              `http://localhost:3000${employee.passportFile}`
            } 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Document
          </a>
        ) : 'N/A'}
      </Descriptions.Item>

{/* Repeat same pattern for aadharFile and panFile */}

        <Descriptions.Item label="Aadhar Card">
          {employee.aadharFile ? (
            <a href={employee.aadharFile.startsWith('http') ? 
              employee.aadharFile : 
              `http://localhost:3000${employee.aadharFile}`} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          ) : 'N/A'}
        </Descriptions.Item>

        <Descriptions.Item label="PAN Card">
          {employee.panFile ? (
            <a href={employee.panFile.startsWith('http') ? 
              employee.panFile : 
              `http://localhost:3000${employee.panFile}`} target="_blank" rel="noopener noreferrer">
              View Document
            </a>
          ) : 'N/A'}
        </Descriptions.Item>
      </Descriptions>
      <Button 
        type="primary" 
        onClick={() => navigate(-1)} 
        style={{ marginTop: '16px' }}
      >
        Back to List
      </Button>
    </Card>
  );
};

export default EmployeeDetailPage;


