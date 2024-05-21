// Import des composants nécessaires
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Document, Page, Text, PDFDownloadLink, Image, View, StyleSheet } from '@react-pdf/renderer';
import './clientDetail.css'; 
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../cars/CarDetail.css'; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

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
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };
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

  const styles = StyleSheet.create({
    table: {
      display: "table",
      width: "auto",
      margin: "10px 0"
    },
    tableRow: {
      flexDirection: "row"
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: '#bfbfbf',
      padding: 5
    },
    tableHeader: {
      backgroundColor: '#f3f3f3',
      fontWeight: 'bold'
    },
    tableCell: {
      margin: 5,
      fontSize: 10
    },
    image: {
      width: 200,
      height: 100
    }
  });

  const MyDocument = () => (
    <Document>
      <Page>
        <View>
          {fields.name && <Text>Nom: {client.name}</Text>}
          {fields.firstName && <Text>Prénom: {client.firstName}</Text>}
          {fields.email && <Text>Email: {client.email}</Text>}
          {fields.phoneNumber && <Text>Numéro de Téléphone: {client.phoneNumber}</Text>}
          {fields.nationalID && <Text>CIN: {client.nationalID}</Text>}
          {fields.address && <Text>Adresse: {client.address}</Text>}
          {fields.contractNumber && <Text>Numéro Contrat: {client.contractNumber}</Text>}
          {fields.drivingLicense && <Text>numéro de Permis: {client.drivingLicense}</Text>}
        </View>
        {fields.locations && (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Date de Début</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Date de Fin</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Nombre de Jours</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Voiture</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Prix Total</Text></View>
            </View>
            {client.locations.map((location, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(location.StartDateLocation)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(location.EndDateLocation)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.NumberOfDays}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.voiture.registrationPlate} - {location.voiture.model.modelName}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.totalPrice}</Text></View>
              </View>
            ))}
          </View>
        )}
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
  const handleEdit = (id) => {
    // Logique de modification
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/client/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setClient(null);
        } else {
          throw new Error('Failed to delete client');
        }
      })
      .catch(error => console.error('Error deleting client:', error));
    }
  };
  console.log(client.locations);
  console.log(client.locations.totalPrice);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Détails du client
      </Typography>
      <div>
  
        <Typography > <b>Nom: </b> {client.name}</Typography>
        <Typography> <b>Prénom:</b> {client.firstName}</Typography>
        <Typography><b> Email:</b> {client.email}</Typography>
        <Typography><b>Numéro de Téléphone:</b> {client.phoneNumber}</Typography>
        <Typography><b>CIN:</b> {client.nationalID}</Typography>
        <Typography><b>Adresse:</b> {client.address}</Typography>
        <Typography><b>numéro Contrat:</b> {client.contractNumber}</Typography>
        <Typography><b>numéro de Permis:</b> {client.drivingLicense}</Typography>


        <Link to={`/editClient/${client._id}`}>
            <Button onClick={() => handleEdit(client._id)} variant="contained" color="primary"  startIcon={<EditIcon />} sx={{ mr: 1 }}>
              Modifier
            </Button>
          </Link>
          <Button variant="contained" color="error" onClick={() => handleDelete(client._id)}  startIcon={<DeleteIcon />}>
            Supprimer
          </Button>
        <Button variant="contained" color="info" onClick={generatePDF}>
        <PictureAsPdfRoundedIcon sx={{ mr: 1 }} /> Génerer rapport PDF
        </Button>


        <TableContainer>

        <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 }}><b>Historique de location </b></Typography>      

          <Table>
            <TableHead  sx={{ backgroundColor: 'rgba(24, 119, 242, 0.08)' }}>
              <TableRow >
                <TableCell className='headTable'>Date De Début</TableCell>
                <TableCell className='headTable'>Date De Fin</TableCell>
                <TableCell className='headTable'>Heure De Location</TableCell>
                <TableCell className='headTable'>nombre de jours</TableCell>
                <TableCell className='headTable'>Voiture</TableCell>
                <TableCell className='headTable'>Total Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

  {client.locations.map((location, index) => (
    <TableRow key={index}>
      <TableCell>{formatDate(location.StartDateLocation)}</TableCell>
      <TableCell>{formatDate(location.EndDateLocation)}</TableCell>
      <TableCell>{location.locationTime}</TableCell>
      <TableCell>{location.NumberOfDays}</TableCell>
      <TableCell>{location.voiture.registrationPlate}-{location.voiture.model.modelName}</TableCell>
      <TableCell>{location.totalPrice}</TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>


        {client.images.map((image, index) => (
  <img key={index} src={`http://localhost:3000/uploads/${image}`}  alt={`client Image ${index}`} />
))}

        

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Choisir les champs pour le  rapport PDF</DialogTitle>
          <DialogContent>
  {Object.keys(fields).map((field, index) => (
    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox checked={fields[field]} onChange={() => handleFieldChange(field)} />
      <Typography>{field}</Typography>
    </div>
  ))}
</DialogContent>
          <DialogActions>
            <Button onClick={handleClose}  variant="contained" color="error">Annuler</Button>
            <PDFDownloadLink document={<MyDocument />} fileName={`${client.nationalID}-${client.name} ${client.firstName}.pdf`}>
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
