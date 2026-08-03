import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: 'bank4queen-backend-production.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Phân tích mã lỗi HTTP
    if (error.response && error.response.status === 401) {
      // 1. Giải phóng phiên đăng nhập cục bộ
      localStorage.removeItem('accessToken');

      // 2. Kích hoạt thông báo UI
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', {
        toastId: 'unauthorized_error', // Thuộc tính chống nhân bản thông báo khi có nhiều API cùng lỗi đồng thời
      });

      // 3. Thực thi điều hướng
      // Do tệp này tồn tại độc lập ngoài React Context, phương thức điều hướng chuẩn là thao tác trực tiếp với window.location
      if (window.location.pathname !== '/auth/login') {
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 1500); // Độ trễ 1.5s đảm bảo người dùng tiếp nhận được thông báo trước khi chuyển trang
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;