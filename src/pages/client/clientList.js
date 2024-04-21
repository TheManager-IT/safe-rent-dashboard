import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Scrollbar from '../../components/scrollbar';

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
  Card,
  OutlinedInput,
  InputAdornment,
  IconButton,Typography,TablePagination,
} from '@mui/material';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);


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

/*
  const filteredData = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nationalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );*/
  const filteredData = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.nationalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  

  return (
    <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

     <Typography variant="h4" sx={{ mb: 2 }}>
        Clients
      </Typography>
      <Link to="/addClient">
          <Button variant="contained" color="primary" onClick={handleAddClient}>
            Ajouter
          </Button>
        </Link> 
        </Stack>

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
        
   
</div>

<Card>
        
<Scrollbar>
  
  <TableContainer sx={{ overflow: 'unset' }}>
  <Table sx={{ minWidth: 800 }}>
    <TableHead>
      <TableRow>
        
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


  <TablePagination
    component="div"
    count={clients.length} // total number of rows
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={(event, newPage) => setPage(newPage)}
    onRowsPerPageChange={(event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset page to 0 when rowsPerPage changes
    }}
    rowsPerPageOptions={[5, 10, 25]}
  />
</TableContainer>

</Scrollbar>
 
 </Card>
</Container>
  );
};

export default Clients