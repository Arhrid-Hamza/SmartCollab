import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsListPage } from './pages/StudentsListPage';
import { ProfessorsListPage } from './pages/ProfessorsListPage';
import { UserFormPage } from './pages/UserFormPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <StudentsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/professors"
            element={
              <ProtectedRoute>
                <ProfessorsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/edit/:id"
            element={
              <ProtectedRoute>
                <UserFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
