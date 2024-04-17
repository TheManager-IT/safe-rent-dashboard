import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { useHistory } from 'react-router-dom';

const AddLocationForm = () => {
  const [location, setLocation] = useState({
    StartDateLocation: '',
    EndDateLocation: '',
    NumberOfDays: 0,
    totalPrice: 0,
    locationTime: '',
    voiture: '',
    client: ''
  });

  const [errors, setErrors] = useState({
    StartDateLocation: '',
    EndDateLocation: '',
    NumberOfDays: '',
    totalPrice: '',
    locationTime: '',
    voiture: '',
    client: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Réinitialise les messages d'erreur pour le champ en cours de modification
    setErrors(prevState => ({
      ...prevState,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convertir la chaîne locationTime en objet Date
    const formattedLocation = {
      ...location,
      locationTime: new Date(`1970-01-01T${location.locationTime}`)
    };
  
    try {
      // Soumettre les données au backend
      const response = await fetch('http://localhost:3000/v1/api/location/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedLocation)
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      alert('location added successfully!');
      // Rediriger vers la page des locations après l'ajout réussi
      // history.push('/locations');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location: ' + error.message);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <h2>Ajouter une location</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          name="StartDateLocation"
          label="Date de début"
          type="date"
          value={location.StartDateLocation}
          onChange={handleChange}
          error={!!errors.StartDateLocation}
          helperText={errors.StartDateLocation}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="EndDateLocation"
          label="Date de fin"
          type="date"
          value={location.EndDateLocation}
          onChange={handleChange}
          error={!!errors.EndDateLocation}
          helperText={errors.EndDateLocation}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
       
        
        <TextField
          name="locationTime"
          label="Heure de la location"
          type="time"
          value={location.locationTime}
          onChange={handleChange}
          error={!!errors.locationTime}
          helperText={errors.locationTime}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="voiture"
          label="ID de la voiture"
          value={location.voiture}
          onChange={handleChange}
          error={!!errors.voiture}
          helperText={errors.voiture}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="client"
          label="ID du client"
          value={location.client}
          onChange={handleChange}
          error={!!errors.client}
          helperText={errors.client}
          fullWidth
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Ajouter la location
        </Button>
      </form>
    </Container>
  );
};

export default AddLocationForm;
