import axiosClient from './axiosClient';

export const transactionApi = {
  getHistory: () => {
    return axiosClient.get('/transaction/history');
  }
};