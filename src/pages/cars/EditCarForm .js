import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';

const EditCarForm = () => {
  const [car, setCar] = useState({
    registrationPlate: '',
    model: '',
    brand: '',
    images: [],
    numberOfCarSeats: 0,
    traveled: {
      mileage: '',
    },
    locationPrice: 0,
    status: ''
  });

  const [errors, setErrors] = useState({
    registrationPlate: '',
    model: '',
    brand: '',
    images: [],
    numberOfCarSeats: '',
    traveled: {
      mileage: '',
    },
    locationPrice: '',
    status: ''
  });

  const Status = {
    RENTING: 'Renting',
    BEING_WASHED: 'Being Washed',
    IN_PARKING: 'In Parking',
    BROKEN_DOWN: 'Broken Down'
  };
  
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/v1/api/voiture/get/${id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const imageFiles = Array.from(files);
      setCar(prevCar => ({
        ...prevCar,
        images: [...prevCar.images, ...imageFiles] 
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

    if (!car.brand.trim()) {
      newErrors.brand = 'Veuillez saisir la marque de la voiture';
    }

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
    formData.append('brand', car.brand);
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
        window.location.href = '/car';
      } else {
        throw new Error('Failed to update car');
      }alert('Voiture mise à jour avec succès !');
    })
    .catch(error => console.error('Erreur lors de la mise à jour de la voiture :', error));
  };

  return (
    <Container maxWidth="sm">
     
      <Typography variant="h4" sx={{ mb: 2 }}>
      Edit Voiture
      </Typography>
      <form onSubmit={handleSubmit}>
  
        <TextField name="registrationPlate" label="Imatriculation" value={car.registrationPlate || ''} onChange={handleChange} fullWidth margin="normal" required disabled />
        <TextField name="model" label="Modele" value={car.model || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.model} helperText={errors.model} />
        <TextField name="brand" label="Marque" value={car.brand || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.brand} helperText={errors.brand}/>
        <TextField name="numberOfCarSeats" label="Nombre de places" value={car.numberOfCarSeats || ''} onChange={handleChange} fullWidth margin="normal" type="number" required  error={!!errors.numberOfCarSeats} helperText={errors.numberOfCarSeats}/>
        <TextField name="locationPrice" label="Prix de la location" value={car.locationPrice || ''} onChange={handleChange} fullWidth margin="normal" type="number"error={!!errors.locationPrice} helperText={errors.locationPrice}/>
        <TextField select label="Statut" name="statut" value={car.status || ''} onChange={handleChange} fullWidth margin="normal" required   error={!!errors.status}
          helperText={errors.status}>
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
        />

        <TextField
          label="Kilométrage"
          name="traveled.mileage"
          value={car.traveled.mileage}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          placeholder="Mileage"
        />

        <Button type="submit" variant="contained" color="primary" style={{marginTop: '20px'}}>Save</Button>
        <Link to="/car">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px', marginTop: '20px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditCarForm;
