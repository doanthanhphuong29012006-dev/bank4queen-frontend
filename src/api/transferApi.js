import axiosClient from './axiosClient';

export const transferApi = {
  // Gọi route /request-otp để nhận email OTP
  requestOtp: () => {
    return axiosClient.post('/transfer/request-otp');
  },
  
  // Gọi route /internal kèm body chứa data và otpCode
  executeTransfer: (data) => {
    return axiosClient.post('/transfer/internal', data);
  }
};