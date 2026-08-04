import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setServerError('');
      
      // Gọi API login xuống Backend
      const response = await authApi.login(data);
      
      // Lưu token vào localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      
      // Chuyển hướng vào trang Dashboard
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
            Bank4Queen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Đăng nhập vào tài khoản của bạn
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Vui lòng nhập email' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="name@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                {...register('password', { required: 'Vui lòng nhập mật khẩu', minLength: { value: 6, message: 'Mật khẩu ít nhất 6 ký tự' } })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          {/* Hiển thị lỗi từ server (sai pass, tài khoản khóa...) */}
          {serverError && (
            <div className="bg-red-50 p-3 rounded-md">
              <p className="text-sm text-red-600 text-center">{serverError}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Chưa có tài khoản? <Link to="/auth/register" className="text-blue-600 font-medium hover:underline">Đăng ký</Link>
          </p>
        </form>
      </div>
    </div>
  );
}