import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { store } from './store';
import Layout from './components/Layout';
import Inscription from './components/auth/Inscription';
import PatientRegistration from './components/auth/PatientRegistration';
import DoctorRegistration from './components/auth/DoctorRegistration';
import TableauDeBord from './components/TableauDeBord';
import AppointmentRequests from './components/AppointmentRequests';
import Agenda from './components/Agenda';
import Annonces from './components/Annonces';
import Parameters from './components/Parameters';
import Messagerie from './components/Messagerie';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/inscription" replace />;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Navigate to="/tableau-de-bord" replace /> : children;
};

export default function App() {
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes - only accessible when not authenticated */}
          <Route
            path="/inscription"
            element={
              <PublicRoute>
                <Inscription />
              </PublicRoute>
            }
          />
          <Route
            path="/inscription/patient"
            element={
              <PublicRoute>
                <PatientRegistration />
              </PublicRoute>
            }
          />
          <Route
            path="/inscription/medecin"
            element={
              <PublicRoute>
                <DoctorRegistration />
              </PublicRoute>
            }
          />

          {/* Protected routes with Layout - only accessible when authenticated */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TableauDeBord />} />
            <Route path="tableau-de-bord" element={<TableauDeBord />} />
            <Route path="demandes-rdv" element={<AppointmentRequests />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="annonces" element={<Annonces />} />
            <Route path="messagerie" element={<Messagerie />} />
            <Route path="parametres" element={<Parameters />} />
          </Route>

          {/* Catch all route - redirects to inscription or dashboard based on auth status */}
          <Route
            path="*"
            element={
              <Navigate
                to={localStorage.getItem('isAuthenticated') === 'true' ? '/tableau-de-bord' : '/inscription'}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}
