import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, TextField, MenuItem, Autocomplete } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

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
  const [errors, setErrors] = useState({});
  const { id } = useParams(); // Utilisation de useParams pour obtenir l'ID de la location à modifier

  useEffect(() => {
    fetchlocation();
    fetchVoitures();
    fetchClients();
  }, [id]);

  const fetchlocation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/v1/api/location/get/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      const data = await response.json();
      setLocation(data);
    } catch (error) {
      console.error('Error fetching location:', error);
      //setError('Erreur lors du chargement du location');
    }
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
      const response = await fetch(`http://localhost:3000/v1/api/location/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(location)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = extractErrorMessage(errorData.error);
        throw new Error(errorMessage); // Lève une erreur avec le message d'erreur renvoyé par le serveur
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

      alert('Location modifiée avec succès !');
    } catch (error) {
      console.error('Error editing location:', error);
      alert('Échec de la modification de la location : ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
        Modifier une location
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
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Modifier la location
        </Button>
        <Link to="/locations">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px', marginTop: '20px' }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditLocationForm;
