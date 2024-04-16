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
import { Link } from 'react-router-dom';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Récupérer les données des locations depuis l'API backend
    fetch('http://localhost:3000/v1/api/location')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);


  const filteredLocations = locations.filter(location => {
    return true; // Fonction vide, retourne toujours true
  });
  

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <input
            type="text"
            placeholder="Rechercher par critères..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
             <TableCell>Voiture</TableCell>
              <TableCell>Client</TableCell> 
               <TableCell>Total Price</TableCell> 
              {/* <TableCell>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLocations.map((location) => (
              <TableRow key={location._id}>
                <TableCell>{location._id}</TableCell>
                <TableCell>{location.StartDateLocation}</TableCell>
                <TableCell>{location.EndDateLocation}</TableCell>
                <TableCell>{location.car && location.car.registrationPlate}</TableCell>
                 <TableCell>{location.client && location.client.name}</TableCell> 
                 <TableCell>{location.totalPrice}</TableCell> 
                 <TableCell>
                  <Link to={``}>
                    <Button variant="contained" color="primary">
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="contained" color="secondary">
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

export default Locations;
