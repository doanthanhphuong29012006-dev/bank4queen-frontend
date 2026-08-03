import { Link } from 'react-router-dom';
import { Shield, Zap, Smartphone } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 tracking-tighter">Bank4Queen</div>
        <div className="space-x-4">
          <Link to="/auth/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Đăng nhập</Link>
          <Link to="/auth/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md">
            Mở tài khoản
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Ngân hàng số <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">Thế hệ mới</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Trải nghiệm dịch vụ tài chính mượt mà, an toàn và hoàn toàn miễn phí. Chuyển tiền trong chớp mắt, quản lý tài sản thông minh ngay trên mọi thiết bị.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/auth/register" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
            Bắt đầu ngay
          </Link>
          <Link to="/auth/login" className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-sm">
            Trải nghiệm Dashboard
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Chuyển tiền siêu tốc</h3>
            <p className="text-gray-600">Giao dịch nội bộ hoàn tất chỉ trong vòng 1 giây với công nghệ Real-time Notification.</p>
          </div>
          <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 -rotate-3">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Bảo mật đa lớp</h3>
            <p className="text-gray-600">Mọi giao dịch đều được bảo vệ nghiêm ngặt bằng mã OTP xác thực qua Email cá nhân.</p>
          </div>
          <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
              <Smartphone size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quản lý thông minh</h3>
            <p className="text-gray-600">Lưu trữ danh bạ thụ hưởng, tra cứu biến động số dư và biểu đồ tài sản trực quan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}