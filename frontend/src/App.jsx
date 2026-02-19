import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPlaceholder />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ForgotPasswordPlaceholder() {
  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <p className="text-gray-400 mb-6">
          Password reset is not implemented in this demo. Please contact support.
        </p>
        <a href="/login" className="text-netflix-red hover:underline">
          Back to Sign In
        </a>
      </div>
    </div>
  );
}
