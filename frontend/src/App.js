import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import SettingsPage from './components/SettingsPage';
import Administration from './components/AdministrationPage';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import FooterPage from './components/FooterPage';
import UpdatePage from './components/UpdatePage';
import HomePage from './components/HomePage';
import PublicPage from './components/PublicPage';
import { ThemeContext } from './theme';

const NameApp = process.env.REACT_APP_NAME + " " + process.env.REACT_APP_VER;
const THEME_STORAGE_KEY = "docode-theme";

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="docode-app-shell min-h-screen lg:pl-64">
        <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          {children}
        </div>
        <FooterPage />
      </div>
    </>
  );
}

const routesMeta = {
  "/login": {
    title: `Connexion - ${NameApp}`,
    description: `Connectez-vous pour accéder à votre compte ${NameApp}.`,
  },
  "/settings": {
    title: `Paramètres - ${NameApp}`,
    description: "Bienvenue sur votre Paramètres.",
  },
  "/administration": {
    title: `Administration - ${NameApp}`,
    description: `Gérez les utilisateurs et les paramètres administratifs de ${NameApp}.`,
  },
  "/updates": {
    title: `Mises à jour - ${NameApp}`,
    description: `Consultez l'historique des mises à jour de ${NameApp}.`,
  },
  "/": {
    title: `${NameApp}`,
    description: "Bienvenue sur DoCode.",
  },
};

function MetaUpdater() {
  const location = useLocation();
  const meta = routesMeta[location.pathname] || {
    title: `${NameApp}`,
    description: "Bienvenue sur DoCode.",
  };

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
    </Helmet>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const themeValue = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark")),
  }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <Router>
        <MetaUpdater />
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path="/p/:slug"
            element={
              <AppLayout>
                <PublicPage />
              </AppLayout>
            }
          />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/administration"
            element={
              <ProtectedAdminRoute>
                <AppLayout>
                  <Administration />
                </AppLayout>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/updates"
            element={
              <AppLayout>
                <UpdatePage />
              </AppLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}
