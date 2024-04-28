// Importez les composants nécessaires
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from '../../components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  OutlinedInput,
  Card,
  TablePagination,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
} from '@mui/material';

// Créez un composant pour la page de détail de la voiture
const CarDetail = ({ match }) => {
  // Utilisez l'ID de la voiture dans l'URL pour récupérer les détails de la voiture
  const [car, setCar] = useState(null);

  useEffect(() => {
    // Récupérer les détails de la voiture depuis l'API backend
    fetch(`http://localhost:3000/v1/api/voiture/${match.params.id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car details:', error));
  }, [match.params.id]);

  // Vérifiez si les détails de la voiture sont chargés
  if (!car) {
    return <div>Loading...</div>;
  }

  // Affichez les détails de la voiture
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
        <Typography>Kilométrage: {car.traveled.mileage}</Typography>
        {/* Affichez d'autres détails de la voiture ici */}
      </div>
    </Container>
  );
};