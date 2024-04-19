import React, { useState, useEffect } from 'react';
import { Button, Typography,Container, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const EditLocation = () => {
  const { id } = useParams(); //  l'ID de la location à modifier
  const [location, setLocation] = useState({
    StartDateLocation: '',
    EndDateLocation: '',
    NumberOfDays: 0,
    totalPrice: 0,
    locationTime: '',
    voiture: '',
    client: ''
  });
  const [voitures, setVoitures] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`http://localhost:3000/v1/api/location/get/${id}`);
        if (!response.ok) throw new Error('Failed to fetch location');
        const data = await response.json();
        setLocation(data);
        setSelectedCar(data.voiture);
        setSelectedClient(data.client);
      } catch (error) {
        console.error('Error fetching location:', error);
        // Gérer l'erreur de récupération des données de la location
      }
    };

    const fetchVoitures = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/api/voiture');
        if (!response.ok) throw new Error('Failed to fetch voitures');
        const data = await response.json();
        setVoitures(data);
      } catch (error) {
        console.error('Error fetching voitures:', error);
        // Gérer l'erreur de récupération des voitures
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/api/client');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Gérer l'erreur de récupération des clients
      }
    };

    fetchLocation();
    fetchVoitures();
    fetchClients();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCarChange = (e) => {
    setSelectedCar(e.target.value);
    setLocation(prevState => ({
      ...prevState,
      voiture: e.target.value
    }));
  };

  const handleClientChange = (event, value) => {
    setSelectedClient(value);
    setLocation(prevState => ({
      ...prevState,
      client: value ? value.id : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:3000/v1/api/location/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      alert('Location updated successfully!');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
     
      <Typography variant="h4" sx={{ mb: 2 }}>
     Edit location
      </Typography>
      <form onSubmit={handleSubmit}>
        
        <TextField
          name="StartDateLocation"
          label="Date de début"
          type="date"
          value={location.StartDateLocation}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="EndDateLocation"
          label="Date de fin"
          type="date"
          value={location.EndDateLocation}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="locationTime"
          label="Heure de la location"
          type="time"
          value={location.locationTime}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          select
          label="Voiture"
          value={selectedCar}
          onChange={handleCarChange}
          fullWidth
          margin="normal"
        >
          {voitures.map((car) => (
            <MenuItem key={car._id} value={car._id}>
              {car.model} - {car.registrationPlate}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          options={clients}
          getOptionLabel={(option) => `${option.name} ${option.firstName} - ${option.nationalID}`}
          renderInput={(params) => <TextField {...params} label="Client" fullWidth margin="normal" />}
          value={selectedClient}
          onChange={handleClientChange}
        />

       
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Modifier la location
        </Button>
        <Link to="/locations">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditLocation;
