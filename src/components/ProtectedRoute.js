import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    message.warning('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.user.role)) {
    message.error('You are not authorized to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

