import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, MenuItem } from '@mui/material';

const AddLocationForm = () => {
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
    const fetchVoitures = async () => {
      const response = await fetch('http://localhost:3000/v1/api/voiture');
      const data = await response.json();
      setVoitures(data);
    };

    const fetchClients = async () => {
      const response = await fetch('http://localhost:3000/v1/api/client');
      const data = await response.json();
      setClients(data);
    };

    fetchVoitures();
    fetchClients();
  }, []);

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

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
    setLocation(prevState => ({
      ...prevState,
      client: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/v1/api/location/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      alert('Location added successfully!');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Failed to add location: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <h2>Ajouter une location</h2>
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
          required
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

        <TextField
          select
          label="Client"
          value={selectedClient}
          onChange={handleClientChange}
          fullWidth
          margin="normal"
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name} {client.firstName} - {client.nationalID}
            </MenuItem>
          ))}
        </TextField>
        
     
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Ajouter la location
        </Button>
      </form>
    </Container>
  );
};

export default AddLocationForm;
