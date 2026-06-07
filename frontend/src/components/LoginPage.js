import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../theme';

const LoginPage = () => {
  const [surnom, setSurnom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;

    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/login`, {
        surnom,
        motDePasse,
      });
      // Stocker le jeton dans le localStorage
      localStorage.setItem('token', response.data.token);

      navigate('/administration');
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="theme-surface w-full max-w-sm rounded-lg border p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="theme-text text-2xl font-bold">Connexion</h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-input rounded-md border px-3 py-2 text-xs font-semibold"
          >
            {theme === "dark" ? "Thème clair" : "Thème sombre"}
          </button>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="theme-muted block">Surnom ou email</label>
            <input
              type="text"
              className="theme-input w-full rounded border px-3 py-2 hover:border-sky-700"
              value={surnom}
              onChange={(e) => setSurnom(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="theme-muted block">Mot de Passe</label>
            <input
              type="password"
              className="theme-input w-full rounded border px-3 py-2 hover:border-sky-700"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-sky-800 to-sky-700 bg-gradient-to-r from-sky-900 to-sky-950 text-white py-2 rounded font-bold">
            Se connecter
          </button>
        </form>
        <p className="theme-subtle mt-4 text-center text-sm">
          Accès réservé aux administrateurs DoCode.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
