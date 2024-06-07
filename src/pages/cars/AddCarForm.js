import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, MenuItem, Typography, Alert ,Card,Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AirlineSeatReclineNormalRoundedIcon from '@mui/icons-material/AirlineSeatReclineNormalRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import CarCrashRoundedIcon from '@mui/icons-material/CarCrashRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';


function AddCarForm() {
  const [car, setCar] = useState({
    registrationPlate: '',
    model: '',
    //brand: '',
    images: [],
    numberOfCarSeats: '',
    traveled: [{
      mileage: '',
    }],
    locationPrice: '',
    status: ''
  });

  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/modele');
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };


  const Status = {
    RENTING: 'En location',
    BEING_WASHED: 'En lavage',
    IN_PARKING: 'En parc',
    BROKEN_DOWN: 'En panne'
  };

  const [errors, setErrors] = useState({
    registrationPlate: '',
    model: '',
    //brand: '',
    numberOfCarSeats: '',
    locationPrice: '',
    status: '',
    serverError: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const [fieldName, subFieldName] = name.split('.');
    
    if (fieldName === 'traveled') {
      setCar(prevState => ({
        ...prevState,
        traveled: {
          ...prevState.traveled,
          [subFieldName]: value
        }
      }));
    } else if (name === 'images') {
      setCar(prevState => ({
        ...prevState,
        images: [...prevState.images, ...e.target.files]
      }));
    } else {
      setCar(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const newErrors = {};
      
      if (!car.registrationPlate) {
        newErrors.registrationPlate = 'Veuillez saisir la matricule de la voiture.';
      } else if (!/\d{1,3}TN\d{1,4}/.test(car.registrationPlate)) {
        newErrors.registrationPlate = 'Numéro d\'immatriculation invalide.  Le format doit être comme ceci : 125TN1234';
      }

      if (!car.model.trim()) {
        newErrors.model = 'Veuillez saisir le modèle de la voiture';
      }

     /* if (!car.brand.trim()) {
        newErrors.brand = 'Veuillez saisir la marque de la voiture';
      }*/

      if (!car.numberOfCarSeats) {
        newErrors.numberOfCarSeats = 'Veuillez saisir le nombre de sièges de la voiture';
      } else if (car.numberOfCarSeats <= 0) {
        newErrors.numberOfCarSeats = 'Le nombre de sièges doit être un nombre positif';
      }
      
      if (!car.locationPrice) {
        newErrors.locationPrice = 'Veuillez saisir le prix de la location !';
      } else if (car.locationPrice <= 0) {
        newErrors.locationPrice = 'Le prix de la location doit être un nombre positif';
      }
      
      if (!car.status) {
        newErrors.status = 'Veuillez sélectionner le statut de la voiture';
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      // Envoi du formulaire
      const formData = new FormData();
      Object.keys(car).forEach(key => {
        if (key === 'images') {
          car.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'traveled') {
          //  mileage est converti en un nombre avant de l'ajouter au formulaire
          const mileage = parseFloat(car.traveled.mileage);
          formData.append('traveled[mileage]', mileage);
        } else {
          formData.append(key, car[key]);
        }
      });
  
      const response = await fetch('http://localhost:3000/v1/api/voiture/create', {
        method: 'POST',
        body: formData
      });
  
     /* if (!response.ok) {
        throw new Error('Network response was not ok.');
      }*/

       const data = await response.json();
            if (!response.ok) {
                if (data.error === 'La voiture existe déjà.') {
                    // Affichage du message "La voiture existe déjà." dans le composant
                    setErrors({ ...errors, serverError: 'La voiture existe déjà.' });
                } else {
                    throw new Error(data.error || 'Failed to add car');
                }
            }
      
  
      // Réinitialisation du formulaire après envoi réussi
      setCar({
        registrationPlate: '',
        model: '',
        //brand: '',
        images: [],
        numberOfCarSeats: '',
        traveled: [{
          mileage: '',
        }],
        locationPrice: '',
        status: ''
      });
  
      alert('Voiture ajoutée avec succès !');
      
    } catch (error) {
      setErrors({ ...errors, serverError: 'Échec de l\'ajout de la voiture : ' + error.message });
    }
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
    <b>  <Typography variant="h4"  
     
       sx={{ mb: 2 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }} align="center">
        Ajouter Voiture
      </Typography></b>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
       {errors.serverError && (
                    <Alert severity="error">{errors.serverError}</Alert>
                )}
        <TextField
          label="Imatriculation"
          name="registrationPlate"
          value={car.registrationPlate}
          onChange={handleChange}
          placeholder="Imatriculation"
          required
          fullWidth
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
          margin="normal"
          error={!!errors.registrationPlate}
          helperText={errors.registrationPlate}
        />
        <TextField
          select
          label="Modele"
          name="model"
          value={car.model}
          onChange={handleChange}
          placeholder="Modele"
          required
          margin="normal"
          fullWidth
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
          error={!!errors.model}
          helperText={errors.model}
        >
          {models.map((model) => (
            <MenuItem key={model._id} value={model._id}>
              {model.modelName}
            </MenuItem>
          ))}
        </TextField>
       
     
        <TextField
          label="Nombre de places"
          name="numberOfCarSeats"
          value={car.numberOfCarSeats}
          onChange={handleChange}
          type="number"
          placeholder=" Nombre de places"
          required
          fullWidth
          margin="normal"
          error={!!errors.numberOfCarSeats}
          helperText={errors.numberOfCarSeats}

          InputProps={{
                        startAdornment: (
                            <AirlineSeatReclineNormalRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}

        />
        <TextField
          label="Prix de la location"
          name="locationPrice"
          value={car.locationPrice}
          onChange={handleChange}
          type="number"
          placeholder=" Prix de la location"
          fullWidth
          margin="normal"
          error={!!errors.locationPrice}
          helperText={errors.locationPrice}
          InputProps={{
                        startAdornment: (
                            <PaidOutlinedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
                        ),
                    }}
        />
        <TextField
          select
          label="Statut"
          name="status"
          value={car.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.status}
          helperText={errors.status}
          InputProps={{
                        startAdornment: (
                            <CarCrashRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}
        >
          {Object.values(Status).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="file"
          name="images"
          multiple
          onChange={handleChange}
          fullWidth
          margin="normal"

          InputProps={{
                        startAdornment: (
                            <AddPhotoAlternateRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}
        />
        <TextField
          label="Kilométrage"
          name="traveled.mileage"
          value={car.traveled.mileage}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          placeholder=" Kilométrage"
          InputProps={{
                        startAdornment: (
                            <AirlineSeatReclineNormalRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' ,}} />
                        ),
                    }}
        />
        <br />
        <div     style={{  
           
          
           }}>
        <Button type="submit" variant="contained"  style={{ marginTop: '20px' ,
        backgroundColor: ' rgb(108,151,187)', fontFamily: 'monospace'}}>
        Ajouter Voiture
        </Button>
        <Link to="/car">
          <Button variant="contained"  style={{ marginLeft: '10px', marginTop: '20px' ,
           backgroundColor: ' #C50000',fontFamily: 'monospace'
           }}>
            Annuler
          </Button>
        </Link>
        </div>
       
      </form>
    </Container>
    </Box>
    </Grid>
    </Grid>
  );
}

export default AddCarForm;
