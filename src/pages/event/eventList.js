import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [filterEventType, setFilterEventType] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/evenement')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleEdit = (id) => {
    // Handle edit logic
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/evenement/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
        } else {
          throw new Error('Failed to delete event');
        }
      })
      .catch(error => console.error('Error deleting event:', error));
    }
  };
  

  const handleAddEvent = () => {
    // Handle add event logic
  };

  const handleFilterEventTypeChange = (event) => {
    setFilterEventType(event.target.value);
  };

  const handleFilterDateChange = (event) => {
    setFilterDate(event.target.value);
  };

  const filteredEvents = events.filter(event =>
    event.eventType.toLowerCase().includes(filterEventType.toLowerCase()) &&
    event.date.includes(filterDate)
  );

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <OutlinedInput
          value={filterEventType}
          onChange={handleFilterEventTypeChange}
          placeholder="Type d'événement"
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
              {/* icon search */}
              </IconButton>
            </InputAdornment>
          }
        />
        <OutlinedInput
          value={filterDate}
          onChange={handleFilterDateChange}
          placeholder="Date"
        />
        <Link to="/addEvent">
          <Button variant="contained" color="primary" onClick={handleAddEvent}>
            Ajouter
          </Button>
        </Link> 
      </div>
     
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Voiture</TableCell>
              <TableCell>Type d'événement</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event._id}</TableCell>
                <TableCell>{event.voiture}</TableCell>
                <TableCell>{event.eventType}</TableCell>
                <TableCell>{event.note}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>
                  <Link to={`/editEvent/${event._id}`}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(event._id)}>
                      Modifier
                    </Button>
                  </Link>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(event._id)} style={{ marginLeft: '10px' }}>
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Events;
