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
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);

  useEffect(() => {
    // Récupérer les données des locations depuis l'API backend
    fetch('http://localhost:3000/v1/api/location')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    const fetchClientDetails = async () => {
      const details = await getClientDetails(locations.client);
      setClientDetails(details);
    };

    if (locations.client) {
      fetchClientDetails();
    }
  }, [locations.client]);

  const getClientDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/v1/api/client/get/${id}`);
      const clientData = await response.json();
      return clientData;
    } catch (error) {
      console.error('Error fetching client details:', error);
      return null;
    }
  };

  const handleAddLocation = () => {
    //  location
  };

 
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette location ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/location/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setLocations(prevLocations => prevLocations.filter(location => location._id !== id));
        } else {
          throw new Error('Failed to delete location');
        }
      })
      .catch(error => console.error('Error deleting location:', error));
    }
  };

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
        <div>
          <Link to="/addlocationform">
            <Button variant="contained" color="primary" onClick={handleAddLocation}>
              Ajouter
            </Button>
          </Link>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date de début</TableCell>
              <TableCell>Date de fin</TableCell>
              <TableCell>Voiture</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location._id}>
                <TableCell>{location.StartDateLocation}</TableCell>
                <TableCell>{location.EndDateLocation}</TableCell>
                <TableCell>{location.voiture}</TableCell>
                <TableCell>
                {location.client}
                  {clientDetails ? `${clientDetails.name} ${clientDetails.firstName}` : 'Client introuvable'}
                </TableCell>
                <TableCell>{location.totalPrice}</TableCell>
                <TableCell>
                  <Link to={`/editlocation/${location._id}`}>
                    <Button variant="contained" color="primary">
                      Modifier
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(location._id)} variant="contained" color="secondary">
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
