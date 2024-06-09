// Import des composants nécessaires
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,Box } from '@mui/material';
import { Document, Page, Text, PDFDownloadLink, Image, View, StyleSheet } from '@react-pdf/renderer';
import './clientDetail.css'; 
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
import axios from 'axios';

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
    locations: true,
    locationTotalClient: true
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
    headerText: {
      fontSize: 12,
      fontWeight: 'bold',
      fontFamily: 'Helvetica-Bold',
    },
    titleText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      fontFamily: 'Helvetica-Bold',
    },
    bodyText: {
      fontSize: 10,
      fontFamily: 'Helvetica',
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
          {fields.name && <Text style={styles.titleText}>Nom: <Text style={styles.bodyText}>{client.name}</Text></Text>}
          {fields.firstName && <Text style={styles.titleText}>Prénom: <Text style={styles.bodyText}>{client.firstName}</Text></Text>}
          {fields.email && <Text style={styles.titleText}>Email: <Text style={styles.bodyText}>{client.email}</Text></Text>}
          {fields.phoneNumber && <Text style={styles.titleText}>Numéro de Téléphone: <Text style={styles.bodyText}>{client.phoneNumber}</Text></Text>}
          {fields.nationalID && <Text style={styles.titleText}>CIN: <Text style={styles.bodyText}>{client.nationalID}</Text></Text>}
          {fields.address && <Text style={styles.titleText}>Adresse: <Text style={styles.bodyText}>{client.address}</Text></Text>}
          {fields.contractNumber && <Text style={styles.titleText}>Numéro Contrat: <Text style={styles.bodyText}>{client.contractNumber}</Text></Text>}
          {fields.drivingLicense && <Text style={styles.titleText}>Numéro de Permis: <Text style={styles.bodyText}>{client.drivingLicense}</Text></Text>}
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
             <View style={styles.tableRow}>
             <View style={[styles.tableCol,  styles.tableHeader, { flex: 4 }]}><Text style={styles.tableCell}>Total</Text></View>
             <View style={[styles.tableCol]}><Text style={styles.tableCell}>{client.locationTotalClient}</Text></View>
            </View>
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

  /*const handleDelete = (id) => {
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
  };*/

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/v1/api/client/delete/${id}`);
        setClient(null); // Réinitialisez l'état du client après la suppression
      } catch (error) {
        console.error('Error deleting client:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete client';
        alert(errorMessage);
      }
    }
  };
  
  console.log(client.locations);
  console.log(client.locations.totalPrice);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Détails du client
      </Typography>
      <Box display="flex" justifyContent="space-between"  sx={{border: '1px solid rgba(69, 90, 100, 0.5)',padding:'10px 10px 10px 10px' ,borderRadius: '20px 20px 20px 20px'}} >
      <Box flex="1" mr={2}>
        {client.images.length > 0 ? (
          <Carousel>
          {client.images.map((image, index) => (
          <img key={index} src={`http://localhost:3000/uploads/${image}`}  alt={`client Image ${index}`} />
        ))}
          </Carousel>
        ) : (
          <p>Pas d'images disponibles pour ce client.</p>
        )}
      </Box>

      <Box flex="1">
      <Typography variant="h5" className="marginBottom" > <b>Nom: </b> {client.name}</Typography>
        <Typography variant="h5" className="marginBottom"> <b>Prénom:</b> {client.firstName}</Typography>
        <Typography variant="h5" className="marginBottom"><b> Email:</b> {client.email}</Typography>
        <Typography  variant="h5" className="marginBottom"><b>Numéro de Téléphone:</b> {client.phoneNumber}</Typography>
        <Typography  variant="h5" className="marginBottom"><b>CIN:</b> {client.nationalID}</Typography>
        <Typography  variant="h5" className="marginBottom"><b>Adresse:</b> {client.address}</Typography>
        <Typography  variant="h5" className="marginBottom"><b>numéro Contrat:</b> {client.contractNumber}</Typography>
        <Typography  variant="h5" className="marginBottom"><b>numéro de Permis:</b> {client.drivingLicense}</Typography>

        <Link to={`/editClient/${client._id}`}>
            <Button onClick={() => handleEdit(client._id)} variant="outlined"  startIcon={<EditIcon />} sx={{
      width:'190px',
      mr: 2,
      mt: 5,
      color: 'rgb(38 ,50, 56 )', // Couleur du texte
      borderColor: 'rgb(38 ,50, 56 )', // Couleur de la bordure
     //backgroundColor: 'rgb(108,151,187)',
      '&:hover': {
        borderColor: 'rgb(38 ,50, 56 )',
       //backgroundColor: ' rgb(38 ,50, 56)',
      // backgroundColor: 'rgb(38 ,50, 56)',
      //borderColor: 'rgb(108,151,187)', // Couleur de la bordure au survol

      },
    }}>
              Modifier
            </Button>
          </Link>
          <Button variant="outlined"  onClick={() => handleDelete(client._id)}  startIcon={<DeleteIcon />}  
          sx={{
    width: '190px',
    mr: 0,
    mt: 5,
    color: '#C50000', // Couleur du texte
    borderColor: '#C50000', // Couleur de la bordure
    '&:hover': {
      backgroundColor: 'rgb(232, 232, 232)',
      borderColor: '#C50000', // Couleur de la bordure au survol
    },}}>Supprimer </Button>
        <br/>
<br/>
      <Button variant="contained"  onClick={generatePDF} startIcon={<PictureAsPdfRoundedIcon/>}   sx={{
      width:'398px',
      ml: 0,
      mt: 0,
    
      backgroundColor: 'rgb(108,151,187)',
      '&:hover': {
        color: '#333',
       backgroundColor: ' rgb(232, 232, 232)', 
      },
    }}> Génerer rapport PDF
</Button>

      </Box>




      </Box>



      <div>
  
  

        <TableContainer>

        <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 ,color:'#263238'}}><b>Historique de location </b></Typography>      

          <Table   sx={{ marginTop: 0, marginBottom: 3}}>
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
<TableRow>
          <TableCell colSpan={6} style={{ textAlign: 'center' }}>
            <Typography  sx={{ mb: 1, mt:1 ,fontWeight: 'bold', color:'#455a64  ', fontSize:'20x'}}><b>location Total Client:</b> {client.locationTotalClient}</Typography>
          </TableCell>
        </TableRow>
          </Table>
        </TableContainer>

       

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
                loading ? 'Chargement du PDF...' : <GetAppRoundedIcon sx={{ mr: 2 ,ml:2,mt:1,  color:'#65B741 ', fontSize: '30px' }} /> 
              }
            </PDFDownloadLink>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default ClientDetail;
