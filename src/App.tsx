import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserList } from './pages/UserList';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
