import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './middleware/ProtectedRoute';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import AllCalendar from './components/Calendar';
import NotFound from './pages/NotFound';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard/>} />} />
          <Route path='/events' element={<ProtectedRoute element={<Events/>} />} />
          <Route path='/all' element={<ProtectedRoute element={<AllCalendar/>} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  </StrictMode>
);
