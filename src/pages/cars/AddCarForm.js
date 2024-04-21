import React, { useState } from 'react';
import { Button, Container, TextField, MenuItem, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function AddCarForm() {
  const [car, setCar] = useState({
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

  const [errors, setErrors] = useState({
    registrationPlate: '',
    model: '',
    brand: '',
    numberOfCarSeats: '',
    status: ''
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
      // Validation des données
      const newErrors = {};

      if (!car.registrationPlate.match(/\d{1,3}TN\d{1,4}/)) {
        newErrors.registrationPlate = 'Numéro d\'immatriculation invalide';
      }

      if (!car.model.trim()) {
        newErrors.model = 'Veuillez saisir le modèle de la voiture';
      }

      if (!car.brand.trim()) {
        newErrors.brand = 'Veuillez saisir la marque de la voiture';
      }

      if (!car.numberOfCarSeats) {
        newErrors.numberOfCarSeats = 'Veuillez saisir le nombre de sièges de la voiture';
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
          // Assurez-vous que mileage est converti en un nombre avant de l'ajouter au formulaire
          const mileage = parseFloat(car.traveled.mileage);
          formData.append('traveled.mileage', mileage);
        } else {
          formData.append(key, car[key]);
        }
      });
  
      const response = await fetch('http://localhost:3000/v1/api/voiture/create', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      // Réinitialisation du formulaire après envoi réussi
      setCar({
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
  
      alert('Car added successfully!');
      
    } catch (error) {
      setErrors({ ...errors, serverError: 'Failed to add car: ' + error.message });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }}>
        Ajouter Voiture
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Registration Plate"
          name="registrationPlate"
          value={car.registrationPlate}
          onChange={handleChange}
          placeholder="Registration Plate"
          required
          fullWidth
          margin="normal"
          error={!!errors.registrationPlate}
          helperText={errors.registrationPlate}
        />
        <TextField
          label="Model"
          name="model"
          value={car.model}
          onChange={handleChange}
          placeholder="Model"
          required
          margin="normal"
          fullWidth
          error={!!errors.model}
          helperText={errors.model}
        />
        <TextField
          label="Brand"
          name="brand"
          value={car.brand}
          onChange={handleChange}
          placeholder="Brand"
          required
          margin="normal"
          fullWidth
          error={!!errors.brand}
          helperText={errors.brand}
        />
        <TextField
          label="Number of Car Seats"
          name="numberOfCarSeats"
          value={car.numberOfCarSeats}
          onChange={handleChange}
          type="number"
          placeholder="Number of Car Seats"
          required
          fullWidth
          margin="normal"
          error={!!errors.numberOfCarSeats}
          helperText={errors.numberOfCarSeats}
        />
        <TextField
          label="Location Price"
          name="locationPrice"
          value={car.locationPrice}
          onChange={handleChange}
          type="number"
          placeholder="Location Price"
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Status"
          name="status"
          value={car.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.status}
          helperText={errors.status}
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
        />
        <TextField
          label="Mileage"
          name="traveled.mileage"
          value={car.traveled.mileage}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          placeholder="Mileage"
        />
        <br />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Add Car
        </Button>
        <Link to="/car">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px', marginTop: '20px' }}>
            Annuler
          </Button>
        </Link>
       
      </form>
    </Container>
  );
}

export default AddCarForm;
