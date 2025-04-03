import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/employees',
});

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post('/', employeeData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-throw for component to handle
  }
};

export const getEmployees = async (verifiedStatus) => {
  try {
    let url = '/';
    if (verifiedStatus === 'unverified') {
      url = '/unverified'; // or whatever your backend endpoint is
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployee = async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const verifyEmployee = async (id, role) => {
    try {
      let endpoint;
      switch(role) {
        case 'ASSISTANT_HR':
          endpoint = `${id}/verify`;
          break;
        case 'MANAGER':
          endpoint = `${id}/manager-verify`;
          break;
        case 'HR':
          endpoint = `${id}/hr-verify`;
          break;
        default:
          throw new Error('Invalid verification role');
      }
      
      const response = await api.patch(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const updateEmployee = async (id, data) => {
  try {
    const response = await api.patch(`/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEmployeesForManager = async () => {
  try {
    const response = await api.get('/manager/pending');
    return response.data;
  } catch (error) {
    throw error;
  }

  
};


