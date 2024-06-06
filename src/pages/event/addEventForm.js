import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem, Typography } from '@mui/material';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';


const EventType = {
  OIL_CHANGE: 'Changement d\'huile',
  TECHNICAL_INSPECTION: 'Inspection technique',
  INSURANCE: 'Assurance',
  OTHER: 'Autre'
};

const AddEventForm = () => {
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [cars, setCars] = useState([]); // Liste des voitures
  const [selectedCar, setSelectedCar] = useState('');
  const [errors, setErrors] = useState({});
  const today = new Date();

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
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

      let isValid = true;
      const newErrors = {};
  
    // Validation
    if (!eventType) {
      newErrors.eventType = "Veuillez sélectionner un type d'événement";
      isValid = false;
    }

    if (!date) {
      newErrors.date = "Veuillez sélectionner une date";
      isValid = false;
    } else if (new Date(date) < new Date()) {
      newErrors.date = "La date doit être aujourd'hui ou ultérieure.";
      isValid = false;
    }

    if (!selectedCar) {
      newErrors.selectedCar = "Veuillez sélectionner une voiture";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

  
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
    {/*window.location.href = '/event';*/}
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
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
          error={!!errors.eventType}
          helperText={errors.eventType}
          placeholder=" note"
          InputProps={{
                        startAdornment: (
                            <ChecklistRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
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
          placeholder=" note"

          InputProps={{
                        startAdornment: (
                            <EventNoteRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
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
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
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
  InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
>
  {cars.map((car) => (
    <MenuItem key={car._id} value={car._id}>
      {car.model.modelName} - {car.registrationPlate}
    </MenuItem>
  ))}
</TextField>


        
        <Button type="submit" variant="contained" style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>
          Ajouter l'événement
        </Button>
        <Link to="/event">
          <Button variant="contained"  style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddEventForm;
