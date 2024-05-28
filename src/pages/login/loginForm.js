// loginForm.js
import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import myImage from '../../images/logo/safe.jpg';

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
        <Container maxWidth="sm"  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <Card>
                <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                <img src={myImage} alt="Your Image" style={{ marginRight: '20px', width: '100px', height: 'auto' }} />
                    <div>
            <Typography variant="h4"  gutterBottom align="center">
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
                {/*<Button type="submit" variant="contained" color="primary">
                    Se connecter
    </Button>*/}
   <CardActions>
                    <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                        Se connecter
                    </Button>
                </CardActions>
            </form>
            </div>
            </CardContent>
                
            </Card>
        </Container>
    );
};

export default LoginForm;
