import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, MenuItem } from '@mui/material';
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

  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/v1/api/location/get/${id}`)
      .then(response => response.json())
      .then(data => setLocation(data))
      .catch(error => console.error('Error fetching location:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation(prevLocation => ({
      ...prevLocation,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3000/v1/api/location/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(location)
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/locations';
      } else {
        throw new Error('Failed to update location');
      }
    })
    .catch(error => console.error('Error updating location:', error));
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
          value={location.locationTime}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="NumberOfDays"
          label="Number of Days"
          type="number"
          value={location.NumberOfDays}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="totalPrice"
          label="Total Price"
          type="number"
          value={location.totalPrice}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="voiture"
          label="Car"
          value={location.voiture}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="client"
          label="Client"
          value={location.client}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Save
        </Button>
      </form>
    </Container>
  );
};

export default EditLocationForm;
