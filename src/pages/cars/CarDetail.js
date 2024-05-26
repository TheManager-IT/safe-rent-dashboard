import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,Box } from '@mui/material';
import './CarDetail.css'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TroubleshootSharpIcon from '@mui/icons-material/TroubleshootSharp';
import { PDFDownloadLink, Document, Page, Text, Image, View } from '@react-pdf/renderer'; 
import { StyleSheet } from '@react-pdf/renderer';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,TablePagination,
} from '@mui/material';

const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');
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
  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };
  const [carr, setCarr] = useState({ images: [] });

    // Pagination states for locations, charges, and events
    const [locationsPage, setLocationsPage] = useState(0);
    const [chargesPage, setChargesPage] = useState(0);
    const [eventsPage, setEventsPage] = useState(0);
    const rowsPerPage = 4;

    const handleChangePage = (setPage) => (event, newPage) => {
      setPage(newPage);
    };


  useEffect(() => {
    if (!id) return; 
    fetch(`http://localhost:3000/v1/api/voiture/get/${id}`)
      .then(response => response.json())
      .then(data => setCar(data))
      .catch(error => console.error('Error fetching car details:', error));
  }, [id]);

  /*const handleDelete = (id) => {
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
  };*/

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/v1/api/voiture/delete/${id}`);
        setCarr(prevCars => {
          if (!Array.isArray(prevCars)) {
            return []; // ou gérer autrement si prevCars n'est pas un tableau
          }
          return prevCars.filter(car => car._id !== id);
        });
        setError(''); // Clear any previous error
      } catch (error) {
        console.error('Error deleting car:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete car';
        alert(errorMessage);
      }
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
    tableCol2: {
         
      borderColor: '#ffffff',
     
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
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(location.StartDateLocation)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(location.EndDateLocation)}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.NumberOfDays}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.client.nationalID} - {location.client.name}  {location.client.firstName}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{location.totalPrice}</Text></View>
              </View>
            ))}
             {/* Ligne de total des locations */}
            <View style={styles.tableRow}>
             <View style={[styles.tableCol,  styles.tableHeader, { flex: 4 }]}><Text style={styles.tableCell}>Total</Text></View>
             <View style={[styles.tableCol]}><Text style={styles.tableCell}>{car.locationTotal}</Text></View>
            </View>
         
          </View>
      )}


      
<Text>Charges: </Text>
      {fields.charges && (
        <View style={styles.table}>
          <View style={[styles.tableRow]}>
            <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Date </Text></View>
            <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Description</Text></View>
            <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Coût</Text></View>
          </View>
          {car.charges.map((charge, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(charge.date)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{charge.description}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{charge.cost}</Text></View>
            </View>
          ))}
          <View style={styles.tableRow}>
             <View style={[styles.tableCol, { flex: 2 }]}><Text style={styles.tableCell}>Total</Text></View>
            
             <View style={[styles.tableCol]}><Text style={styles.tableCell}>{car.chargeTotale}</Text></View>
             <View style={[styles.tableCol, styles.tableCol2]}><Text style={styles.tableCell}></Text></View>
             <View style={[styles.tableCol, styles.tableCol2]}><Text style={styles.tableCell}></Text></View>
            </View>
        </View>
    )}
  <Text>Evenements: </Text>
    {fields.evenements && (
      <View style={styles.table}>
        <View style={[styles.tableRow]}>
          <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Type d'événement </Text></View>
          <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Note</Text></View>
          <View style={[styles.tableCol, styles.tableHeader]}><Text style={styles.tableCell}>Date</Text></View>
          </View>
        {car.evenements.map((evenement, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evenement.eventType}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{evenement.note}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(evenement.date)}</Text></View>
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
      <Typography variant="h4" sx={{ mb: 2 , mt:2}}>
        {car.model.modelName}
      </Typography>
      <div className="car-details-container">
        {/*{car.images.map((image, index) => (
          <img key={index} src={`http://localhost:3000/uploads/${image}`}  alt={`Car Image ${index}`} />
        ))}
        */}

        <Box display="flex" justifyContent="space-between">
      <Box flex="1" mr={2}>
        {car.images.length > 0 ? (
          <Carousel>
            {car.images.map((image, index) => (
              <div key={index}>
                <img src={`http://localhost:3000/uploads/${image}`} alt={`Car Image ${index}`} />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>Pas d'images disponibles pour cette voiture.</p>
        )}
      </Box>
      <Box flex="1">
        <Typography variant="h5" className="marginBottom"><b>Immatriculation:</b> {car.registrationPlate}</Typography>
        <Typography variant="h5" className="marginBottom"><b>Modèle:</b> {car.model?.modelName}</Typography>
        <Typography variant="h5" className="marginBottom"><b>Nombre De Places:</b> {car.numberOfCarSeats}  </Typography>
        <Typography variant="h5" className="marginBottom"><b>Prix de la location par jour:</b> {car.locationPrice} DT</Typography>
        <Typography variant="h5" className="marginBottom"><b>Kilométrage:</b> {car.traveled[0]?.mileage} kilomètre</Typography>
        <Typography variant="h5" className="marginBottom" ><b>Location Totale:</b> {car.locationTotal} DT</Typography>
        <Typography variant="h5" className="marginBottom"><b>Charge Totale:</b> {car.chargeTotale} DT </Typography>
        <Typography variant="h5" className="marginBottom"><b>Statut:</b> {car.status}  </Typography>


<br/>
<Link to={`/editCar/${car._id}`}>
  <Button
    onClick={() => handleEdit(car._id)}
    variant="contained"
    color="info"
    startIcon={<EditIcon />}
    sx={{
      width:'190px',
      mr: 2,
      //borderRadius: '10px', // Arrondir les bords
      '&:hover': {
        color: 'rgb(24, 119, 242)',
        backgroundColor: ' rgb(232, 232, 232)',

      },
    }}
  >
    Modifier
  </Button>
</Link>
          <Button variant="outlined" color="error" onClick={() => handleDelete(car._id)}  startIcon={<DeleteIcon />}
            sx={{
      width:'190px',
      mr: 2,
      //borderRadius: '10px', // Arrondir les bords
      '&:hover': {
        color: '#C50000',
        backgroundColor: ' rgb(232, 232, 232)',

      },
    }}
          >
            Supprimer
          </Button>
          <br/>
<br/>
          <Button  variant="outlined" color="info" startIcon={<TroubleshootSharpIcon  />}   sx={{
      width:'190px',
      mr: 2,
      //borderRadius: '10px', // Arrondir les bords
      '&:hover': {
       color: '#333',
      
       backgroundColor: ' rgb(232, 232, 232)', // Changer la couleur de la bordure au survol

      },
    }}>
            Diagnostic
          </Button>
            <Button variant="contained" color="info" onClick={generatePDF} startIcon={<PictureAsPdfRoundedIcon/>}   sx={{
      width:'190px',
      mr: 2,
      //borderRadius: '10px', // Arrondir les bords
      '&:hover': {
        color: 'rgb(24, 119, 242)',
        backgroundColor: ' rgb(255, 255, 255)',

      },
    }}>
           Génerer rapport PDF
          </Button>
      

      </Box>
    
    </Box>
    
       <div>
        <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 }}><b>locations </b></Typography>      
        <TableContainer>
          <Table>
          <TableHead sx={{ backgroundColor: 'rgba(24, 119, 242, 0.08)' }}>
  <TableRow>
    <TableCell className='headTable'>Date De Début</TableCell>
    <TableCell className='headTable'>Date De Fin</TableCell>
    <TableCell className='headTable'>Nombre de jours</TableCell>
    <TableCell className='headTable'>Prix ​​total</TableCell>
    <TableCell className='headTable'>Client</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
              {car.locations.map((location, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(location.StartDateLocation)}</TableCell>
                  <TableCell>{formatDate(location.EndDateLocation)}</TableCell>
                  <TableCell>{location.NumberOfDays}</TableCell>
                  <TableCell>{location.totalPrice}</TableCell>
                  <TableCell>{location.client ? `${location.client.nationalID} - ${location.client.name} ${location.client.firstName}` : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={car.locations.length}
            rowsPerPage={rowsPerPage}
            page={locationsPage}
            onPageChange={handleChangePage(setLocationsPage)}
            rowsPerPageOptions={[rowsPerPage]}
          />


            </TableContainer>
            <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 }}><b>evenements</b></Typography>      
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(24, 119, 242, 0.08)' }}>
              <TableRow>
                <TableCell className='headTable'>type d'événement </TableCell>
                <TableCell className='headTable'>note</TableCell>
                <TableCell className='headTable'>date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {car.evenements.map((evenement, index) => (
                <TableRow key={index}>
                  <TableCell>{evenement.eventType}</TableCell>
                  <TableCell>{evenement.note}</TableCell>
                  <TableCell>{formatDate(evenement.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>

            <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 2 }}> <b>charges </b></Typography>      
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(24, 119, 242, 0.08)' }}>
              <TableRow>
                <TableCell className='headTable'>date </TableCell>
                <TableCell className='headTable'>description</TableCell>
                <TableCell className='headTable'>coût</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {car.charges.map((charge, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(charge.date)}</TableCell>
                  <TableCell>{charge.description}</TableCell>
                  <TableCell>{charge.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </TableContainer>
</div>
        
          
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Choisir Les Champs Pour Le Rapport PDF</DialogTitle>
            <DialogContent>
  {Object.keys(fields).map((field, index) => (
    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox checked={fields[field]} onChange={() => handleFieldChange(field)} />
      <Typography>{field}</Typography>
    </div>
  ))}
</DialogContent>

            <DialogActions>
              <Button onClick={handleClose} variant="contained" color="error" >Annuler</Button>
             
             <PDFDownloadLink document={<MyDocument />} fileName={`${car.registrationPlate}-${car.model.modelName}.pdf`}>
                {({ blob, url, loading, error }) =>
                  loading ? 'Chargement du PDF...' : <GetAppRoundedIcon sx={{ mr: 2 ,ml:2 }}/>
                }
              </PDFDownloadLink>
              
            </DialogActions>
          </Dialog>
        </div>
     
    </Container>
  );
};


export default CarDetail;
