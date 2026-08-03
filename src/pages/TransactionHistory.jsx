import { useState, useEffect } from 'react';
import { transactionApi } from '../api/transactionApi';
import { userApi } from '../api/userApi';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Tải thông tin tài khoản để xác định dòng tiền vào/ra
        const userRes = await userApi.getDashboard();
        if (userRes.data.accounts?.length > 0) {
          setCurrentAccount(userRes.data.accounts[0].accountNumber);
        }

        // Tải dữ liệu giao dịch
        const txRes = await transactionApi.getHistory();
        setTransactions(txRes.data.data || []);
      } catch (err) {
        console.error('Lỗi tải lịch sử:', err);
        setError('Không thể tải lịch sử giao dịch lúc này.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Đang đồng bộ dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lịch sử giao dịch</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Chưa có giao dịch nào được ghi nhận.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã GD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đối tác</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => {
                // Phân tích dòng tiền (Tiền ra hay Tiền vào)
                const isSender = tx.fromAccount.accountNumber === currentAccount;
                const sign = isSender ? '-' : '+';
                const color = isSender ? 'text-red-600' : 'text-green-600';
                const partnerAccount = isSender ? tx.toAccount.accountNumber : tx.fromAccount.accountNumber;

                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partnerAccount}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${color}`}>
                      {sign}{Number(tx.amount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {tx.content}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}