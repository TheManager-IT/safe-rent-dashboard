import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, TextField, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

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
        images: imageFiles
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
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client: ' + error.message);
    }
  };

  return (
    <Container>
      <h2>Edit Client</h2>
      <form onSubmit={handleSubmit}>
        <TextField name="name" label="Name" value={client.name || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="firstName" label="First Name" value={client.firstName || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="email" label="Email" value={client.email || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="phoneNumber" label="Phone Number" value={client.phoneNumber || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="address" label="Address" value={client.address || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="contractNumber" label="Contract Number" value={client.contractNumber || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="drivingLicense" label="Driving License" value={client.drivingLicense || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField name="nationalID" label="National ID" value={client.nationalID || ''} onChange={handleChange} fullWidth margin="normal" required />
        <TextField type="file" name="images" onChange={handleChange} fullWidth margin="normal" multiple />
        <br />
        <Button type="submit" variant="contained" color="primary">Update Client</Button>
        <Link to="/client">
          <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Cancel
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default EditClientForm;
