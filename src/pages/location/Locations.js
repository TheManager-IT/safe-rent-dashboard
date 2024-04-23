import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Scrollbar from '../../components/scrollbar';
import { Button, Container, InputAdornment,Typography, OutlinedInput,  Stack,
  Card, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientDetails, setClientDetails] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Récupérer les données des locations depuis l'API backend
    fetch('http://localhost:3000/v1/api/location')
      .then(response => response.json())
      .then(data => setLocations(data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (locations[page]) {
        const details = await getClientDetails(locations[page].client);
        setClientDetails(details);
      }
    };

    fetchClientDetails();
  }, [locations, page]);

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
     
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} >

        <Typography variant="h4" sx={{ mb: 2 }}>
          Locations
        </Typography>
            <Link to="/addlocationform">
              <Button variant="contained" style={{ backgroundColor: '#222831', color: 'white' }} startIcon={<AddIcon />} onClick={handleAddLocation}>
                Ajouter location
              </Button>
            </Link>
      </Stack>


        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
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
         
        </div>
        
<Card>
        <Scrollbar>
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
              {(rowsPerPage > 0
                ? locations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : locations
              ).map((location) => (
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
                    <Link to={`/editlocationform/${location._id}`}>
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
      </Scrollbar>
      </Card>
    </Container>
  );
};

export default Locations;
