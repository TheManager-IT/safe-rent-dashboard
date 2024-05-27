import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const AddModel = () => {
  const [modelName, setModelName] = useState('');
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]); // State to store brands
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBrands(); // Fetch brands when component mounts
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/marque'); // Assuming the endpoint for brands is /v1/api/brand
      if (!response.ok) {
        throw new Error('Failed to fetch brands');
      }
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setError('Erreur lors du chargement des marques');
    }
  };

  const handleAddModel = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/modele/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelName, brand }),
      });

      if (!response.ok) {
        throw new Error('Failed to add model');
      }

      console.log('Model added successfully!');
      // Reset form after adding
      setModelName('');
      setBrand('');
      setError('');
    } catch (error) {
      console.error('Error adding model:', error);
      setError('Erreur lors de l\'ajout du modèle');
    }
  };

  const handleModelNameChange = (event) => {
    setModelName(event.target.value);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ajouter un modèle
      </Typography>
      <form>
        <Select
          label="Marque"
          variant="outlined"
          value={brand}
          onChange={handleBrandChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          {brands.map((brand) => (
            <MenuItem key={brand._id} value={brand._id}>{brand.brandName}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Nom du modèle"
          variant="outlined"
          value={modelName}
          onChange={handleModelNameChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleAddModel}>
          Ajouter
        </Button>
        <Link to="/model">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddModel;
