import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => {
    // credentials chứa { email, password }
    return axiosClient.post('/auth/login', credentials);
  },
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },
};