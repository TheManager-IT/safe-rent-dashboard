import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';

import { Link } from 'react-router-dom';

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

const EditEventForm = () => {
  const [event, setEvent] = useState({
    eventType: '',
    note: '',
    date: '',
    voiture: ''
  });

  const [carInfo, setCarInfo] = useState({
    model: '',
    registrationPlate: ''
  });
  const [errors, setErrors] = useState({
    date: '',
   
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:3000/v1/api/evenement/get/${id}`);
        const eventData = await eventResponse.json();
        setEvent(eventData);
        const carResponse = await fetch(`http://localhost:3000/v1/api/voiture/get/${eventData.voiture}`);
        const carData = await carResponse.json();
        setCarInfo({ model: carData.model, registrationPlate: carData.registrationPlate });
      } catch (error) {
        console.error('Error fetching event and car:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation des données
    const newErrors = {};
    if (new Date(event.date) < new Date()) {
      newErrors.date = "La date doit être aujourd'hui ou ultérieure.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    // Envoyer les données modifiées de l'événement à l'API backend
    fetch(`http://localhost:3000/v1/api/evenement/update/${id}`, {
      method: 'PATCH', // Utilisation de la méthode PATCH
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    })
    .then(response => {
      if (response.ok) {
        // Redirection vers la liste des événements après modification
        window.location.href = '/event';
      } else {
        throw new Error('Failed to update event');
      }
    })
    .catch(error => console.error('Error updating event:', error));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }}>
      Edit un événement
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          name="eventType"
          label="Event Type"
          value={event.eventType || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          {Object.values(EventType).map((type) => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </TextField>
        <TextField
          name="note"
          label="Note"
          value={event.note || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          name="date"
          label="Date"
          type="date"
          value={event.date || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.date} helperText={errors.date}
        />
        <TextField
          name="voiture"
          label="Car"
          value={`${carInfo.model} - ${carInfo.registrationPlate}`}
          fullWidth
          margin="normal"
          required
          disabled
        />
        <Button type="submit" variant="contained" color="primary">Save</Button>
        <Link to="/event">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditEventForm;
