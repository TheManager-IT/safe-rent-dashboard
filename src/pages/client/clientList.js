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
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/client')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleEdit = (id) => {
    setSelectedClientId(id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/client/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setClients(prevClients => prevClients.filter(client => client._id !== id));
        } else {
          throw new Error('Failed to delete client');
        }
      })
      .catch(error => console.error('Error deleting client:', error));
    }
  };

  const handleAddClient = () => {
    // Logic for adding a new client
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <Link to="/addClient">
        <Button variant="contained" color="primary" onClick={handleAddClient}>
          Ajouter
        </Button>
      </Link>  
      </div>
     
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Numéro de Téléphone</TableCell>
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client._id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>
                <Link to="/editClient">
                  <Button onClick={() => handleEdit(client._id)} variant="contained" color="primary">
                    Modifier
                  </Button>
                </Link>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(client._id)} variant="contained" color="secondary">
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
export default Clients;
