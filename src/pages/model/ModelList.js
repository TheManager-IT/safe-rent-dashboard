import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from '../../components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 

import {
  Button, Stack,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  InputAdornment,
  Typography,
  TablePagination,
  Card,
} from '@mui/material';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    fetch('http://localhost:3000/v1/api/marque')
      .then(response => response.json())
      .then(data => setBrands(data))
      .catch(error => console.error('Error fetching brands:', error));
  };

  const handleEditBrand = (id) => {
    // Handle edit brand logic
  };

  const handleDeleteBrand = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette marque ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/brand/delete/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            fetchBrands(); // Refetch brands after deletion
          } else {
            throw new Error('Failed to delete brand');
          }
        })
        .catch(error => console.error('Error deleting brand:', error));
    }
  };

  const handleAddBrand = () => {
    // Handle add brand logic
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBrands = brands.filter(brand =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Liste des marques
        </Typography>
        <Link to="/addBrand">
          <Button variant="contained" style={{ backgroundColor: '#222831', color: 'white' }} startIcon={<AddIcon />} onClick={handleAddBrand}>
            Ajouter une marque
          </Button>
        </Link>
      </Stack>
      <div className="search">
        <OutlinedInput
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Rechercher une marque..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      <Card style={{ marginBottom: '20px' }}>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Marque</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>{brand.brandName}</TableCell>
                  <TableCell>
                    <Link to={`/editBrand/${brand._id}`}>
                      <Button variant="contained" color="primary" onClick={() => handleEditBrand(brand._id)}>
                        Modifier
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteBrand(brand._id)} style={{ marginLeft: '10px' }}>
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
          count={brands.length}
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

      {/* Second Table for Models */}
      
      <Card>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Liste des modèles
        </Typography>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Marque</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand._id}>
                  <TableCell>{brand.brandName}</TableCell>
                  <TableCell>
                    <Link to={`/editBrand/${brand._id}`}>
                      <Button variant="contained" color="primary" onClick={() => handleEditBrand(brand._id)}>
                        Modifier
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteBrand(brand._id)} style={{ marginLeft: '10px' }}>
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
          count={brands.length}
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

export default Brands;
