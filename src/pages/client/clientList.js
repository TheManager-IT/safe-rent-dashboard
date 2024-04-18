import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';


const Clients = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [filterName, setFilterName] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterCIN, setFilterCIN] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/v1/api/client')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleEdit = (id) => {
    setSelectedClientId(id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/client/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setClients(prevClients => prevClients.filter(client => client._id !== id));
        } else {
          throw new Error('Failed to delete client');
        }
      })
      .catch(error => console.error('Error deleting client:', error));
    }
  };

  const handleAddClient = () => {
    // Logic for adding a new client
  };

  const handleFilterNameChange = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterPhoneChange = (event) => {
    setFilterPhone(event.target.value);
  };

  const handleFilterEmailChange = (event) => {
    setFilterEmail(event.target.value);
  };

  const handleFilterCINChange = (event) => {
    setFilterCIN(event.target.value);
  };

  const handleFilterAddressChange = (event) => {
    setFilterAddress(event.target.value);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(filterName.toLowerCase()) &&
    client.firstName.toLowerCase().includes(filterName.toLowerCase()) &&
    client.phoneNumber.toLowerCase().includes(filterPhone.toLowerCase()) &&
    client.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
    client.nationalID.toLowerCase().includes(filterCIN.toLowerCase()) &&
    client.address.toLowerCase().includes(filterAddress.toLowerCase())
  );

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <OutlinedInput
          value={filterName}
          onChange={handleFilterNameChange}
          placeholder="Nom ou prénom"
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
              {/* icon search */}
              </IconButton>
              
            </InputAdornment>
          }
        />
        <OutlinedInput
          value={filterPhone}
          onChange={handleFilterPhoneChange}
          placeholder="Numéro de téléphone"
        />
        <OutlinedInput
          value={filterEmail}
          onChange={handleFilterEmailChange}
          placeholder="Email"
        />
        <OutlinedInput
          value={filterCIN}
          onChange={handleFilterCINChange}
          placeholder="CIN"
        />
        <OutlinedInput
          value={filterAddress}
          onChange={handleFilterAddressChange}
          placeholder="Adresse"
        />
        <Link to="/addClient">
          <Button variant="contained" color="primary" onClick={handleAddClient}>
            Ajouter
          </Button>
        </Link> 
      </div>
     
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Numéro de Téléphone</TableCell>
              <TableCell>CIN</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Modifier</TableCell>
              <TableCell>Supprimer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client._id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>{client.nationalID}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>
                  <Link to={`/editClient/${client._id}`}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(client._id)}>
                      Modifier
                    </Button>
                  </Link>
                  </TableCell>
                  <TableCell>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(client._id)} >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Clients
