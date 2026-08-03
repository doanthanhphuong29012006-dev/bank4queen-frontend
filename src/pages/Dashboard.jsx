import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userApi.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!dashboardData) return null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Xin chào, {dashboardData.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Khối Thông tin tài khoản */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Tổng quan tài khoản</h2>
          {dashboardData.accounts && dashboardData.accounts.length > 0 ? (
            dashboardData.accounts.map((acc) => (
              <div key={acc.id} className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Số tài khoản ({acc.type})</p>
                <p className="text-lg font-bold text-blue-700">{acc.accountNumber}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Số dư khả dụng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Number(acc.balance).toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có tài khoản thanh toán nào được liên kết.</p>
          )}
        </div>

        {/* Khối Tiện ích */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/transfer')}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              Chuyển tiền
            </button>

            <button
              onClick={() => toast.info('Tính năng nạp tiền đang được hệ thống phát triển!')}
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
            >
              Nạp tiền
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}