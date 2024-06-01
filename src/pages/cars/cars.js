import React, { useState, useEffect } from 'react';
import Scrollbar from '../../components/scrollbar';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 
import FilterListIcon from '@mui/icons-material/FilterList';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

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

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/voiture')
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error('Error fetching cars:', error));
  }, []);

  const handleEdit = (id) => {
    console.log('Edit car with id:', id);
  };

 /* const handleDelete = (id) => {
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
  };*/

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/v1/api/voiture/delete/${id}`);
        setCars(prevCars => prevCars.filter(car => car._id !== id));
        setError(''); // Clear any previous error
      } catch (error) {
        console.error('Error deleting car:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete car';
        alert(errorMessage);
      }
    }
  };

  const handleAddCar = () => {
    
  };

  // Recherche 
  const filteredCars = cars.filter(car =>{
    const searchTermLower = searchTerm.toLowerCase();
    return (
      car.registrationPlate.toLowerCase().includes(searchTermLower) ||
      car.model.modelName.toLowerCase().includes(searchTermLower) ||
      car.model.brand.brandName.toLowerCase().includes(searchTermLower) ||
      car.numberOfCarSeats.toString().includes(searchTermLower) ||
      car.locationPrice.toString().includes(searchTermLower)
    );
  });


  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
        Liste Des Voitures
        </Typography>
        <Link to="/addCar">
          <Button
            variant="contained"
            style={{ backgroundColor: '#263238', color: 'white' }} 
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
        label="Marque" // Assurez-vous que le label correspond avec InputLabel pour l'accessibilité
        startAdornment={
          <InputAdornment position="start">
            <FilterListIcon />
          </InputAdornment>
        }
        inputProps={{
          id: 'brand-select',
        }}
      >
        <MenuItem value="">
          <em>Toutes les marques</em>
        </MenuItem>
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
                <TableCell className="table-header-cell">Modèle</TableCell>
                <TableCell className="table-header-cell">Nombre de places</TableCell>
                <TableCell className="table-header-cell">Prix de la location</TableCell>
                <TableCell className="table-header-cell">Statut</TableCell>
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
                  <TableCell>{car.model?.brand?.brandName || 'N/A'}</TableCell>
                  <TableCell>{car.model.modelName}</TableCell>
                  <TableCell>{car.numberOfCarSeats}</TableCell>
                  <TableCell>{car.locationPrice} DT</TableCell>
                  <TableCell>{car.status}</TableCell>
                  <TableCell>{car.traveled.at(-1).mileage}</TableCell>
                  
                  <TableCell>
                    <Link to={`/car/${car._id}`}>
                      <IconButton variant="contained">
                      <DescriptionOutlinedIcon    style={{ color: 'rgba(108,151,187,1)' }}/>
                      </IconButton>
                    </Link>
                  </TableCell>
                  
                  <TableCell>
                    <Link to={`/editCar/${car._id}`}>
                      <IconButton onClick={() => handleEdit(car._id)} variant="contained" color="primary">
                      <EditIcon style={{ color: 'rgba(12,192,70,1)' }} />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(car._id)} variant="contained" >
                    <DeleteIcon style={{ color: '#C50000' }}/>
                    </IconButton>
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
