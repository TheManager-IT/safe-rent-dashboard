import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/client')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleEdit = (id) => {
    // Logique de modification
  };

  const handleAddClient = () => {
    // Logic for adding a new client
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


  const filteredData = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nationalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <OutlinedInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher par nom, prénom, téléphone, email, CIN, adresse..."
        startAdornment={
          <InputAdornment position="start">
            <IconButton>
              {/* icône de recherche */}
            </IconButton>
          </InputAdornment>
        }
      />
        
      <div>  
       <Link to="/addClient">
          <Button variant="contained" color="primary" onClick={handleAddClient}>
            Ajouter
          </Button>
        </Link> 
      </div>  
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
              <TableCell>CIN</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client._id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.nationalID}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  <Link to={`/editClient/${client._id}`}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(client._id)}>
                      Modifier
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(client._id)}>
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

export default Clients