import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import ProtectedRoute from './routes/ProtectedRoute';

// Guest pages
import HomePage from './pages/guest/HomePage';
import LoginPage from './pages/guest/LoginPage';
import RegisterPage from './pages/guest/RegisterPage';
import RoomsPage from './pages/guest/RoomsPage';
import RoomDetailPage from './pages/guest/RoomDetailPage';
import MyBookingsPage from './pages/guest/MyBookingsPage';
import ForgotPasswordPage from './pages/guest/ForgotPasswordPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Front Desk pages
import FrontDeskCheckIn from './pages/frontdesk/FrontDeskCheckIn';
import FrontDeskCheckOut from './pages/frontdesk/FrontDeskCheckOut';
import FrontDeskLookup from './pages/frontdesk/FrontDeskLookup';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* Public / Guest routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute allowedRoles={['GUEST']}>
              <MyBookingsPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminRoomsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminBookingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />

          {/* Front Desk routes */}
          <Route path="/frontdesk" element={
            <ProtectedRoute allowedRoles={['FRONT_DESK', 'ADMIN']}>
              <FrontDeskCheckIn />
            </ProtectedRoute>
          } />
          <Route path="/frontdesk/checkout" element={
            <ProtectedRoute allowedRoles={['FRONT_DESK', 'ADMIN']}>
              <FrontDeskCheckOut />
            </ProtectedRoute>
          } />
          <Route path="/frontdesk/lookup" element={
            <ProtectedRoute allowedRoles={['FRONT_DESK', 'ADMIN']}>
              <FrontDeskLookup />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
