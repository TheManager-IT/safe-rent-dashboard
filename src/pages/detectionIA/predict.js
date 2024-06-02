import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button } from '@mui/material';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import { Link } from 'react-router-dom';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            setError('Veuillez sélectionner un fichier à télécharger');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/predict', formData, {
                responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(response.data);
            setResultImage(imageUrl);
            setError('');
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier :', error);
            setError('Erreur lors du téléchargement du fichier. Veuillez réessayer.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: '40px' }}>
            <Typography variant="h4" sx={{ mb: 2 }} align="center">
                Détection de  l’état de voiture
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6, marginRight: '10px' }} />
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    variant="contained"
                    type="submit"
                    sx={{
                              
                                backgroundColor: ' rgb(108,151,187)',
                                color: 'white',
                                marginLeft: '10px'
                        ,marginTop:'20px',
                                '&:hover': {
                                    backgroundColor: ' rgb(108,151,187)',
                                // variant:"outlined",
                                },
                                '&:active': {
                                    backgroundColor: ' rgb(108,151,187)',
                                },
                                }}
                >
                    Télécharger et Prédire
                </Button>
                <Link to="/car">
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{marginLeft: '10px'
                        ,marginTop:'20px',
                                    
                                backgroundColor: '#C50000',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor:  '#C50000',
                                // variant:"outlined",
                                },
                                '&:active': {
                                    backgroundColor:  '#C50000',
                                },
                             
                                }}
                    >
                        Annuler
                    </Button>
                </Link>
            </form>
            {resultImage && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Typography variant="h5" align="center">
                        Résultat
                    </Typography>
                    <img src={resultImage} alt="Voiture Extraite" style={{ display: 'block', margin: 'auto', marginTop: '10px' }} />
                </div>
            )}
        </Container>
    );
}

export default App;
