import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import './CarDetail.css'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TroubleshootSharpIcon from '@mui/icons-material/TroubleshootSharp';
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

  const handleDelete = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      return;
    }
    // Logique de suppression ici
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 , mt:13}}>
       {car.model}
      </Typography>
      <div className="car-details-container">
        <Typography> <b> Immatriculation:</b> {car.registrationPlate}</Typography>
        <Typography> <b> Marque:</b> {car.brand}</Typography>
        <Typography> <b> Modèle:</b> {car.model}</Typography>
        <Typography> <b>Prix de la location par jour: </b>  {car.locationPrice}</Typography>
        <img src={`http://localhost:3000/uploads/${car.images}`} alt="Car Image" />
        <Typography> <b> Kilométrage:</b>  {car.traveled.mileage}</Typography>
        <Typography> <b> Statut:</b>  {car.status}</Typography>

       
        <div className="button-group">
          <Button variant="contained" component={Link} to={`/editCar/${car.id}`} startIcon={<EditIcon />} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} startIcon={<DeleteIcon />}>
            Supprimer
          </Button>
          <Button variant="contained" color="info" startIcon={<TroubleshootSharpIcon  />}>
            Diagnostic
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CarDetail;
