import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, Typography, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';



const EditChargeForm = () => {
  const [charge, setCharge] = useState({
    date: '',
    description: '',
    cost: '',
    voiture: ''
  });

  const [carInfo, setCarInfo] = useState({
    model: '',
    registrationPlate: ''
  });

  const [errors, setErrors] = useState({
    date: '',
    cost: ''
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchCharge = async () => {
      try {
        const chargeResponse = await fetch(`http://localhost:3000/v1/api/charges/get/${id}`);
        const chargeData = await chargeResponse.json();
        //setCharge(chargeData);
        // Convertir la date récupérée en format ISO (AAAA-MM-JJ)
      const formattedDate = new Date(chargeData.date).toISOString().split('T')[0];
      
      setCharge({
        ...chargeData,
        date: formattedDate
      });

        const carResponse = await fetch(`http://localhost:3000/v1/api/voiture/get/${chargeData.voiture}`);
        const carData = await carResponse.json();
        //setCarInfo({ model: carData.model, registrationPlate: carData.registrationPlate });
        console.log('Car data:', carData);
        setCarInfo({
          model: carData.model.modelName, 
          registrationPlate: carData.registrationPlate
        });
      } catch (error) {
        console.error('Error fetching charge and car:', error);
      }
    };

    fetchCharge();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharge(prevCharge => ({
      ...prevCharge,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation des données
    const newErrors = {};
    if (new Date(charge.date) < new Date()) {
      newErrors.date = "La date doit être aujourd'hui ou ultérieure.";
    }
    if (isNaN(charge.cost) || Number(charge.cost) <= 0) {
      newErrors.cost = 'Le coût doit être un nombre positif';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    // Envoyer les données modifiées de la charge à l'API backend
    fetch(`http://localhost:3000/v1/api/charges/update/${id}`, {
      method: 'PATCH', // Utilisation de la méthode PATCH
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(charge)
    })
    .then(response => {
      if (response.ok) {
        alert('charge mis à jour avec succès!');
        // Redirection vers la liste des charges après modification
      {/*window.location.href = '/charge';*/}
      } else {
        throw new Error('Failed to update charge');
      }
    })
    .catch(error => console.error('Error updating charge:', error));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 }} align="center">
        Modifier une charge
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="date"
          label="Date"
          type="date"
          value={charge.date || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
          error={!!errors.date}
          helperText={errors.date}
        />
        <TextField
          name="description"
          label="Description"
          value={charge.description || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DescriptionRoundedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
                        ),
                    }}
        />
        <TextField
          name="cost"
          label="Coût"
          type="number"
          value={charge.cost || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.cost}
          helperText={errors.cost}
          InputProps={{
                        startAdornment: (
                            <PaidOutlinedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
                        ),
                    }}
        />
        <TextField
          name="voiture"
          label="Voiture"
          value={`${carInfo.model} - ${carInfo.registrationPlate}`}
          fullWidth
          margin="normal"
          required
          disabled
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <Button type="submit" variant="contained"   style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',}}>
        sauvegarder
        </Button>
        <Link to="/charge">
          <Button variant="contained"  style={{ marginLeft: '10px' ,marginTop: '20px' ,backgroundColor: ' #C50000', }}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditChargeForm;
