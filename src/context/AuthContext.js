import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const decoded = jwtDecode(parsedUser.access_token);
        setUser({
          ...parsedUser,
          user: {
            ...decoded,
            id: decoded.sub
          }
        });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = (authData) => {
    const decoded = jwtDecode(authData.access_token);
    const userData = {
      access_token: authData.access_token,
      user: {
        ...authData.user,
        id: decoded.sub
      }
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    message.success('Login successful!');
    return userData.user.role; // Return role for redirection
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    message.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

