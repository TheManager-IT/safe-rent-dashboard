import React, { useState, useEffect } from 'react';
import Scrollbar from '../../components/scrollbar';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 

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
  MenuItem,
  Select,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
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

  // Recherche et filtrage
  const filteredCars = cars.filter(car =>
    car.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (brandFilter === '' || car.brand.toLowerCase().includes(brandFilter.toLowerCase()))
  );

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Voitures
        </Typography>
        <Link to="/addCar">
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
      <div className="search">
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
        <Select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          style={{ minWidth: 150 }}
        >
          <MenuItem value="">Toutes les marques</MenuItem>
          {Array.from(new Set(cars.map(car => car.brand))).map(brand => (
            <MenuItem key={brand} value={brand}>{brand}</MenuItem>
          ))}
        </Select>
      </div>
      <Card>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Imatriculation</TableCell>
                <TableCell className="table-header-cell">Marque</TableCell>
                <TableCell className="table-header-cell">Modele</TableCell>
                <TableCell className="table-header-cell">Prix de la location</TableCell>
                <TableCell className="table-header-cell">Kilometrage</TableCell>
               
                <TableCell className="table-header-cell">detail</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
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
                  
                  <TableCell>
                    <Link to={`/car/${car._id}`}>
                      <Button variant="contained" color="primary">
                        Détails
                      </Button>
                    </Link>
                  </TableCell>
                  
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
            count={filteredCars.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Card>
    </Container>
  );
};

export default Cars;
