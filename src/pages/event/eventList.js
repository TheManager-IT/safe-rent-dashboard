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
  IconButton,Typography,
} from '@mui/material';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter(event =>
    event.voiture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.includes(searchTerm)
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
       Les événements
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <OutlinedInput
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Rechercher par type, date, note ou voiture"
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
                {/* icon search */}
              </IconButton>
            </InputAdornment>
          }
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
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
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
                  </TableCell>
                  <TableCell>
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
