import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';

import AirlineSeatReclineNormalRoundedIcon from '@mui/icons-material/AirlineSeatReclineNormalRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import CarCrashRoundedIcon from '@mui/icons-material/CarCrashRounded';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';


const EditCarForm = () => {
  const [car, setCar] = useState({
    registrationPlate: '',
    model: '',
   // brand: '',
    images: [],
    numberOfCarSeats: 0,
    traveled: [{
      mileage: '',
    }],
    locationPrice: 0,
    status: ''
  });
  const [models, setModels] = useState([]);
  const { id } = useParams();
  /*useEffect(() => {
    fetchModels();
  }, []);*/
  useEffect(() => {
    fetchCar();
    fetchModels();
   
  }, [id]);

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/api/modele');
      const data = await response.json();
      console.log('modele data:', data);
      setModels(data);
     // setModels(data.model.modelName);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchCar = async () => {
    try {
      const response = await fetch(`http://localhost:3000/v1/api/voiture/get/${id}`);
      const data = await response.json();
      console.log('voiture data:', data);
      setCar({
        registrationPlate: data.registrationPlate || '',
        model: data.model._id || '', // Assurez-vous que `model` est correctement assigné
        images: data.images || [],
        numberOfCarSeats: data.numberOfCarSeats || 0,
        traveled: data.traveled || [{ mileage: '' }],
        locationPrice: data.locationPrice || 0,
        status: data.status || ''
      });
    } catch (error) {
      console.error('Error fetching car:', error);
    }
  };

  const [errors, setErrors] = useState({
    registrationPlate: '',
    model: '',
  //  brand: '',
    images: [],
    numberOfCarSeats: '',
    traveled: [{ mileage: '' }],
    locationPrice: '',
    status: ''
  });

  const Status = {
    RENTING: 'En location',
    BEING_WASHED: 'En lavage',
    IN_PARKING: 'En parc',
    BROKEN_DOWN: 'En panne'
  };

 

 /* useEffect(() => {
    fetch(`http://localhost:3000/v1/api/voiture/get/${id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car:', error));
  }, [id]);*/

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const imageFiles = Array.from(files);
      setCar(prevCar => ({
        ...prevCar,
        images: [...prevCar.images, ...imageFiles] 
      }));
    } else if (name === 'traveled.mileage') {
      setCar(prevCar => ({
        ...prevCar,
        traveled: [{ mileage: value }] // Mettre à jour la propriété mileage de traveled
      }));
    } else {
      setCar(prevCar => ({
        ...prevCar,
        [name]: value
      }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
      
    if (!car.registrationPlate) {
      newErrors.registrationPlate = 'Veuillez saisir la matricule de la voiture';
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


    const formData = new FormData();
    formData.append('registrationPlate', car.registrationPlate);
    formData.append('model', car.model);
    //formData.append('brand', car.brand);
    formData.append('numberOfCarSeats', car.numberOfCarSeats);
    formData.append('locationPrice', car.locationPrice);
    formData.append('status', car.status);

    car.images.forEach(image => {
      formData.append('images', image);

    });

    fetch(`http://localhost:3000/v1/api/voiture/update/${id}`, {
      method: 'PATCH',
      headers: {
      },
      body: formData
    })
    .then(response => {
      if (response.ok) {
        
     {/* window.location.href = '/car';*/}
      } else {
        throw new Error('Failed to update car');
      }alert('Voiture mise à jour avec succès !');
    })
    .catch(error => console.error('Erreur lors de la mise à jour de la voiture :', error));
  };

  return (
    <Container maxWidth="sm">
     
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
      Edit Voiture
      </Typography>
      <form onSubmit={handleSubmit}>
  
        <TextField name="registrationPlate" label="Imatriculation" value={car.registrationPlate || ''} onChange={handleChange} fullWidth margin="normal" required disabled InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }} />
        <TextField
          select
          label="Modele"
          name="model"
          value={car.model || ''}
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
        {/*<TextField name="brand" label="Marque" value={car.brand || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.brand} helperText={errors.brand}/>*/}
        <TextField name="numberOfCarSeats" label="Nombre de places" value={car.numberOfCarSeats || ''} onChange={handleChange} fullWidth margin="normal" type="number" required  error={!!errors.numberOfCarSeats} helperText={errors.numberOfCarSeats}    InputProps={{
                        startAdornment: (
                            <AirlineSeatReclineNormalRoundedIcon  style={{ opacity: 0.6, marginRight: '10px' }} />
                        ),
                    }}/>
        <TextField name="locationPrice" label="Prix de la location" value={car.locationPrice || ''} onChange={handleChange} fullWidth margin="normal" type="number"error={!!errors.locationPrice} helperText={errors.locationPrice}   InputProps={{
                        startAdornment: (
                            <PaidOutlinedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
                        ),
                    }}/>
        <TextField select label="Statut" name="statut" value={car.status || ''} onChange={handleChange} fullWidth margin="normal" required   error={!!errors.status}
          helperText={errors.status} InputProps={{
                        startAdornment: (
                            <CarCrashRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}>
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
          placeholder="Kilométrage"
        />
        <Button type="submit" variant="contained"  style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>sauvegarder</Button>
        <Link to="/car">
          <Button variant="contained"  style={{ marginLeft: '10px', marginTop: '20px' ,backgroundColor: ' #C50000',}}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditCarForm;
