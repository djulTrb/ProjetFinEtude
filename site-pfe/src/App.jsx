import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { store } from './store';
import Layout from './components/Layout';
import Inscription from './components/auth/Inscription';
import PatientRegistration from './components/auth/PatientRegistration';
import DoctorRegistration from './components/auth/DoctorRegistration';
import AccountActivation from './components/auth/AccountActivation';
import TableauDeBord from './components/TableauDeBord';
import AppointmentRequests from './components/AppointmentRequests';
import Agenda from './components/Agenda';
import Annonces from './components/Annonces';
import Parameters from './components/Parameters';
import Messagerie from './components/Messagerie';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/inscription" />;
};

export default function App() {
  const { t } = useTranslation();

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/inscription/patient" element={<PatientRegistration />} />
          <Route path="/inscription/medecin" element={<DoctorRegistration />} />
          <Route path="/activation" element={<AccountActivation />} />

          {/* Protected routes with Layout */}
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

          {/* Redirect root to dashboard or inscription */}
          <Route
            path="*"
            element={
              <Navigate
                to={localStorage.getItem('isAuthenticated') === 'true' ? '/tableau-de-bord' : '/inscription'}
              />
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}
