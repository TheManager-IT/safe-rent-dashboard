import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, TextField, MenuItem, Autocomplete } from '@mui/material';
import { Link } from 'react-router-dom';

import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import PersonIcon from '@mui/icons-material/Person';
import AlarmRoundedIcon from '@mui/icons-material/AlarmRounded';

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
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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

  const handleClientChange = (event, value) => {
    setSelectedClient(value);
    setLocation(prevState => ({
      ...prevState,
      client: value ? value._id : ''
    }));
  };

  const extractErrorMessage = (errorString) => {
    const regex = /La voiture est déjà réservée pour cette période\.$/;
    const match = errorString.match(regex);
    return match ? match[0] : 'Erreur inconnue lors de l\'ajout de la location.';
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  // Crée une nouvelle instance de Date pour "aujourd'hui" et remet les heures, minutes, secondes et millisecondes à zéro
const today = new Date();
today.setHours(0, 0, 0, 0);

// Fait de même pour la date de début reçue
const startDate = new Date(location.StartDateLocation);
startDate.setHours(0, 0, 0, 0);

    // Contrôles de saisie
    const newErrors = {};
  
    if (!location.StartDateLocation || startDate < today) {
      newErrors.StartDateLocation = 'La date de début doit être aujourd\'hui ou ultérieure.';
    }
  
    if (location.StartDateLocation >= location.EndDateLocation) {
      newErrors.EndDateLocation = 'La date de fin doit être ultérieure à la date de début.';
    }
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/v1/api/location/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });
      //if (!response.ok) throw new Error('Network response was not ok.');
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erreur inconnue lors de l\'ajout de la location.';
        if (errorMessage === 'Des événements sont planifiés pour cette voiture pendant les dates de location.') {
          // Afficher l'erreur à l'utilisateur
          setServerError(errorMessage);
        } else {
          // Autres erreurs
          throw new Error(errorMessage);
        }
        return;
      }
     
      setLocation({
        StartDateLocation: '',
        EndDateLocation: '',
        NumberOfDays: 0,
        totalPrice: 0,
        locationTime: '',
        voiture: '',
        client: ''
      });
      setSelectedCar('');
      setSelectedClient('');
      setErrors({});
  
      alert('Location ajoutée avec succès !');
    } catch (error) {
      console.error('Error adding location:', error);
      alert('Échec de l\'ajout de la location : ' + error.message);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
        Ajouter une location
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
          error={!!errors.StartDateLocation}
          helperText={errors.StartDateLocation}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <TextField
          name="EndDateLocation"
          label="Date de fin"
          type="date"
          value={location.EndDateLocation}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.EndDateLocation}
          helperText={errors.EndDateLocation}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <TextField
          name="locationTime"
          label="Heure de la location"
          type="time"
          value={location.locationTime || ''}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <AlarmRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <TextField
  select
  label="Voiture"
  value={selectedCar}
  onChange={handleCarChange}
  fullWidth
  margin="normal"
  InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
>
  {voitures.map((car) => (
    <MenuItem key={car._id} value={car._id}>
      {car.model.modelName} - {car.registrationPlate}
    </MenuItem>
  ))}
</TextField>

        <Autocomplete
          options={clients}
          getOptionLabel={(option) => `${option.name} ${option.firstName} - ${option.nationalID}`}
          renderInput={(params) => <TextField {...params} label="Client" fullWidth margin="normal" />}
          value={selectedClient}
          onChange={handleClientChange}
          InputProps={{
                        startAdornment: (
                            <PersonIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <Button type="submit" variant="contained"  style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>
          Ajouter la location
        </Button>
        <Link to="/locations">
          <Button variant="contained" style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000', }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default AddLocationForm;
