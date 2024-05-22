import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const EditBrand = () => {
  const [brandName, setBrandName] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`http://localhost:3000/v1/api/marque/get/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch brand');
        }
        const data = await response.json();
        setBrandName(data.brandName);
          
      } catch (error) {
        console.error('Error fetching brand:', error);
        setError('Erreur lors de la récupération de la marque');
      }
    };

    fetchBrand();
  }, [id]);

  const handleEditBrand = async () => {
    try {
      const response = await fetch(`http://localhost:3000/v1/api/marque/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand');
      }
      alert('Brand updated successfully !');
      {/*window.location.href = '/brand';*/}
      console.log('Brand updated successfully!');
    } catch (error) {
      console.error('Error updating brand:', error);
      if (error.message.includes('duplicate key error')) {
        setError('Le nom de la marque existe déjà');
      } else {
        setError('Erreur lors de la mise à jour de la marque');
      }
    }
  };

  const handleBrandNameChange = (event) => {
    setBrandName(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Modifier la marque
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
        <Button variant="contained" color="primary" onClick={handleEditBrand}>
          Enregistrer
        </Button>
      </form>
    </Container>
  );
};

export default EditBrand;
