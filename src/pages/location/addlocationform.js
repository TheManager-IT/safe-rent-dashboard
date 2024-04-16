import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import { Button, Container, TextField } from '@mui/material';

const AddLocationForm = () => {
 // const history = useHistory();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [voitureId, setVoitureId] = useState('');
  const [clientId, setClientId] = useState('');
  const [locationTime, setLocationTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Construire l'objet location à envoyer à l'API
    const locationData = {
      startDate,
      endDate,
      numberOfDays: parseInt(numberOfDays),
      totalPrice: parseFloat(totalPrice),
      voiture: voitureId,
      client: clientId,
      locationTime: new Date(locationTime).toISOString()
    };

    try {
      // Envoyer les données à l'API backend (remplacer avec votre URL d'API)
      const response = await fetch('http://localhost:3000/v1/api/location/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });

      if (!response.ok) {
        throw new Error('Failed to add location');
      }

      // Rediriger vers la liste des localisations après ajout réussi
     // history.push('/locations');
    } catch (error) {
      console.error('Error adding location:', error);
      // Gérer l'erreur, par exemple, afficher un message d'erreur à l'utilisateur
    }
  };

  return (
    <Container>
      <h2>Ajouter une localisation</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Date de début"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <TextField
          label="Date de fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <TextField
          label="Nombre de jours"
          type="number"
          value={numberOfDays}
          onChange={(e) => setNumberOfDays(e.target.value)}
          required
        />
        {/*<TextField
          label="Prix total"
          type="number"
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
          required
  />*/}
        <TextField
          label="ID de la voiture"
          value={voitureId}
          onChange={(e) => setVoitureId(e.target.value)}
          required
        />
        <TextField
          label="ID du client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
        <TextField
          label="Date de la location" 
          type="datetime-local"
          value={locationTime} 
          onChange={(e) => setLocationTime(e.target.value)} 
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Ajouter la localisation
        </Button>
      </form>
    </Container>
  );
};

export default AddLocationForm;
