import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userApi } from '../api/userApi';
import { transferApi } from '../api/transferApi';
import { beneficiaryApi } from '../api/beneficiaryApi';
import { Users } from 'lucide-react';

export default function Transfer() {
  // Bổ sung setValue để lập trình viên có thể can thiệp thay đổi giá trị của form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  
  const [sourceAccount, setSourceAccount] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [transferData, setTransferData] = useState(null);

  // Tải dữ liệu tài khoản nguồn và danh bạ song song
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userRes, benRes] = await Promise.all([
          userApi.getDashboard(),
          beneficiaryApi.getAll()
        ]);
        
        if (userRes.data.accounts?.length > 0) {
          setSourceAccount(userRes.data.accounts[0]);
        }
        setBeneficiaries(benRes.data.data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu khởi tạo:', error);
      }
    };
    fetchInitialData();
  }, []);

  const onSubmitInfo = async (data) => {
    if (!sourceAccount) {
      setMessage({ type: 'error', text: 'Không tìm thấy tài khoản nguồn.' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      await transferApi.requestOtp();
      
      setTransferData({
        fromAccountId: sourceAccount.id,
        toAccountNumber: data.toAccountNumber,
        amount: Number(data.amount),
        content: data.content
      });
      
      setStep(2);
      setMessage({ type: 'success', text: 'Mã OTP đã được gửi đến email của bạn.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Lỗi gửi OTP.' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data) => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const payload = { ...transferData, otpCode: data.otpCode };
      await transferApi.executeTransfer(payload);
      
      setMessage({ type: 'success', text: 'Giao dịch chuyển tiền thành công!' });
      setStep(3);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Giao dịch thất bại.' });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý sự kiện khi người dùng chọn một liên hệ từ danh bạ
  const handleSelectBeneficiary = (accountNumber) => {
    setValue('toAccountNumber', accountNumber, { shouldValidate: true });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Khối Form Chuyển tiền chính (Chiếm 2/3 không gian) */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Chuyển tiền nội bộ</h1>
        
        {sourceAccount && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-gray-600">Tài khoản trích tiền</p>
            <p className="font-bold text-blue-800">{sourceAccount.accountNumber}</p>
            <p className="text-sm text-gray-600">Số dư: {Number(sourceAccount.balance).toLocaleString('vi-VN')} VND</p>
          </div>
        )}

        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Số tài khoản người nhận</label>
                <input
                  type="text"
                  {...register('toAccountNumber', { required: 'Vui lòng nhập số tài khoản' })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="Nhập hoặc chọn từ danh bạ bên cạnh"
                />
                {errors.toAccountNumber && <span className="text-red-500 text-sm">{errors.toAccountNumber.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Số tiền (VND)</label>
                <input
                  type="number"
                  {...register('amount', { 
                    required: 'Vui lòng nhập số tiền',
                    min: { value: 1000, message: 'Số tiền tối thiểu là 1,000 VND' }
                  })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung chuyển tiền</label>
                <textarea
                  {...register('content')}
                  rows="2"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || !sourceAccount}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmitOtp)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nhập mã OTP (gửi qua Email)</label>
                <input
                  type="text"
                  {...register('otpCode', { 
                    required: 'Vui lòng nhập mã OTP',
                    minLength: { value: 6, message: 'OTP gồm 6 chữ số' }
                  })}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest text-xl font-mono"
                  maxLength="6"
                />
                {errors.otpCode && <span className="text-red-500 text-sm">{errors.otpCode.message}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? 'Đang xác thực...' : 'Xác nhận chuyển tiền'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Quay lại
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <button onClick={() => { setStep(1); reset(); }} className="mt-4 text-blue-600 font-medium hover:underline">Thực hiện giao dịch khác</button>
            </div>
          )}
        </div>
      </div>

      {/* Khối Danh bạ chuyển nhanh (Chiếm 1/3 không gian) */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" /> Chọn nhanh
          </h2>
          {beneficiaries.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có liên hệ. Hãy thêm tại mục Danh bạ.</p>
          ) : (
            <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
              {beneficiaries.map(b => (
                <div 
                  key={b.id}
                  onClick={() => handleSelectBeneficiary(b.accountNumber)}
                  className="p-3 border border-gray-100 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
                >
                  <p className="font-bold text-gray-800 group-hover:text-blue-700">{b.nickname}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{b.accountNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}