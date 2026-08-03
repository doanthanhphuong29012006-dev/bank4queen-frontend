import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Pages & Layouts
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Transfer from './pages/Transfer';
import TransactionHistory from './pages/TransactionHistory';
import Accounts from './pages/Accounts';
import Beneficiaries from './pages/Beneficiaries';

// Route bảo vệ
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />, // Thay thế placeholder bằng giao diện thực tế
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: <Dashboard /> 
      },
      {
        path: 'accounts',
        element: <Accounts />
      },
      {
        path: 'transfer',
        element: <Transfer />
      },
      {
        path: 'transactions',
        element: <TransactionHistory />
      },
      {
        path: 'beneficiaries',
        element: <Beneficiaries />
      }
    ],
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-600">404 - Không tìm thấy trang</div>
  }
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}