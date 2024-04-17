import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const EditClientForm = () => {
  const [client, setClient] = useState({
    name: '',
    firstName: '',
    email: '',
    phoneNumber: ' ',
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
        const response = await fetch(`http://localhost:3000/v1/api/client/${id}`);
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
    const { name, value } = e.target;
    setClient(prevClient => ({
      ...prevClient,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/v1/api/client/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client)
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
    <form onSubmit={handleSubmit}>
      <TextField
        name="name"
        label="Name"
        value={client.name || ''}
        onChange={handleChange}
      />
      <TextField
        name="firstName"
        label="First Name"
        value={client.firstName || ''}
        onChange={handleChange}
      />
      <TextField
        name="email"
        label="Email"
        value={client.email || ''}
        onChange={handleChange}
      />
      <TextField
        name="phoneNumber"
        label="Phone Number"
        value={client.phoneNumber || ''}
        onChange={handleChange}
      />
      <TextField
        name="address"
        label="Address"
        value={client.address || ''}
        onChange={handleChange}
      />
      <TextField
        name="contractNumber"
        label="Contract Number"
        value={client.contractNumber || ''}
        onChange={handleChange}
      />
      <TextField
        name="drivingLicense"
        label="Driving License"
        value={client.drivingLicense || ''}
        onChange={handleChange}
      />
      <TextField
        name="nationalID"
        label="National ID"
        value={client.nationalID || ''}
        onChange={handleChange}
      />
      <br/>
      <Button type="submit" variant="contained" color="primary">Update Client</Button>
    </form>
  );
};

export default EditClientForm;
