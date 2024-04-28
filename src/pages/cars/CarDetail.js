import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; 
    fetch(`http://localhost:3000/v1/api/voiture/get/${id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car details:', error));
  }, [id]);

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Détails de la voiture
      </Typography>
      <div>
        <Typography>Immatriculation: {car.registrationPlate}</Typography>
        <Typography>Marque: {car.brand}</Typography>
        <Typography>Modèle: {car.model}</Typography>
        <Typography>Prix de la location: {car.locationPrice}</Typography>
        <img src={`http://localhost:3001/${car.images}`} alt="Car Image" />
        <Typography>Kilométrage: {car.traveled.mileage}</Typography>
       
      </div>
    </Container>
  );
};

export default CarDetail;
