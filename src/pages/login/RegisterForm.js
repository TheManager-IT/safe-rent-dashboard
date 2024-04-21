import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Requête POST pour créer un nouveau compte
      const response = await axios.post('http://localhost:3000/v1/api/user/register', {
        
        email: email,
        password: password
      });

      console.log('Registration successful:', response.data);
      navigate('/login'); // Redirection vers la page de connexion après l'inscription
    } catch (error) {
      setError('Échec de linscription. Veuillez vérifier les informations fournies et réessayer.');
      console.error('Erreur dinscription:', error);
    }
  };

  // Formulaire JSX
  return (
    <form onSubmit={handleRegister}>
    
      <div>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        
        />
      </div>
      <div>
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          
        />
      </div>
      <button type="submit">S'inscrire</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default RegisterForm;
