import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import AllCalendar from './components/Calendar';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard/>} />} />
          <Route path='/events' element={<ProtectedRoute element={<Events/>} />} />
          <Route path='/all' element={<ProtectedRoute element={<AllCalendar/>} />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </AuthProvider>
  </StrictMode>
);
