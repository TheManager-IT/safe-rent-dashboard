import React, { useState } from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

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
                newErrors.email = 'Adresse e-mail invalide';
            }

            if (!client.phoneNumber.trim()) {
                newErrors.phoneNumber = 'Veuillez saisir le numéro de téléphone du client';
            } else if (!/^[9254]\d{7}$/.test(client.phoneNumber)) {
                newErrors.phoneNumber = 'Numéro de téléphone invalide';
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
                newErrors.drivingLicense = 'Numéro de permis de conduire invalide';
            }

            if (!client.nationalID.trim()) {
                newErrors.nationalID = 'Veuillez saisir le numéro d\'identité nationale du client';
            } else if (!/^\d{8}$/.test(client.nationalID)) {
                newErrors.nationalID = 'Numéro d\'identité nationale invalide';
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

            if (!response.ok) throw new Error('Network response was not ok.');

            alert('Client added successfully!');
            window.location.href = '/client';

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
            alert('Failed to add client: ' + error.message);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mb: 2 }}>
                Ajouter Client
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    value={client.name}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                    fullWidth
                    margin="normal"
                    label="Nom"
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField name="firstName" value={client.firstName} onChange={handleChange}  placeholder="First Name"  required fullWidth   margin="normal" label="First Name" />
            <TextField  name="email"  value={client.email}  onChange={handleChange}  placeholder="Email"   required fullWidth    margin="normal"  label="Email"   error={!!errors.email}
                    helperText={errors.email}/>
            <TextField name="phoneNumber" value={client.phoneNumber} onChange={handleChange}   placeholder="Phone Number"  required  fullWidth  margin="normal" label="Phone Number"   error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber} />
            <TextField name="address" value={client.address} onChange={handleChange} placeholder="Address" required  fullWidth    margin="normal" label="Address"/>
            <TextField   name="contractNumber"   value={client.contractNumber}  onChange={handleChange}  placeholder="Contract Number" required fullWidth    margin="normal"  label="Contract Number"/>
            <TextField name="drivingLicense" value={client.drivingLicense} onChange={handleChange}  placeholder="Driving License  :  xx / xxxxxx" fullWidth    margin="normal" label="Driving License"  error={!!errors.drivingLicense}
                    helperText={errors.drivingLicense}/>
            <TextField name="nationalID" value={client.nationalID}     onChange={handleChange}   placeholder="National ID"    required fullWidth  margin="normal" label="National ID"   error={!!errors.nationalID}
                    helperText={errors.nationalID} />
            <TextField  type="file" name="images"   multiple  onChange={handleChange} fullWidth margin="normal" required />
            <br/>
            <br/>

                <Button type="submit" variant="contained" color="primary">
                    Add Client
                </Button>
                <Link to="/client">
                    <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
                        Annuler
                    </Button>
                </Link>
            </form>
        </Container>
    );
}

export default AddClientForm;
