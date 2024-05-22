// loginForm.js
import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/v1/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            login(data.token);  // Mettez à jour l'état d'authentification
            navigate('/');  // Redirigez vers le tableau de bord
        } catch (error) {
            console.error('Erreur de connexion :', error);
            setError('Erreur de connexion, veuillez réessayer.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mb: 2 }}>
                Connexion
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Mot de passe"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary">
                    Se connecter
                </Button>
            </form>
        </Container>
    );
};

export default LoginForm;
