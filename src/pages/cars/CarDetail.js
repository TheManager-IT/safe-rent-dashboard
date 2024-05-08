import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './CarDetail.css'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TroubleshootSharpIcon from '@mui/icons-material/TroubleshootSharp';
import { PDFDownloadLink, Document, Page, Text, Image, View } from '@react-pdf/renderer'; 
import { StyleSheet } from '@react-pdf/renderer';

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    registrationPlate: true,
    brand: true,
    model: true,
    locationPrice: true,
    mileage: true,
    status: true,
    evenements: true
  });

  const { id } = useParams();

  useEffect(() => {
    if (!id) return; 
    fetch('http://localhost:3000/v1/api/voiture/get/${id}')
    .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car details:', error));
  }, [id]);

  const handleDelete = () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      return;
    }
    // Logique de suppression ici
  };

  const generatePDF = () => {
    setOpen(true);
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  const MyDocument = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Détails de la voiture</Text>
        <View style={styles.table}>
          {fields.registrationPlate && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Immatriculation</Text>
              <Text style={styles.tableCell}>{car.registrationPlate}</Text>
            </>
          )}
          {fields.brand && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Marque</Text>
              <Text style={styles.tableCell}>{car.brand}</Text>
            </>
          )}
          {fields.model && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Modèle</Text>
              <Text style={styles.tableCell}>{car.model}</Text>
            </>
          )}
          {fields.locationPrice && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Prix de la location par jour</Text>
              <Text style={styles.tableCell}>{car.locationPrice}</Text>
            </>
          )}
          {fields.mileage && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Kilométrage</Text>
              <Text style={styles.tableCell}>{car.traveled.at(-1).mileage}</Text>
            </>
          )}
          {fields.status && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Statut</Text>
              <Text style={styles.tableCell}>{car.status}</Text>
            </>
          )}
          {fields.evenements && (
            <>
              <Text style={[styles.tableCell, styles.headerCell]}>Evenements</Text>
              <Text style={styles.tableCell}>{car.evenements}</Text>
            </>
          )}
        </View>
        <Image src={`http://localhost:3000/uploads/${car.images}`} />
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
    console.log('Edit car with id:', id);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 2 , mt:13}}>
        {car.model}
      </Typography>
      <div className="car-details-container">
      {car.images.map((image, index) => (
        <img key={index} src={`http://localhost:3000/uploads/${image}`} alt={`Car Image ${index}`} />
      ))}
        <Typography> <b> Immatriculation:</b> {car.registrationPlate}</Typography>
        <Typography> <b> Marque:</b> {car.brand}</Typography>
        <Typography> <b> Modèle:</b> {car.model}</Typography>
        <Typography> <b>Prix de la location par jour: </b>  {car.locationPrice}</Typography>
        <Typography><b> Kilométrage: </b> {car.traveled.at(-1).mileage}</Typography>
        <Typography>Evenements :{car.evenements}</Typography>
        <div className="button-group">
          <Link to={`/editCar/${car._id}`}>
            <Button onClick={() => handleEdit(car._id)} variant="contained" color="primary"  startIcon={<EditIcon />} sx={{ mr: 1 }}>
              Modifier
            </Button>
          </Link>
          <Button variant="contained" color="error" onClick={handleDelete} startIcon={<DeleteIcon />}>
            Supprimer
          </Button>
          <Button variant="contained" color="info" startIcon={<TroubleshootSharpIcon  />}>
            Diagnostic
          </Button>
          <Button variant="contained" color="info" onClick={generatePDF}>
            Télécharger PDF
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Choisir les champs pour le PDF</DialogTitle>
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
              <PDFDownloadLink document={<MyDocument />} fileName="car-details.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? 'Chargement du PDF...' : 'Télécharger le PDF'
                }
              </PDFDownloadLink>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </Container>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 10,
  },
  tableCell: {
    border: '1px solid #000',
    padding: '8px',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
});

export default CarDetail;