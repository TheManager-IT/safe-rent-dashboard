import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddClientForm from '../client/addClientForm'; 
import EditClientForm from '../client/editClient'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  Popover,
  Stack,
  Card,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
  TablePagination,
} from '@mui/material';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null); // Déclarez la variable d'état menuAnchorEl
  const [currentClientId, setCurrentClientId] = useState(null); 
  const [addClientOpen, setAddClientOpen] = useState(false); 
  const [editClientOpen, setEditClientOpen] = useState(false); 

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/client')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleEdit = (id) => {
    // Logique de modification
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
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleAddClient = () => {
    setAddClientOpen(true); // Ouvrir le pop-up du formulaire  add client
  };

  const handleEditClient = (id) => {
    setCurrentClientId(id); // Stocker l'ID du client actuel
    setEditClientOpen(true); // Ouvrir le pop-up du formulaire edit client
  };
  


  return (
    <Container className="blue-container">
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Clients
        </Typography>
        <Button variant="contained" style={{ backgroundColor: 'rgb(33, 43, 54)', color: 'white', padding: '6px 16px' }} startIcon={<AddIcon />} onClick={handleAddClient}>
          Ajouter client
        </Button>
      </Stack>

      <div className="search">
        <OutlinedInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher client..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>

      <Card className="card">
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Nom</TableCell>
                <TableCell className="table-header-cell">Prénom</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Numéro de Téléphone</TableCell>
                <TableCell className="table-header-cell">CIN</TableCell>
                <TableCell className="table-header-cell">Adresse</TableCell>
                <TableCell className="table-header-cell">Detail</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
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
                    <Link to={`/client/${client._id}`}>
                      <Button variant="contained" color="primary">
                        Détails
                      </Button>
                    </Link>
                   
                  </TableCell>
                  <TableCell>
                  {/* component={Link} to={`/editClient/${client._id}`}  */}
                    <IconButton color="primary" component={Link} to={`/editClient/${client._id}`}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(client._id)}  style={{ color: '#C50000' }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      </Card>

      {/* Popover pour l'ajout d'un client */}
      <Popover
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <AddClientForm onSuccess={() => setAddClientOpen(false)} />
      </Popover>

      {/* Popover pour l'edit d'un client */}
      <Popover
        open={editClientOpen}
        onClose={() => setEditClientOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <EditClientForm 
          clientId={currentClientId} 
          onSuccess={() => setEditClientOpen(false)} 
        />
      </Popover>

    </Container>
  );
};

export default Clients;
