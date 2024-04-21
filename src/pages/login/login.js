import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate pour la navigation

// Composant LoginForm
const LoginForm = () => {
  const [email, setEmail] = useState('');          // État pour stocker l'email entré par l'utilisateur
  const [password, setPassword] = useState('');    // État pour stocker le mot de passe entré par l'utilisateur
  const [error, setError] = useState('');          // État pour gérer les messages d'erreur
  const navigate = useNavigate();                  // Hook pour naviguer vers d'autres routes

  // Fonction appelée lors de la soumission du formulaire
  const handleLogin = async (e) => {
    e.preventDefault();                            // Empêcher le comportement par défaut du formulaire
    try {
      // Requête POST pour se connecter
      const response = await axios.post('http://localhost:3000/v1/api/user/login', {
        email: email,
        password: password
      });

      console.log('Login successful:', response.data); // Log en cas de succès
      navigate('/client');                            // Redirection vers la page client
    } catch (error) {
      setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
      console.error('Erreur de connexion:', error);
    }
  };
  console.log({ email, password });


  // JSX pour le formulaire de connexion
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Connexion</button>
      {error && <p>{error}</p>}  
    </form>
  );
};

export default LoginForm;
