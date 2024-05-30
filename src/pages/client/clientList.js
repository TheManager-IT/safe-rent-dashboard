import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AddClientForm from '../client/addClientForm'; 
import EditClientForm from '../client/editClient'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import axios from 'axios';

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
        try {
            await axios.delete(`http://localhost:3000/v1/api/client/delete/${id}`);
            setClients(prevClients => prevClients.filter(client => client._id !== id));
        } catch (error) {
            console.error('Error deleting client:', error);
            const errorMessage = error.response?.data?.error || 'Failed to delete client';
            alert(errorMessage);
        }
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
    setAddClientOpen(true); 
  };

  const handleEditClient = (id) => {
    setCurrentClientId(id); 
    setEditClientOpen(true);
  };
  


  return (
    <Container className="blue-container">
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Clients
        </Typography>
        <Link to="/addClient">
        <Button variant="contained" style={{ backgroundColor: 'rgb(33, 43, 54)', color: 'white', padding: '6px 16px' }} startIcon={<AddIcon />} onClick={handleAddClient}>
          Ajouter client
        </Button>
        </Link>
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

      <Card  style={{}}>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Nom</TableCell>
                <TableCell className="table-header-cell">Prénom</TableCell>
                <TableCell className="table-header-cell">Email</TableCell>
                <TableCell className="table-header-cell">Numéro de Téléphone</TableCell>
                <TableCell className="table-header-cell">CIN</TableCell>
                <TableCell className="table-header-cell">N° de permis de conduire</TableCell>
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
                  <TableCell>{client.drivingLicense}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <Link to={`/client/${client._id}`}>
                      <IconButton variant="contained" color="primary">
                      {/*<MoreHorizOutlinedIcon/>*/}
                      <DescriptionOutlinedIcon/>
                      </IconButton>
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
                      <DeleteIcon   />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={clients.length}            
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

    </Container>
  );
};

export default Clients;
