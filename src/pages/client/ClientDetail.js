// Import des composants nécessaires
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Document, Page, Text, PDFDownloadLink, Image } from '@react-pdf/renderer';
import './clientDetail.css'; 
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';

const ClientDetail = () => {
  const [client, setClient] = useState(null);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    name: true,
    firstName: true,
    email: true,
    phoneNumber: true,
    nationalID: true,
    address: true,
    contractNumber: true,
    drivingLicense: true,
    locations: true
  });

  const { id } = useParams(); // Récupérer l'ID du client depuis les paramètres d'URL

  useEffect(() => {
    // Récupérer les détails du client depuis l'API backend
    fetch(`http://localhost:3000/v1/api/client/get/${id}`)
      .then(response => response.json())
      .then(data => setClient(data))
      .catch(error => console.error('Error fetching client details:', error));
  }, [id]);

  const generatePDF = () => {
    setOpen(true);
  };

  if (!client) {
    return <div>Loading...</div>;
  }

  const MyDocument = () => (
    <Document>
      <Page>
      
        {fields.name && <Text>Nom: {client.name}</Text>}
        {fields.firstName && <Text>Prénom: {client.firstName}</Text>}
        {fields.email && <Text>Email: {client.email}</Text>}
        {fields.phoneNumber && <Text>Numéro de Téléphone: {client.phoneNumber}</Text>}
        {fields.nationalID && <Text>CIN: {client.nationalID}</Text>}
        {fields.address && <Text>Adresse: {client.address}</Text>}
        {fields.contractNumber && <Text>Numéro Contrat: {client.contractNumber}</Text>}
        {fields.drivingLicense && <Text>numéro de Permis: {client.drivingLicense}</Text>}
        {fields.locations && <Text>Locations : {client.locations}</Text>}
        {client.images.map((image, index) => (
            <Image key={index} src={`http://localhost:3000/uploads/${image}`} style={{ width: 200, height: 100 }} />
          ))}
        
      </Page>
    </Document>
  );

  const handleFieldChange = (field) => {
    setFields(prevFields => ({
      ...prevFields,
      [field]: !prevFields[field]
    }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Détails du client
      </Typography>
      <div>
      {client.images.map((image, index) => (
  <img key={index} src={`http://localhost:3000/uploads/${image}`}  alt={`client Image ${index}`} />
))}

      
        <Typography>Nom: {client.name}</Typography>
        <Typography>Prénom: {client.firstName}</Typography>
        <Typography>Email: {client.email}</Typography>
        <Typography>Numéro de Téléphone: {client.phoneNumber}</Typography>
        <Typography>CIN: {client.nationalID}</Typography>
        <Typography>Adresse: {client.address}</Typography>
        <Typography>numéro Contrat: {client.contractNumber}</Typography>
        <Typography>numéro de Permis: {client.drivingLicense}</Typography>
        <Typography>locations :{client.locations}</Typography>
        <Button variant="contained" color="info" onClick={generatePDF}>
        <PictureAsPdfRoundedIcon sx={{ mr: 1 }} /> Génerer rapport PDF
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Choisir les champs pour le  rapport PDF</DialogTitle>
          <DialogContent>
            {Object.keys(fields).map((field, index) => (
              <div key={index}>
                <Checkbox checked={fields[field]} onChange={() => handleFieldChange(field)} />
                <Typography>{field}</Typography>
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <PDFDownloadLink document={<MyDocument />} fileName="client-details.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'Chargement du PDF...' : <GetAppRoundedIcon sx={{ mr: 2 ,ml:2 }} /> 
              }
            </PDFDownloadLink>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default ClientDetail;
