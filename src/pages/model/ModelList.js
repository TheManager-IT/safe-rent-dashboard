import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, OutlinedInput, InputAdornment, TablePagination, Card, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
//import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    fetch('http://localhost:3000/v1/api/modele')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        return response.json();
      })
      .then(data => setModels(data))
      .catch(error => {
        console.error('Error fetching models:', error);
        setError('Erreur lors du chargement des modèles');
      });
  };

  const handleEditModel = (id) => {
    // Handle edit model logic
  };

  const handleDeleteModel = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce modèle ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/modele/delete/${id}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            fetchModels(); // Refetch models after deletion
          } else {
            throw new Error('Failed to delete model');
          }
        })
        .catch(error => console.error('Error deleting model:', error));
    }
  };

  const handleAddModel = () => {
    // Handle add model logic
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset page number when searching
  };

  const filteredModels = models.filter(model =>
    model.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
      <Stack className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Liste des modèles
        </Typography>
        <Link to="/addModel">
          <Button variant="contained" style={{ backgroundColor: '#222831', color: 'white' }} startIcon={<AddIcon />} onClick={handleAddModel}>
            Ajouter un modèle
          </Button>
        </Link>
      </Stack>
      <div className="search">
        <OutlinedInput
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Rechercher un modèle..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      {error && <Typography color="error">{error}</Typography>}
      <Card style={{ marginBottom: '20px' }}>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
                <TableCell className="table-header-cell">Modèle</TableCell>
                <TableCell className="table-header-cell">Marque</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model._id}>
                  <TableCell>{model.modelName}</TableCell>
                 {/** <TableCell>{model.brand.brandName}</TableCell>*/} 
                 <TableCell>{model.brand }</TableCell>

                  <TableCell>
                    <Link to={`/editModel/${model._id}`}>
                      <Button variant="contained" color="primary" onClick={() => handleEditModel(model._id)}>
                        Modifier
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteModel(model._id)} style={{ marginLeft: '10px' }}>
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
          count={models.length}
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

export default ModelList;
