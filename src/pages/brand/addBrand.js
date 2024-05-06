import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

const AddBrand = () => {
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState('');

  const handleAddBrand = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/marque/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add brand');
      }

      console.log('Brand added successfully!');
      // Reset form after adding
      setBrandName('');
      setError('');
    } catch (error) {
      console.error('Error adding brand:', error);
      setError('Le nom de la marque existe déjà');
    }
  };

  const handleBrandNameChange = (event) => {
    setBrandName(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ajouter une marque
      </Typography>
      <form>
        <TextField
          label="Nom de la marque"
          variant="outlined"
          value={brandName}
          onChange={handleBrandNameChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleAddBrand}>
          Ajouter
        </Button>
      </form>
    </Container>
  );
};

export default AddBrand;
