import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  OutlinedInput,
  Card,
  TablePagination,
  IconButton,
  InputAdornment,
  Stack, // Ajout de l'import du composant Stack
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import '../tableStyles.css';

const Charges = () => {
  const [charges, setCharges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };
  useEffect(() => {
    // Replace this URL with your API endpoint to fetch charges
    fetch('http://localhost:3000/v1/api/charges')
      .then(response => response.json())
      .then(data => setCharges(data))
      .catch(error => console.error('Error fetching charges:', error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    console.log('Edit charge with id:', id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette charge ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/charges/delete/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            // Supprimer la charge de l'état local
            setCharges(prevCharges => prevCharges.filter(charge => charge._id !== id));
          } else {
            throw new Error('Failed to delete charge');
          }
        })
        .catch(error => console.error('Error deleting charge:', error));
    }
  };

  const filteredCharges = charges.filter(charge =>
    charge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Charges
        </Typography>
        <Link to="/addCharge">
          <Button
            variant="contained"
            style={{ backgroundColor: '#222831', color: 'white' }}
            startIcon={<AddIcon />}
          >
            Ajouter charge
          </Button>
        </Link>
      </Stack>
      <OutlinedInput
        type="text"
        placeholder="Rechercher charge..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
      />
      
      <Card>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Description</TableCell>
                <TableCell className="table-header-cell">Coût</TableCell>
                <TableCell className="table-header-cell">Voiture</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCharges.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((charge) => (
                <TableRow key={charge._id}>
                  <TableCell>{formatDate(charge.date)}</TableCell>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>{charge.cost} DT</TableCell>
                  
                  <TableCell>{charge.voiture ? charge.voiture.registrationPlate : ''}</TableCell>
                  <TableCell>
                    <IconButton component={Link} to={`/editcharge/${charge._id}`} color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete(charge._id)}>
                      <DeleteIcon style={{ color: '#C50000' }}/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredCharges.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      </Card>
    </Container>
  );
};

export default Charges;
