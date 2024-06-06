// loginForm.js
import React, { useState, useContext } from 'react';
import { Container, Typography, TextField, Button, Card, CardContent, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import myImage from '../../images/Car rental.gif';
import './login.css'; 
import AlternateEmailSharpIcon from '@mui/icons-material/AlternateEmailSharp';
import HttpsRoundedIcon from '@mui/icons-material/HttpsRounded';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //Envoi de la requête de connexion 
            //Le corps de la requête contient l'email et le mot de passe de l'utilisateur, sérialisés en une chaîne JSON.
            const response = await fetch('http://localhost:3000/v1/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        //Gestion de la réponse :
            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                return;
            }
            //Traitement de la connexion réussie :
            //Ce token est stocké dans le stockage local et est utilisé pour mettre à jour l'état d'authentification.
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
        <Container maxWidth="sm" className="container">
            <Card className="card">
                <CardContent className="card-content">
                    <img src={myImage} alt="Your Image" className="image" />
                    <div>
                        <Typography variant="h4" gutterBottom className="typography" sx={{ mb: 3, fontFamily: 'monospace' }}>
                        Bienvenu !
                        </Typography>
                        <Typography variant="h6" gutterBottom className="typography"  sx={{ mb: 3, fontFamily: 'monospace' }}>
                        veuillez vous connecter à votre compte
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={email}
                                placeholder=" Entrez votre adresse e-mail"
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                sx={{ mb: 4  }}
                                InputProps={{
                        startAdornment: (
                            <AlternateEmailSharpIcon  style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                        
                      
                    }}
                            />
                            <TextField
                                label="Mot de passe"
                                variant="outlined"
                                type="password"
                                value={password}
                                placeholder=" entrez votre mot de passe"
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                sx={{ mb: 3 }}
                                InputProps={{
                        startAdornment: (
                            <HttpsRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px'}} />
                        ),
                      
                    }}
                       
                            />
                            
                            {error && <Typography color="error">{error}</Typography>}
                            <CardActions className="card-actions">
                                <Button type="submit" variant="contained" className="buttonLogin" onClick={handleSubmit}
                                 sx={{
                                    fontWeight: 550 ,
                                  width:'180px',
                                  height:'40px',
                                backgroundColor: '#455a64',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#6c97bb', 
                                    variant:"outlined",
                                },
                                '&:active': {
                                    backgroundColor: '#90caf9', 
                                },
                            }}
                                >
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
