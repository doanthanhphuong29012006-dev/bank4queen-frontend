import axiosClient from './axiosClient';

export const beneficiaryApi = {
  getAll: () => axiosClient.get('/beneficiary'),
  add: (data) => axiosClient.post('/beneficiary', data)
};