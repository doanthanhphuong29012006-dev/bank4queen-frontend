import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, CreditCard, Send, History, Users, LogOut } from 'lucide-react';
import { io } from 'socket.io-client';
import { userApi } from '../api/userApi';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket tới máy chủ Backend
    const socket = io('http://localhost:5000', {
      withCredentials: true,
    });

    const initializeSocketConnection = async () => {
      try {
        // Lấy ID người dùng để join vào room tương ứng
        const response = await userApi.getDashboard();
        const userId = response.data.id;
        socket.emit('join_user_room', userId);
      } catch (error) {
        console.error('Lỗi khởi tạo WebSocket:', error);
      }
    };

    initializeSocketConnection();

    // Lắng nghe sự kiện notification từ Backend
    socket.on('notification', (data) => {
      setNotification(data);
      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Tài khoản', path: '/dashboard/accounts', icon: <CreditCard size={20} /> },
    { name: 'Chuyển tiền', path: '/dashboard/transfer', icon: <Send size={20} /> },
    { name: 'Lịch sử GD', path: '/dashboard/transactions', icon: <History size={20} /> },
    { name: 'Danh bạ', path: '/dashboard/beneficiaries', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Bank4Queen</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Khối hiển thị Thông báo (Toast Notification) */}
        {notification && (
          <div className="absolute top-6 right-6 bg-white border-l-4 border-green-500 shadow-xl p-4 rounded-md z-50 min-w-75 animate-fade-in">
            <h4 className="font-bold text-gray-800">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          </div>
        )}

        <div className="p-8 max-w-7xl mx-auto">
          {/* Component con sẽ được render tại đây */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}