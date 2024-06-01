import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
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
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
        Ajouter une marque
      </Typography>
      <form>
        <TextField
          label="Nom de la marque voiture"
          variant="outlined"
          value={brandName}
          onChange={handleBrandNameChange}
          fullWidth
          placeholder=" Marque voiture"
          sx={{ mb: 2 }}
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained"  onClick={handleAddBrand}     style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>
          Ajouter marque
        </Button>
        <Link to="/brand">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddBrand;
