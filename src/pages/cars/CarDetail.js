import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './CarDetail.css'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TroubleshootSharpIcon from '@mui/icons-material/TroubleshootSharp';
import { PDFDownloadLink, Document, Page, Text, Image, View } from '@react-pdf/renderer'; 
import { StyleSheet } from '@react-pdf/renderer';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({
    registrationPlate: true,
    model: true,
    locationPrice: true,
    mileage: true,
    status: true,
    locations: true,
    charges: true,
    evenements: true,
  });

  const { id } = useParams();

  useEffect(() => {
    if (!id) return; 
    fetch(`http://localhost:3000/v1/api/voiture/get/${id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car details:', error));
  }, [id]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/v1/api/voiture/delete/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          setCar(null); // Clear car data after deletion
        } else {
          throw new Error('Failed to delete car');
        }
      })
      .catch(error => console.error('Error deleting car:', error));
    }
  };

  const generatePDF = () => {
    setOpen(true);
  };

  if (!car) {
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
      <Page /*style={styles.page}*/>
      <View>
        <Text /*style={styles.title}*/>Détails de la voiture</Text>
        <Text>Immatriculation: {car.registrationPlate}</Text>
        <Text>Modèle: {car.model.modelName}</Text>
        <Text>Prix de la location par jour: {car.locationPrice}</Text>
        <Text>Kilométrage: {car.traveled[0].mileage}</Text>
        <Text>Statut: {car.status}</Text>
      </View>
      <Text>Locations: </Text>
      {fields.locations && (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Date de Début</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Date de Fin</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Nombre de Jours</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Client</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Prix Total</Text></View>
            </View>
            {car.locations.map((location, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.StartDateLocation}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.EndDateLocation}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.NumberOfDays}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.client.nationalID} - {location.client.name}  {location.client.firstName}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.totalPrice}</Text></View>
              </View>
            ))}
          </View>
      )}
<Text>Charges: </Text>
      {fields.charges && (
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Date </Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Description</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>cost</Text></View>
          </View>
          {car.charges.map((charge, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{charge.date}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{charge.description}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{charge.cost}</Text></View>
            </View>
          ))}
        </View>
    )}
  <Text>Evenements: </Text>
    {fields.evenements && (
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={styles.tableCol}><Text style={styles.tableCell}>eventType </Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>note</Text></View>
          <View style={styles.tableCol}><Text style={styles.tableCell}>date</Text></View>
          </View>
        {car.evenements.map((evenement, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evenement.eventType}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evenement.note}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evenement.date}</Text></View>
          </View>
        ))}
      </View>
  )}

      
        <View /*style={styles.imageContainer}*/>
          {car.images.map((image, index) => (
            <Image key={index} src={`http://localhost:3000/uploads/${image}`} style={styles.image} />
          ))}
        </View>
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
        {car.model.modelName}
      </Typography>
      <div className="car-details-container">
        {car.images.map((image, index) => (
          <img key={index} src={`http://localhost:3000/uploads/${image}`}  alt={`Car Image ${index}`} />
        ))}
        <Typography> <b> Immatriculation:</b> {car.registrationPlate}</Typography>
        <Typography> <b> Model:</b> {car.model.modelName}</Typography>
        <Typography> <b>Prix de la location par jour: </b>  {car.locationPrice}</Typography>
        <Typography><b> Kilométrage: </b> {car.traveled[0].mileage}</Typography>
        <Typography><b>chargeTotale:</b> {car.chargeTotale}</Typography>
        <Typography><b>locationTotale:</b> {car.locationTotal}</Typography>
        <Typography><b>location :</b></Typography>      
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date De Début</TableCell>
                <TableCell>Date De Fin</TableCell>
                <TableCell>NumberOfDays</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {car.locations.map((location, index) => (
                <TableRow key={index}>
                  <TableCell>{location.StartDateLocation}</TableCell>
                  <TableCell>{location.EndDateLocation}</TableCell>
                  <TableCell>{location.NumberOfDays}</TableCell>
                  <TableCell>{location.totalPrice}</TableCell>
                  <TableCell>{location.client ? `${location.client.nationalID} - ${location.client.name} ${location.client.firstName}` : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>
            <Typography><b>evenements :</b></Typography>      
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>eventType </TableCell>
                <TableCell>note</TableCell>
                <TableCell>date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {car.evenements.map((evenement, index) => (
                <TableRow key={index}>
                  <TableCell>{evenement.eventType}</TableCell>
                  <TableCell>{evenement.note}</TableCell>
                  <TableCell>{evenement.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>

            <Typography><b>charges :</b></Typography>      
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>date </TableCell>
                <TableCell>description</TableCell>
                <TableCell>cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {car.charges.map((charge, index) => (
                <TableRow key={index}>
                  <TableCell>{charge.date}</TableCell>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>{charge.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>

        <div className="button-group">
          <Link to={`/editCar/${car._id}`}>
            <Button onClick={() => handleEdit(car._id)} variant="contained" color="primary"  startIcon={<EditIcon />} sx={{ mr: 1 }}>
              Modifier
            </Button>
          </Link>
          <Button variant="contained" color="error" onClick={() => handleDelete(car._id)}  startIcon={<DeleteIcon />}>
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
              <PDFDownloadLink document={<MyDocument />} fileName={`${car.registrationPlate}-${car.model.modelName}.pdf`}>
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

/*const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 100,
    margin: 5,
  },
});
*/
export default CarDetail;
