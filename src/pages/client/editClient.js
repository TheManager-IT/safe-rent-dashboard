import React, { useState, useEffect } from 'react';

const EditClientForm = ({ clientId }) => {
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

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/v1/api/client/${clientId}`);
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
  }, [clientId]);

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
      const response = await fetch(`http://localhost:3000/v1/api/client/update/${clientId}`, {
        method: 'PUT',
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
      <input
        name="name"
        value={client.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        name="firstName"
        value={client.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="phoneNumber"
        value={client.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        name="address"
        value={client.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        name="contractNumber"
        value={client.contractNumber}
        onChange={handleChange}
        placeholder="Contract Number"
        required
      />
      <input
        name="drivingLicense"
        value={client.drivingLicense}
        onChange={handleChange}
        placeholder="Driving License"
      />
      <input
        name="nationalID"
        value={client.nationalID}
        onChange={handleChange}
        placeholder="National ID"
        required
      />
      <br/>
      <button type="submit">Update Client</button>
    </form>
  );
};

export default EditClientForm;
