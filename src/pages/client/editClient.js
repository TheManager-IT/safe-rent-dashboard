import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, Typography,Grid,Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
const EditClientForm = () => {
  const [client, setClient] = useState({
    name: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    address: '',
    contractNumber: '',
    drivingLicense: '',
    nationalID: '',
    images: []
  });

  const [errors, setErrors] = useState({
    name: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    address: '',
    contractNumber: '',
    drivingLicense: '',
    nationalID: '',
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/v1/api/client/get/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client data');
        }
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    };

    fetchClientData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const imageFiles = Array.from(files);
      setClient(prevClient => ({
        ...prevClient,
        images: [...prevClient.images, ...imageFiles] // Ajoutez les nouveaux fichiers à la liste existante
      }));
    } else {
      setClient(prevClient => ({
        ...prevClient,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des données
    const newErrors = {};

    if (!client.name.trim()) {
      newErrors.name = 'Veuillez saisir le nom du client';
    }

    if (!client.firstName.trim()) {
      newErrors.firstName = 'Veuillez saisir le prénom du client';
    }

    if (!client.email.trim()) {
      newErrors.email = 'Veuillez saisir l\'adresse e-mail du client';
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(client.email)) {
      newErrors.email = 'Adresse e-mail invalide. Veuillez saisir une adresse email au format exemple@domaine.com';
    }

    if (!client.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Veuillez saisir le numéro de téléphone du client';
    } else if (!/^[9254]\d{7}$/.test(client.phoneNumber)) {
      newErrors.phoneNumber = 'Numéro de téléphone invalide. Veuillez saisir un numéro de téléphone de 8 chiffres commençant par 9, 2, 5 ou 4.';
    }

    if (!client.address.trim()) {
      newErrors.address = 'Veuillez saisir l\'adresse du client';
    }

    if (!client.contractNumber.trim()) {
      newErrors.contractNumber = 'Veuillez saisir le numéro de contrat du client';
    }

    if (!client.drivingLicense.trim()) {
      newErrors.drivingLicense = 'Veuillez saisir le numéro de permis de conduire du client';
    } else if (!/^[0-9]{2}\s\/\s[0-9]{6}$/.test(client.drivingLicense)) {
      newErrors.drivingLicense = 'Numéro de permis de conduire invalide. Veuillez saisir un numéro de permis au format 00 / 000000.';
    }

    if (!client.nationalID.trim()) {
      newErrors.nationalID = 'Veuillez saisir le numéro d\'identité nationale du client';
    } else if (!/^\d{8}$/.test(client.nationalID)) {
      newErrors.nationalID = 'Numéro d\'identité nationale invalide. Veuillez saisir un numéro d\'identité nationale à 8 chiffres.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Traitement pour la soumission du formulaire
    const formData = new FormData();
    formData.append('name', client.name);
    formData.append('firstName', client.firstName);
    formData.append('email', client.email);
    formData.append('phoneNumber', client.phoneNumber);
    formData.append('address', client.address);
    formData.append('contractNumber', client.contractNumber);
    formData.append('drivingLicense', client.drivingLicense);
    formData.append('nationalID', client.nationalID);
    client.images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`http://localhost:3000/v1/api/client/update/${id}`, {
        method: 'PATCH',
        body: formData
      });
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      alert('Client updated successfully!');
    {/*window.location.href = '/client';*/}
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client: ' + error.message);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
    <Grid item>
      <Box sx={{
        backgroundColor: 'rgba(255, 255, 255, 1)', 
        borderRadius: '20px', 
        padding: '20px 20px 30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop:'5%',
      }}>
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 2 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }} align="center">
        Modifier Client
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField name="name" label="Nom" value={client.name || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name}    InputProps={{
                        startAdornment: (
                            <PersonIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}/>
        <TextField name="firstName" label="Prénom" value={client.firstName || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.firstName} helperText={errors.firstName}    InputProps={{
                        startAdornment: (
                            <PersonIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }} />
        <TextField name="email" label="E-mail" value={client.email || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.email} helperText={errors.email} InputProps={{
                        startAdornment: (
                            <AlternateEmailRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}/>
        <TextField name="phoneNumber" label="Numéro de téléphone" value={client.phoneNumber || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.phoneNumber} helperText={errors.phoneNumber}   InputProps={{
                        startAdornment: (
                            <PhoneIcon  style={{ opacity: 0.6 ,marginRight: '10px'}}/>
                        ),
                    }}/>
        <TextField name="address" label="Adresse" value={client.address || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.address} helperText={errors.address} InputProps={{
                        startAdornment: (
                            <HomeIcon  style={{ opacity: 0.6 ,marginRight: '10px'}}/>
                        ),
                    }} />
        <TextField name="contractNumber" label="Numéro de contrat" value={client.contractNumber || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.contractNumber} helperText={errors.contractNumber} 
InputProps={{
                        startAdornment: (
                            <AssignmentIcon style={{ opacity: 0.6 ,marginRight: '10px' }}/>
                        ),
                    }} />
        <TextField name="drivingLicense" label="Permis de conduire" value={client.drivingLicense || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.drivingLicense} helperText={errors.drivingLicense} InputProps={{
                        startAdornment: (
                            <CreditCardRoundedIcon style={{ opacity: 0.6 ,marginRight: '10px'}} />
                        ),
                    }}/>
        <TextField name="nationalID" label="carte d'identité" value={client.nationalID || ''} onChange={handleChange} fullWidth margin="normal" required error={!!errors.nationalID} helperText={errors.nationalID}
            InputProps={{
                        startAdornment: (
                            <ContactEmergencyRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}
         />
        <TextField type="file" name="images" onChange={handleChange} fullWidth margin="normal" multiple   InputProps={{
                        startAdornment: (
                            <ImageRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}/>
        <br />
        <Button type="submit" variant="contained"  style={{marginTop: '20px', backgroundColor: ' rgb(108,151,187)',fontFamily: 'monospace'}}>sauvegarder</Button>
        <Link to="/client">
          <Button variant="contained"  style={{ marginLeft: '10px',marginTop:'20px', backgroundColor: ' #C50000',fontFamily: 'monospace' }}>
          Annuler
          </Button>
        </Link>
      </form>
    </Container>
    </Box> </Grid></Grid>
  );
};

export default EditClientForm;
