import React, { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Ajout de la déclaration de confirmDeleteId


  useEffect(() => {
    // Récupérer les données des voitures depuis l'API backend
    fetch('http://localhost:3000/v1/api/voiture')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  const handleEdit = (id) => {
    // Logique pour l'édition d'une voiture
    console.log('Edit car with id:', id);
  };

  const handleDelete = (id) => {
    // Demander une confirmation avant la suppression
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/voiture/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          // Mettre à jour la liste des voitures après la suppression
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

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleAddCar}>
          Ajouter
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>registrationPlate</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>location Price</TableCell>
              <TableCell>modifier</TableCell>
              <TableCell>supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car) => (
              <TableRow key={car._id}>
                <TableCell>{car._id}</TableCell>
                <TableCell>{car.registrationPlate}</TableCell>
                <TableCell>{car.brand}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.locationPrice}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(car._id)} variant="contained" color="primary">
                    Modifier
                  </Button>
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
