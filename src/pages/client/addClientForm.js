import React, { useState } from 'react';
import { Button, Container, TextField, Typography, Alert,Box,Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email'; // Importez l'icône Email
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContactEmergencyRoundedIcon from '@mui/icons-material/ContactEmergencyRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

function AddClientForm() {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'images') {
            setClient(prevState => ({
                ...prevState,
                images: [...prevState.images, ...e.target.files]
            }));
        } else {
            setClient(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
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

            const formData = new FormData();
            Object.keys(client).forEach(key => {
                if (key === 'images') {
                    Array.from(client.images).forEach(file => {
                        formData.append('images', file);
                    });
                } else {
                    formData.append(key, client[key]);
                }
            });

            const response = await fetch('http://localhost:3000/v1/api/client/create', {
                method: 'POST',
                body: formData
            });

            //if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();

      if (!response.ok) {
        // Si la réponse n'est pas ok, afficher le message d'erreur renvoyé par le serveur
        if (data.error === 'Le client existe déjà.') {
          throw new Error('Le client existe déjà.');
        }
        throw new Error(data.error || 'Failed to add car');
      }

            alert('Client added successfully!');
        {/*window.location.href = '/client';*/}

            // Réinitialisation du formulaire après ajout réussi
            setClient({
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
        } catch (error) {
            //alert('Failed to add client: ' + error.message);
            setErrors({ ...errors, serverError: 'Échec de l\'ajout de la voiture : ' + error.message });
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
            marginTop:'2%',
          }}>
        <Container  maxWidth="sm">
            <Typography variant="h4" sx={{ mb: 2 ,mt:2, color:'#455a64    ',fontFamily: 'monospace',fontWeight: 'bold', }} align="center">
                Ajouter Client
            </Typography>
            <form onSubmit={handleSubmit}>
                 {errors.serverError && (
                    <Alert severity="error">{errors.serverError}</Alert>
                )}
                <TextField
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                    placeholder=" Nom"
                    required
                    fullWidth
                    margin="normal"
                    label="Nom"
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                        startAdornment: (
                            <PersonIcon  style={{ opacity: 0.6 ,marginRight: '10px'}} />
                        ),
                      
                    }}
                />
                <TextField name="firstName" value={client.firstName} onChange={handleChange}  placeholder=" Prénom"  required fullWidth   margin="normal" label="Prénom" 

                        InputProps={{
                        startAdornment: (
                            <PersonIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}
                />
            <TextField  name="email"  value={client.email}  onChange={handleChange}  placeholder=" Email"   required fullWidth    margin="normal"  label="Email"   error={!!errors.email}
                    helperText={errors.email}   
                    InputProps={{
                        startAdornment: (
                            <AlternateEmailRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}/>
            <TextField name="phoneNumber" value={client.phoneNumber} onChange={handleChange}   placeholder=" Numéro de Téléphone"  required  fullWidth  margin="normal" label="Numéro de Téléphone"   error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber} 

                    InputProps={{
                        startAdornment: (
                            <PhoneIcon  style={{ opacity: 0.6 ,marginRight: '10px'}}/>
                        ),
                    }}
                    />
            <TextField name="address" value={client.address} onChange={handleChange} placeholder=" Address" required  fullWidth    margin="normal" label="Address"

InputProps={{
                        startAdornment: (
                            <HomeIcon  style={{ opacity: 0.6 ,marginRight: '10px'}}/>
                        ),
                    }}
            />
            <TextField   name="contractNumber"   value={client.contractNumber}  onChange={handleChange}  placeholder=" N° contrat" required fullWidth margin="normal" label="N° contrat"

InputProps={{
                        startAdornment: (
                            <AssignmentIcon style={{ opacity: 0.6 ,marginRight: '10px' }}/>
                        ),
                    }}
            />
            <TextField name="drivingLicense" value={client.drivingLicense} onChange={handleChange}  placeholder=" N° de permis de conduire  :  xx / xxxxxx" fullWidth    margin="normal" label="N° de permis de conduire"  error={!!errors.drivingLicense}
                    helperText={errors.drivingLicense}
                    InputProps={{
                        startAdornment: (
                            <CreditCardRoundedIcon style={{ opacity: 0.6 ,marginRight: '10px'}} />
                        ),
                    }}
                    />
            <TextField name="nationalID" value={client.nationalID}     onChange={handleChange}   placeholder=" CIN"    required fullWidth  margin="normal" label="CIN"   error={!!errors.nationalID}
                    helperText={errors.nationalID} 
                    InputProps={{
                        startAdornment: (
                            <ContactEmergencyRoundedIcon  style={{ opacity: 0.6 ,marginRight: '10px' }} />
                        ),
                    }}
                    />
                    
            <TextField  type="file" name="images"   multiple  onChange={handleChange} fullWidth margin="normal" required 
                InputProps={{
                        startAdornment: (
                            <ImageRoundedIcon style={{ opacity: 0.6,marginRight: '10px' }} />
                        ),
                    }}


            />
            <br/>
            <br/>

                <Button type="submit" variant="contained"  style={{marginTop: '10px', backgroundColor: ' rgb(108,151,187)',fontFamily: 'monospace'}}>
                Ajouter Client
                </Button>
                <Link to="/client">
                    <Button variant="contained" style={{ marginLeft: '10px',marginTop:'10px', backgroundColor: ' #C50000',fontFamily: 'monospace' }}>
                        Annuler
                    </Button>
                </Link>
            </form>
        </Container>
        </Box>
        </Grid>
        </Grid>
    );
}

export default AddClientForm;
