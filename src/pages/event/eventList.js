import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from '../../components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

import {
  Button,Stack,
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
  Typography,
  TablePagination,Card,
} from '@mui/material';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Les événements
        </Typography>
        <Link to="/addEvent">
            <Button variant="contained"   style={{ backgroundColor: '#222831', color: 'white' }}
  startIcon={<AddIcon />} onClick={handleAddEvent}>
              Ajouter événement
            </Button>
          </Link>

        </Stack>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <OutlinedInput
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Rechercher événement..."
            startAdornment={
    <InputAdornment position="start">
      <SearchIcon />
    </InputAdornment>
  }
          />
          
        </div>
        <Card>
        <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
               
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
        </Scrollbar>
        <TablePagination
          component="div"
          count={events.length} // total number of rows
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); // Reset page to 0 when rowsPerPage changes
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
     

      </Card>
    </Container>
  );
};

export default Events;
