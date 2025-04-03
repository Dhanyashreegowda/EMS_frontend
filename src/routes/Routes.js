import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import {
  LoginPage,
  RegisterPage,
  AdminDashboard,
  AssistantHRDashboard,
  EmployeeDetailPage,
  ManagerDashboard,
  HRDashboard,
  EmployeeEditForm,
  UnauthorizedPage,
  HomePage,
  HRVerifiedEmployees // Make sure to import this component
} from '../pages';
import ProtectedRoute from '../components/ProtectedRoute';

const { Content } = Layout;

const AppRoutes = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/employee/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ASSISTANT_HR', 'MANAGER', 'HR']}>
                <EmployeeDetailPage />
            </ProtectedRoute>
          } />

          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/employee/:id/edit" element={
            <ProtectedRoute allowedRoles={['MANAGER']}>
              <EmployeeEditForm />
            </ProtectedRoute>
          } />
                    
          {/* Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/assistant-hr" element={
            <ProtectedRoute allowedRoles={['ASSISTANT_HR']}>
              <AssistantHRDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/hr" element={
            <ProtectedRoute allowedRoles={['HR']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          
          {/* Add this new route for verified employees */}
          <Route path="/hr/verified" element={
            <ProtectedRoute allowedRoles={['HR']}>
              <HRVerifiedEmployees />
            </ProtectedRoute>
          } />
        </Routes>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default AppRoutes;

