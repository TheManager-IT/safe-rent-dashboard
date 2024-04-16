import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const EditCarForm = () => {
  const [car, setCar] = useState({
    registrationPlate: '',
    model: '',
    brand: '',
    images: [],
    numberOfCarSeats: 0,
    traveled: [],
    locationPrice: 0,
    status: ''
  });
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar(prevCar => ({
      ...prevCar,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données modifiées de la voiture à l'API backend
    fetch(`http://localhost:3000/v1/api/voiture/update/${id}`, {
      method: 'PATCH', // Utilisation de la méthode PATCH
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    .then(response => {
      if (response.ok) {
        // Redirection vers la liste des voitures après modification
        window.location.href = '/car';
      } else {
        throw new Error('Failed to update car');
      }
    })
    .catch(error => console.error('Error updating car:', error));
  };

  return (
    <Container>
      <h2>Edit Car</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          name="registrationPlate"
          label="Registration Plate"
          value={car.registrationPlate || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="model"
          label="Model"
          value={car.model || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="brand"
          label="Brand"
          value={car.brand || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="numberOfCarSeats"
          label="Number of Car Seats"
          value={car.numberOfCarSeats || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <TextField
          name="locationPrice"
          label="Location Price"
          value={car.locationPrice || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="status"
          label="Status"
          value={car.status || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary">Save</Button>
      </form>
    </Container>
  );
};

export default EditCarForm;
