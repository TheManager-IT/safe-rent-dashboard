import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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
                const errorMessage = await response.text(); // Récupérer le message d'erreur renvoyé par le serveur
                setError(errorMessage); // Afficher le message d'erreur
                return;
            }

            // Redirection vers la page d'accueil si l'authentification est réussie
            window.location.href = '/';
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
