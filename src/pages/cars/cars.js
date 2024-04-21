import React, { useState, useEffect } from 'react';

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
Typography,OutlinedInput,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);

  useEffect(() => {
    // Récupérer les données des voitures depuis l'API backend
    fetch('http://localhost:3000/v1/api/voiture')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  const handleEdit = (id) => {
    setSelectedCarId(id);
    console.log('Edit car with id:', id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/voiture/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setCars(prevCars => prevCars.filter(car => car._id !== id));
        } else {
          throw new Error('Failed to delete car');
        }
      })
      .catch(error => console.error('Error deleting car:', error));
    }
  };

  const handleAddCar = () => {
   
  };

  //recherche
  const filteredCars = cars.filter(car =>
    car.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
     <Typography variant="h4" sx={{ mb: 2 }}>
       Voitures
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <OutlinedInput
            type="text"
            placeholder="Rechercher par matricule ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Link to="/addCar">
            <Button variant="contained" color="primary" onClick={handleAddCar}>
              Ajouter
            </Button>
          </Link>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              
              <TableCell>Registration Plate</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Location Price</TableCell>
              <TableCell>kilometrage</TableCell>
              <TableCell>img</TableCell>
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCars.map((car) => (
              <TableRow key={car._id}>
                
                <TableCell>{car.registrationPlate}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.locationPrice}</TableCell>
                <TableCell>{car.traveled.mileage} - {car.traveled.updatedAt}</TableCell>
                <TableCell>{car.images}</TableCell>
              

                <TableCell>
                  <Link to={`/editCar/${car._id}`}>
                    <Button onClick={() => handleEdit(car._id)} variant="contained" color="primary">
                      Modifier
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(car._id)} variant="contained" color="secondary">
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Cars;
