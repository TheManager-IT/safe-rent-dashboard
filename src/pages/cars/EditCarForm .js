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
    //traveled: [],
    traveled: {
      mileage: '',
    },
    locationPrice: 0,
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
        // Ne pas définir 'Content-Type': 'multipart/form-data' ici car le navigateur doit le faire pour inclure la boundary
      },
      body: formData
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/car';
      } else {
        throw new Error('Failed to update car');
      }alert('Car updated successfully!');
    })
    .catch(error => console.error('Error updating car:', error));
  };

  return (
    <Container maxWidth="sm">
     
      <Typography variant="h4" sx={{ mb: 2 }}>
      Edit Voiture
      </Typography>
      <form onSubmit={handleSubmit}>
  
        <TextField name="registrationPlate" label="Registration Plate" value={car.registrationPlate || ''} onChange={handleChange} fullWidth margin="normal" required disabled />
        <TextField name="model" label="Model" value={car.model || ''} onChange={handleChange} fullWidth margin="normal" required/>
        <TextField name="brand" label="Brand" value={car.brand || ''} onChange={handleChange} fullWidth margin="normal" required/>
        <TextField name="numberOfCarSeats" label="Number of Car Seats" value={car.numberOfCarSeats || ''} onChange={handleChange} fullWidth margin="normal" type="number" required />
        <TextField name="locationPrice" label="Location Price" value={car.locationPrice || ''} onChange={handleChange} fullWidth margin="normal" type="number"/>
        <TextField select label="Status" name="status" value={car.status || ''} onChange={handleChange} fullWidth margin="normal" required >
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
  label="mileage"
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
