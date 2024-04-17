import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import { useHistory, useParams } from 'react-router-dom';

const EditLocation = () => {
  const [location, setLocation] = useState({
    StartDateLocation: '',
    EndDateLocation: '',
    NumberOfDays: 0,
    totalPrice: 0,
    locationTime: '',
    voiture: '',
    client: ''
  });

  const [errors, setErrors] = useState({
    StartDateLocation: '',
    EndDateLocation: '',
    NumberOfDays: '',
    totalPrice: '',
    locationTime: '',
    voiture: '',
    client: ''
  });

  const { id } = useParams();
  //const history = useHistory();

  useEffect(() => {
    // Fetch location data by ID from backend and set it to state
    fetch(`http://localhost:3000/v1/api/location/${id}`)
      .then(response => response.json())
      .then(data => setLocation(data))
      .catch(error => console.error('Error fetching location:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Reset error messages for the currently editing field
    setErrors(prevState => ({
      ...prevState,
      [name]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert locationTime string to Date object
    const formattedLocation = {
      ...location,
      locationTime: new Date(`1970-01-01T${location.locationTime}`)
    };
  
    try {
      // Submit data to backend
      const response = await fetch(`http://localhost:3000/v1/api/location/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedLocation)
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      alert('Location updated successfully!');
      // Redirect to locations page after successful update
      //history.push('/locations');
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location: ' + error.message);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <h2>Edit Location</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          name="StartDateLocation"
          label="Start Date"
          type="date"
          value={location.StartDateLocation}
          onChange={handleChange}
          error={!!errors.StartDateLocation}
          helperText={errors.StartDateLocation}
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
          error={!!errors.EndDateLocation}
          helperText={errors.EndDateLocation}
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
          error={!!errors.locationTime}
          helperText={errors.locationTime}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
        />
        <TextField
          name="voiture"
          label="Car ID"
          value={location.voiture}
          onChange={handleChange}
          error={!!errors.voiture}
          helperText={errors.voiture}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="client"
          label="Client ID"
          value={location.client}
          onChange={handleChange}
          error={!!errors.client}
          helperText={errors.client}
          fullWidth
          required
          margin="normal"
        />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Update Location
        </Button>
      </form>
    </Container>
  );
};

export default EditLocation;
