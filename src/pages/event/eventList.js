import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Scrollbar from '../../components/scrollbar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import '../tableStyles.css'; 
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';

import {
  Button,Stack,
  Container,
  Table,
  TableBody,
  IconButton,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  OutlinedInput,
  InputAdornment,
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

  /*useEffect(() => {
    // Trier les événements par date
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Sélectionner l'événement le plus proche
    const closestEvent = sortedEvents.find(event => new Date(event.date) >= new Date());

    // Afficher une alerte pour l'événement le plus proche
    if (closestEvent) {
      const formattedDate = formatDate(closestEvent.date);
      alert(`Prochain événement : ${closestEvent.eventType} le ${formattedDate}`);
    }
  }, [events]);*/
  
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
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };

  const filteredEvents = events.filter(event =>
    //(event.voiture && event.voiture.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.includes(searchTerm)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSortByDate = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(sortedEvents);
  };

  const isWithinAWeek = (date) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
    return new Date(date) >= today && new Date(date) <= nextWeek;
  };
  return (
    <Container>
              <Stack  className="Stack" direction="row" alignItems="center" justifyContent="space-between" mb={3} mt={13}>
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
        <div className="search" >
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
            <Button variant="contained" color="primary" onClick={handleSortByDate}>
            <SwapVertRoundedIcon sx={{ mr: 1 }} /> Trier par date
        </Button>
          
        </div>
        <Card>
       
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead className="table-header">
              <TableRow>
              <TableCell className="table-header-cell" >modele</TableCell>
                <TableCell className="table-header-cell" >Voiture</TableCell>
                <TableCell className="table-header-cell">Type d'événement</TableCell>
                <TableCell className="table-header-cell">Note</TableCell>
                <TableCell className="table-header-cell">Date</TableCell>
                <TableCell className="table-header-cell">Modifier</TableCell>
                <TableCell className="table-header-cell">Supprimer</TableCell>
              </TableRow>
            </TableHead>
            {/*<TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id}>
                   <TableCell>{event.voiture.model}</TableCell>

                  <TableCell>{event.voiture}</TableCell>
                  <TableCell>{event.eventType}</TableCell>
                  <TableCell>{event.note}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>

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
            </TableBody>*/}
            <TableBody>
  {events
    .filter(event => 
      (event.voiture && event.voiture.registrationPlate && event.voiture.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.voiture && event.voiture.model && event.voiture.model.modelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.includes(searchTerm)
    )
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((event) => (
      <TableRow key={event._id} style={{ background: isWithinAWeek(event.date) ? 'rgba(24, 119, 242, 0.17)' : 'inherit' }}>
        <TableCell>{event.voiture && event.voiture.model && event.voiture.model.modelName}</TableCell>
        <TableCell>{event.voiture ? event.voiture.registrationPlate : ''}</TableCell>
        <TableCell>{event.eventType}</TableCell>
        <TableCell>{event.note}</TableCell>
        <TableCell>{formatDate(event.date)}</TableCell>
        <TableCell>
          <Link to={`/editEvent/${event._id}`}>
            <IconButton variant="contained" color="primary" onClick={() => handleEdit(event._id)}> 
            <EditIcon />
            </IconButton>
          </Link>
        </TableCell>
        <TableCell>
          <IconButton variant="contained" onClick={() => handleDelete(event._id)} style={{ marginLeft: '10px' }}><DeleteIcon style={{ color: '#C50000' }}/></IconButton>
        </TableCell>
      </TableRow>
    ))}
</TableBody>

          </Table>
        </TableContainer>
       
        <TablePagination
          component="div"
          count={events.length} 
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0); 
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
     

      </Card>
    </Container>
  );
};

export default Events;
