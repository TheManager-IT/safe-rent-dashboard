import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, MenuItem } from '@mui/material';


const AddChargeForm = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [cars, setCars] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/api/voiture');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCostChange = (event) => {
    setCost(event.target.value);
  };

  const handleCarChange = (event) => {
    setSelectedCar(event.target.value);
  };

  const resetForm = () => {
    setDate('');
    setDescription('');
    setCost('');
    setSelectedCar('');
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (!date) {
      newErrors.date = 'Veuillez sélectionner une date';
      isValid = false;
    }

    if (!description) {
      newErrors.description = 'Veuillez saisir une description';
      isValid = false;
    }

    if (!cost) {
      newErrors.cost = 'Veuillez saisir un coût';
      isValid = false;
    } else if (isNaN(cost) || Number(cost) <= 0) {
      newErrors.cost = 'Le coût doit être un nombre positif';
      isValid = false;
    }

    if (!selectedCar) {
      newErrors.selectedCar = 'Veuillez sélectionner une voiture';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/v1/api/charges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, description, cost, voiture: selectedCar }),
      });
      if (!response.ok) {
        throw new Error('Failed to add charge');
      }
      alert('Charge added successfully!');
    {/*window.location.href = '/charge';*/}
      resetForm();
    } catch (error) {
      console.error('Error adding charge:', error);
      alert('Failed to add charge: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
        Ajouter une charge
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.date}
          helperText={errors.date}
        />
        <TextField
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
        />
        <TextField
          label="Coût"
          type="number"
          value={cost}
          onChange={handleCostChange}
          fullWidth
          margin="normal"
          error={!!errors.cost}
          helperText={errors.cost}
        />
        <TextField
          select
          label="Voiture"
          value={selectedCar}
          onChange={handleCarChange}
          fullWidth
          margin="normal"
          error={!!errors.selectedCar}
          helperText={errors.selectedCar}
        >
          {cars.map((car) => (
            <MenuItem key={car._id} value={car._id}>
              {car.model.modelName} - {car.registrationPlate}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Ajouter la charge
        </Button>
        <Link to="/charge">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddChargeForm;
