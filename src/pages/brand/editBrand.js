import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button,Grid,Box } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
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
    <Grid container spacing={3} justifyContent="center">
    <Grid item>
      <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        borderRadius: '20px', 
        padding: '20px 20px 50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'15%',
      }}>
    <Container maxWidth="sm">
      <Typography variant="h4"  sx={{ mb: 5 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }} align="center">
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
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" onClick={handleEditBrand}  style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',fontFamily: 'monospace'}}  >
        sauvegarder
        </Button>
        <Link to="/brand">
          <Button variant="contained" style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', fontFamily: 'monospace'}}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container></Box></Grid></Grid>
  );
};

export default EditBrand;
