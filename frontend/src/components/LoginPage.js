import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [surnom, setSurnom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
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
    <div className="flex items-center justify-center h-full">
      <div className="text-white p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Connexion</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-200">Surnom ou email</label>
            <input
              type="text"
              className="w-full px-3 py-2 border hover:border-sky-700 border-sky-600 bg-black rounded"
              value={surnom}
              onChange={(e) => setSurnom(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Mot de Passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border hover:border-sky-700 border-sky-600 bg-black rounded"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-sky-800 to-sky-700 bg-gradient-to-r from-sky-900 to-sky-950 text-white py-2 rounded font-bold">
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Accès réservé aux administrateurs DoCode.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
