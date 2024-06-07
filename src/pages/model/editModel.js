import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, Select, MenuItem, Typography,Box,Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';


const EditModel = () => {
  const [modele, setModele] = useState({
    modelName: '',
    brand: '',
  });
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    fetchModele();
    fetchBrands();
  }, [id]);

  const fetchModele = async () => {
    try {
      const response = await fetch(`http://localhost:3000/v1/api/modele/get/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch modele');
      }
      const data = await response.json();
      setModele(data);
    } catch (error) {
      console.error('Error fetching modele:', error);
      setError('Erreur lors du chargement du modèle');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/marque');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModele(prevModele => ({
      ...prevModele,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envoyer les données modifiées du modèle à l'API backend
    fetch(`http://localhost:3000/v1/api/modele/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(modele)
    })
    .then(response => {
      if (response.ok) {
          alert('Modèle mis à jour avec succès!');
          // Redirection vers la liste des modèles après modification
     {/* window.location.href = '/model';*/}
      } else {
          throw new Error('Failed to update modele');
      }
  })
  .catch(error => console.error('Error updating modele:', error));
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
      <Typography variant="h4"   sx={{ mb: 5 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }}  align="center">
        Modifier un modèle
      </Typography>
      <form onSubmit={handleSubmit}>
        <Select
          label="Marque"
          variant="outlined"
          name="brand"
          value={modele.brand || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        >
          {brands.map((brand) => (
            <MenuItem key={brand._id} value={brand._id}>{brand.brandName}</MenuItem>
          ))}
        </Select>
        <TextField
          name="modelName"
          label="Nom du modèle"
          variant="outlined"
          value={modele.modelName || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)', fontFamily: 'monospace'}}>sauvegarder</Button>
        <Link to="/model">
          <Button variant="contained" style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', fontFamily: 'monospace' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container></Box></Grid></Grid>
  );
};

export default EditModel;
