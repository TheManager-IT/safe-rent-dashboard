import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem,Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const EditLocationForm = () => {
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
  
  const { id } = useParams();

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await fetch(`http://localhost:3000/v1/api/location/get/${id}`);
      const data = await response.json();
      setLocation(data);
    };

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
      client: value ? value._id : '' 
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
      window.location.href = '/locations';
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location: ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      
      <Typography variant="h4" sx={{ mb: 2 }}>
     Edit  location
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="StartDateLocation"
          label="Start Date"
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
          label="End Date"
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
          label="Location Time"
          type="time"
          value={location.locationTime || ''}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          select
          label="Car"
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
          Save
        </Button>
        <Link to="/locations">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px', marginTop: '20px' }}>
            Cancel
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditLocationForm;
