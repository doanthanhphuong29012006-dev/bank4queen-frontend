import { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import { CreditCard } from 'lucide-react';

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await userApi.getDashboard();
        setAccounts(res.data.accounts || []);
      } catch (err) {
        console.error('Lỗi tải tài khoản:', err);
        setError('Không thể tải danh sách tài khoản.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang đồng bộ dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách tài khoản</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.length === 0 ? (
          <p className="text-gray-500">Chưa có tài khoản nào được liên kết.</p>
        ) : (
          accounts.map((acc) => (
            <div 
              key={acc.id} 
              className="bg-linear-to-r from-blue-700 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transition-transform hover:-translate-y-1"
            >
              {/* Icon trang trí mờ ở góc */}
              <div className="absolute -top-4 -right-4 p-4 opacity-10">
                <CreditCard size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                    Tài khoản {acc.type || 'PAYMENT'}
                  </p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${acc.status === 'ACTIVE' ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'}`}>
                    {acc.status || 'ACTIVE'}
                  </span>
                </div>
                
                <p className="text-2xl font-mono tracking-[0.2em] mb-8">
                  {acc.accountNumber}
                </p>
                
                <div>
                  <p className="text-blue-200 text-xs uppercase mb-1">Số dư khả dụng</p>
                  <p className="text-2xl font-bold">
                    {Number(acc.balance).toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}