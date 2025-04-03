import React, { useState } from 'react';
import { Tabs ,message} from 'antd';
import EmployeeForm from './employeeForm/EmployeeForm';
import EmployeeList from './employeeList/EmployeeList';

const { TabPane } = Tabs;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key state

  const handleEmployeeCreated = () => {
    setRefreshKey(prev => prev + 1); // Increment key to trigger refresh
    setActiveTab('view'); // Switch to view tab
    message.success('Employee created successfully!');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Create Employee" key="create">
          <EmployeeForm onSuccess={handleEmployeeCreated} />
        </TabPane>
        <TabPane tab="View Employees" key="view">
          <EmployeeList key={refreshKey} /> {/* Key forces remount */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

