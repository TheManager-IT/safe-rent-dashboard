import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';

import { Link } from 'react-router-dom';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';


const EventType = {
  OIL_CHANGE: 'Changement d\'huile',
  TECHNICAL_INSPECTION: 'Inspection technique',
  INSURANCE: 'Assurance',
  BIRTHDAY: 'Anniversaire',
  CAR_WASH: 'Lavage de voiture',
  INTERIOR_CLEANING: 'Nettoyage intérieur',
  MAINTENANCE: 'Entretien',
  OTHER: 'Autre'
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
        //setEvent(eventData);
 // Convertir la date récupérée en format ISO (AAAA-MM-JJ)
 const formattedDate = new Date(eventData.date).toISOString().split('T')[0];
      
 setEvent({
   ...eventData,
   date: formattedDate
 });

  
        const carResponse = await fetch(`http://localhost:3000/v1/api/voiture/get/${eventData.voiture}`);
        const carData = await carResponse.json();
  
        if (carData.model) {
          setCarInfo({ model: carData.model.modelName, registrationPlate: carData.registrationPlate });
        } else {
          setCarInfo({ model: 'Unknown', registrationPlate: carData.registrationPlate });
        }
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
        alert('Événement mis à jour avec succès!');
        // Redirection vers la liste des événements après modification
      {/*window.location.href = '/event';*/}
      } else {
        throw new Error('Failed to update event');
      }
    })
    .catch(error => console.error('Error updating event:', error));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
      Edit un événement
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          name="eventType"
          label="Type d'événement"
          value={event.eventType || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          name="note"
          label="Note"
          value={event.note || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <EventNoteRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
          
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
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
       <TextField
  name="voiture"
  label="Voiture"
  value={`${carInfo.model || 'Unknown'} - ${carInfo.registrationPlate}`}
  fullWidth
  margin="normal"
  required
  disabled
  InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
/>

        <Button type="submit" variant="contained" style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>Sauvegarder</Button>
        <Link to="/event">
          <Button variant="contained" style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditEventForm;
