import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Inscription from './components/auth/Inscription';
import PatientRegistration from './components/auth/PatientRegistration';
import Agenda from './components/Agenda';
import Announcements from './components/Annonces';
import Parameters from './components/Parameters';
import Layout from './components/Layout';
import TableauDeBord from './components/TableauDeBord';
import AppointmentRequests from './components/AppointmentRequests';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const isAuthInLocalStorage = localStorage.getItem('isAuthenticated') === 'true';
  const isAuth = isAuthenticated || isAuthInLocalStorage;
  return isAuth ? children : <Navigate to="/inscription" />;
};

// Public Route component (redirects to agenda if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const isAuthInLocalStorage = localStorage.getItem('isAuthenticated') === 'true';
  const isAuth = isAuthenticated || isAuthInLocalStorage;
  return !isAuth ? children : <Navigate to="/agenda" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/inscription" element={
        <PublicRoute>
          <Inscription />
        </PublicRoute>
      } />
      <Route path="/inscription/patient" element={
        <PublicRoute>
          <PatientRegistration />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/agenda" replace />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="annonces" element={<Announcements />} />
        <Route path="parametres" element={<Parameters />} />
        <Route path="tableau-de-bord" element={<TableauDeBord />} />
        <Route path="demandes-rdv" element={<AppointmentRequests />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 