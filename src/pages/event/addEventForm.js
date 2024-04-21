import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';

const EventType = {
  OIL_CHANGE: 'Oil Change',
  TECHNICAL_INSPECTION: 'Technical Inspection',
  INSURANCE: 'Insurance',
  BIRTHDAY: 'Birthday',
  CAR_WASH: 'Car Wash',
  INTERIOR_CLEANING: 'Interior Cleaning',
  MAINTENANCE: 'Maintenance',
  HEADLIGHT_REPLACEMENT: 'Headlight Replacement',
  OTHER: 'Other'
};

const AddEventForm = () => {
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [cars, setCars] = useState([]); // Liste des voitures
  const [selectedCar, setSelectedCar] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch('http://localhost:3000/v1/api/voiture');
      const data = await response.json();
      setCars(data);
    };

    fetchCars();
  }, []);

  const handleEventTypeChange = (event) => {
    setEventType(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCarChange = (event) => {
    setSelectedCar(event.target.value);
  };

  const resetForm = () => {
    setEventType('');
    setNote('');
    setDate('');
    setSelectedCar('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/v1/api/evenement/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventType, note, date, voiture: selectedCar }),
      });
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
      alert('Event added successfully!');
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      
      <Typography variant="h4" sx={{ mb: 2 }}>
      Ajouter un événement
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Type d'événement"
          value={eventType}
          onChange={handleEventTypeChange}
          fullWidth
          margin="normal"
        >
          {Object.values(EventType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Note"
          value={note}
          onChange={handleNoteChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Voiture"
          value={selectedCar}
          onChange={handleCarChange}
          fullWidth
          margin="normal"
        >
          {cars.map((car) => (
            <MenuItem key={car._id} value={car._id}>
              {car.model} - {car.registrationPlate}
            </MenuItem>
          ))}
        </TextField>
        
        <Button type="submit" variant="contained" color="primary">
          Ajouter l'événement
        </Button>
        <Link to="/event">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddEventForm;
