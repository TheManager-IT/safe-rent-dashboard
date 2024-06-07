import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, TextField, Typography, MenuItem ,Box,Grid} from '@mui/material';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';


const AddChargeForm = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [cars, setCars] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/api/voiture');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleCostChange = (event) => {
    setCost(event.target.value);
  };

  const handleCarChange = (event) => {
    setSelectedCar(event.target.value);
  };

  const resetForm = () => {
    setDate('');
    setDescription('');
    setCost('');
    setSelectedCar('');
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (!date) {
      newErrors.date = 'Veuillez sélectionner une date';
      isValid = false;
    }

    if (!description) {
      newErrors.description = 'Veuillez saisir une description';
      isValid = false;
    }

    if (!cost) {
      newErrors.cost = 'Veuillez saisir un coût';
      isValid = false;
    } else if (isNaN(cost) || Number(cost) <= 0) {
      newErrors.cost = 'Le coût doit être un nombre positif';
      isValid = false;
    }

    if (!selectedCar) {
      newErrors.selectedCar = 'Veuillez sélectionner une voiture';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/v1/api/charges/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, description, cost, voiture: selectedCar }),
      });
      if (!response.ok) {
        throw new Error('Failed to add charge');
      }
      alert('Charge added successfully!');
    {/*window.location.href = '/charge';*/}
      resetForm();
    } catch (error) {
      console.error('Error adding charge:', error);
      alert('Failed to add charge: ' + error.message);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
    <Grid item>
      <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        borderRadius: '20px', 
        padding: '20px 20px 50px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'15%',
      }}>
    <Container maxWidth="sm">
      <Typography variant="h4"  sx={{ mb: 2 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }} align="center">
        Ajouter une charge
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.date}
          helperText={errors.date}
          InputProps={{
                        startAdornment: (
                            <DateRangeRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
          margin="normal"
          InputProps={{
                        startAdornment: (
                            <DescriptionRoundedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
                        ),
                    }}
          error={!!errors.description}
          helperText={errors.description}
          
                   
        />
        <TextField
          label="Coût"
          type="number"
          value={cost}
          onChange={handleCostChange}
          fullWidth
          margin="normal"
          error={!!errors.cost}
          helperText={errors.cost}
          InputProps={{
                        startAdornment: (
                            <PaidOutlinedIcon  style={{ opacity: 0.6  ,marginRight: '10px'}} />
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
          error={!!errors.selectedCar}
          helperText={errors.selectedCar}
          InputProps={{
                        startAdornment: (
                            <DirectionsCarRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
        >
          {cars.map((car) => (
            <MenuItem key={car._id} value={car._id}>
              {car.model.modelName} - {car.registrationPlate}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained"  style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)', fontFamily: 'monospace'}}>
          Ajouter la charge
        </Button>
        <Link to="/charge">
          <Button variant="contained" style={{ marginLeft: '10px' ,marginTop: '20px',backgroundColor: ' #C50000', fontFamily: 'monospace'}}>
            Annuler
          </Button>
        </Link>
      </form>
    </Container>
    </Box>
    </Grid></Grid>
  );
};

export default AddChargeForm;
