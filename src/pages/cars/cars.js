import React, { useState, useEffect } from 'react';
import Scrollbar from '../../components/scrollbar';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

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
  Typography,
  OutlinedInput,
  Card,
  TablePagination,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Récupérer les données des voitures depuis l'API backend
    fetch('http://localhost:3000/v1/api/voiture')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  const handleEdit = (id) => {
    console.log('Edit car with id:', id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/voiture/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setCars(prevCars => prevCars.filter(car => car._id !== id));
        } else {
          throw new Error('Failed to delete car');
        }
      })
      .catch(error => console.error('Error deleting car:', error));
    }
  };

  const handleAddCar = () => {
    // Logique pour ajouter une nouvelle voiture
  };

  // Recherche
  const filteredCars = cars.filter(car =>
    car.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
     
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Voitures
          </Typography>
          <Link to="/addCar" >
          <Button
  variant="contained"
  style={{ backgroundColor: '#222831', color: 'white' }}
  startIcon={<AddIcon />}
  onClick={handleAddCar}
>
  Ajouter voiture
</Button>

          </Link>
        </Stack>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <OutlinedInput
            type="text"
            placeholder="Rechercher voiture..."
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
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Registration Plate</TableCell>
                    <TableCell>Brand</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Location Price</TableCell>
                    <TableCell>Kilometrage</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Modifier</TableCell>
                    <TableCell>Supprimer</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredCars.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((car) => (
                    <TableRow key={car._id}>
                      <TableCell>{car.registrationPlate}</TableCell>
                      <TableCell>{car.brand}</TableCell>
                      <TableCell>{car.model}</TableCell>
                      <TableCell>{car.locationPrice}</TableCell>
                      <TableCell>{car.traveled.mileage} - {car.traveled.updatedAt}</TableCell>
                      <TableCell>{car.images}</TableCell>
                      <TableCell>
                        <Link to={`/editCar/${car._id}`}>
                          <Button onClick={() => handleEdit(car._id)} variant="contained" color="primary">
                            Modifier
                          </Button>
                        </Link>
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
           
          

          <TablePagination
            component="div"
            count={filteredCars.length} // nombre total de lignes
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0); // Réinitialiser la page à 0 lorsque le nombre de lignes par page change
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
           </TableContainer>
          </Scrollbar>
        </Card>
      
    </Container>
  );
};

export default Cars;
