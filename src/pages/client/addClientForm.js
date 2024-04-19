import React, { useState } from 'react';
import { Button, Container, TextField } from '@mui/material';
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
        try {
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
        <h2>Ajouter Client</h2>
        <form onSubmit={handleSubmit}>
            <TextField   name="name" value={client.name} onChange={handleChange} placeholder="Name"  required  fullWidth   margin="normal" label="Name"/>
            <TextField name="firstName" value={client.firstName} onChange={handleChange}  placeholder="First Name"  required fullWidth   margin="normal" label="First Name" />
            <TextField  name="email"  value={client.email}  onChange={handleChange}  placeholder="Email"   required fullWidth    margin="normal"  label="Email"/>
            <TextField name="phoneNumber" value={client.phoneNumber} onChange={handleChange}   placeholder="Phone Number"  required  fullWidth  margin="normal" label="Phone Number"/>
            <TextField name="address" value={client.address} onChange={handleChange} placeholder="Address" required  fullWidth    margin="normal" label="Address"/>
            <TextField   name="contractNumber"   value={client.contractNumber}  onChange={handleChange}  placeholder="Contract Number" required fullWidth    margin="normal"  label="Contract Number"/>
            <TextField name="drivingLicense" value={client.drivingLicense} onChange={handleChange}  placeholder="Driving License" fullWidth    margin="normal" label="Driving License"/>
            <TextField name="nationalID" value={client.nationalID}     onChange={handleChange}   placeholder="National ID"    required fullWidth  margin="normal" label="National ID" />
            <TextField  type="file" name="images"   multiple  onChange={handleChange} fullWidth margin="normal"/>
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
