import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { beneficiaryApi } from '../api/beneficiaryApi';
import { Users, Plus } from 'lucide-react';

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. Khai báo hàm tải dữ liệu nằm gọn ngay bên trong useEffect
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await beneficiaryApi.getAll();
        setBeneficiaries(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []); // Cấu trúc này an toàn tuyệt đối 100% với mọi rule của ESLint

  // 2. Xử lý logic tải lại dữ liệu trực tiếp khi submit thành công
  const onSubmit = async (data) => {
    try {
      setMessage('');
      // Gửi request thêm danh bạ
      await beneficiaryApi.add(data);
      reset();
      
      // Tải lại danh sách mới nhất từ server và cập nhật state
      const res = await beneficiaryApi.getAll();
      setBeneficiaries(res.data.data || []);
      
      setMessage('Thêm danh bạ thành công!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi thêm danh bạ.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải danh bạ...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cột Thêm Danh bạ */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-blue-600" /> Thêm mới
          </h2>
          
          {message && (
            <div className={`p-3 mb-4 rounded text-sm ${message.includes('thành công') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên gợi nhớ</label>
              <input
                {...register('nickname', { required: 'Nhập tên gợi nhớ' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Mẹ, Bạn thân..."
              />
              {errors.nickname && <span className="text-red-500 text-xs">{errors.nickname.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Số tài khoản</label>
              <input
                {...register('accountNumber', { required: 'Nhập số tài khoản' })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.accountNumber && <span className="text-red-500 text-xs">{errors.accountNumber.message}</span>}
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Lưu danh bạ
            </button>
          </form>
        </div>
      </div>

      {/* Cột Danh sách */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Danh sách đã lưu
          </h2>
          {beneficiaries.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có liên hệ nào trong danh bạ.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beneficiaries.map((b) => (
                <div key={b.id} className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition bg-gray-50">
                  <p className="font-bold text-gray-800">{b.nickname}</p>
                  <p className="text-sm text-gray-500 mt-1 font-mono">{b.accountNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}