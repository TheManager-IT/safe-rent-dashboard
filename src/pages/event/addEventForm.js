import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField } from '@mui/material';

const AddEventForm = () => {
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [car, setCar] = useState('');

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
    setCar(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/v1/api/evenement/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventType, note, date, voiture: car }), // Inclure la voiture dans l'objet JSON
      });
      if (!response.ok) {
        throw new Error('Failed to add event');
      }
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event: ' + error.message);
    }
  };

  return (
    <Container>
      <h2>Ajouter un événement</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Type d'événement"
          value={eventType}
          onChange={handleEventTypeChange}
          fullWidth
          margin="normal"
        />
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
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Voiture"
          value={car}
          onChange={handleCarChange}
          fullWidth
          margin="normal"
        />
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
