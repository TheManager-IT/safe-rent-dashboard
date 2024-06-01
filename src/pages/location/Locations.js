import React, { useState, useEffect } from 'react';
import Scrollbar from '../../components/scrollbar';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
 
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
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('fr-FR', options);
};

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Récupérer les données des locations depuis l'API backend
    fetch('http://localhost:3000/v1/api/location')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

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

  const filteredLocations = locations.filter(location => {
    const term = searchTerm.toLowerCase();
    return (
      (!term || 
      (location.voiture && location.voiture.registrationPlate.toLowerCase().includes(term)) ||
      (location.voiture && location.voiture.model && location.voiture.model.modelName.toLowerCase().includes(term)) ||
      (location.client && location.client.nationalID.toLowerCase().includes(term)) ||
      (location.client && location.client.name.toLowerCase().includes(term)) ||
      (location.client && location.client.firstName.toLowerCase().includes(term)) ||
      (formatDate(location.StartDateLocation).includes(term)) ||
      (formatDate(location.EndDateLocation).includes(term)))
    );
  });

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13} >
        <Typography variant="h4" sx={{ mb: 2 }}>
        Liste Des Locations
        </Typography>
        <Link to="/addlocationform">
          <Button variant="contained" style={{ backgroundColor: '#263238', color: 'white' }} startIcon={<AddIcon />} onClick={handleAddLocation}>
            Ajouter location
          </Button>
        </Link>
      </Stack>
      <div className="search" >
        <OutlinedInput
          type="text"
          placeholder="Rechercher location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div> 
      <Card>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Date de début</TableCell>
                <TableCell className="table-header-cell">Date de fin</TableCell>
                <TableCell className="table-header-cell">Heure de location</TableCell>
                <TableCell className="table-header-cell">Voiture</TableCell>
                <TableCell className="table-header-cell">Client</TableCell>
                <TableCell className="table-header-cell">Total Price</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredLocations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredLocations
              ).map((location) => (
                <TableRow key={location._id}>
                  <TableCell>{formatDate(location.StartDateLocation)}</TableCell>
                  <TableCell>{formatDate(location.EndDateLocation)}</TableCell>
                  <TableCell>{location.locationTime}</TableCell>
                  <TableCell>
                    {location.voiture ? `${location.voiture.registrationPlate} - ${location.voiture.model.modelName}` : 'N/A'}
                  </TableCell>

                  <TableCell>
                  {location.client ? `${location.client.nationalID} - ${location.client.name} ${location.client.firstName}` : 'N/A'}
                  </TableCell>

                  <TableCell>{location.totalPrice} DT </TableCell>
                  <TableCell>
                    <Link to={`/editlocationform/${location._id}`}>
                      <IconButton variant="contained" color="primary">
                      <EditIcon  style={{ color: 'rgba(12,192,70,1)' }} />                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(location._id)} variant="contained" color="secondary">
                    <DeleteIcon style={{ color: '#C50000' }}/>                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={locations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Container>
  );
};

export default Locations;
