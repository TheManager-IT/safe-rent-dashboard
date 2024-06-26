import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, OutlinedInput, InputAdornment, TablePagination, Card, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

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



  const handleDeleteBrand = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette marque ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/v1/api/marque/delete/${id}`);
        fetchBrands(); // Refetch brands after deletion
      } catch (error) {
        console.error('Error deleting brand:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete brand';
        alert(errorMessage);
      }
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

  console.log('brands:', brands);

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ color:'#455a64', mb: 2 ,fontFamily: 'monospace',fontWeight: 'bold',}} >
          Liste des marques
        </Typography>
        <Link to="/AddBrand">
          <Button variant="contained" style={{ backgroundColor: '#263238', color: 'white',fontFamily: 'monospace' }} startIcon={<AddIcon />} onClick={handleAddBrand}>
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
                      <IconButton variant="contained" color="primary" onClick={() => handleEditBrand(brand._id)}>
                      <EditIcon style={{ color: 'rgba(12,192,70,1)' }} />
                      </IconButton>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IconButton variant="contained" color="secondary" onClick={() => handleDeleteBrand(brand._id)} style={{ marginLeft: '10px' }}>
                    <DeleteIcon style={{ color: '#C50000' }}/>

                    </IconButton>
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
