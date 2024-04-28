// Import des composants nécessaires
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const ClientDetail = () => {
  const [client, setClient] = useState(null);
  const { id } = useParams(); // Récupérer l'ID du client depuis les paramètres d'URL

  useEffect(() => {
    // Récupérer les détails du client depuis l'API backend
    fetch(`http://localhost:3000/v1/api/client/get/${id}`)
      .then(response => response.json())
      .then(data => setClient(data))
      .catch(error => console.error('Error fetching client details:', error));
  }, [id]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Détails du client
      </Typography>
      <div>
        <Typography>Nom: {client.name}</Typography>
        <Typography>Prénom: {client.firstName}</Typography>
        <Typography>Email: {client.email}</Typography>
        <Typography>Numéro de Téléphone: {client.phoneNumber}</Typography>
        <Typography>CIN: {client.nationalID}</Typography>
        <Typography>Adresse: {client.address}</Typography>
        {/* Affichez d'autres détails du client ici */}
      </div>
    </Container>
  );
};

export default ClientDetail;
