import axiosClient from './axiosClient';

export const userApi = {
  getDashboard: () => {
    return axiosClient.get('/user/dashboard');
  }
};