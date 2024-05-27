import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,Card,
} from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [monthlyLocationData, setMonthlyLocationData] = useState({ labels: [], datasets: [] });
  const [locationPriceData, setLocationPriceData] = useState({ labels: [], datasets: [] });
  const [carSeatsData, setCarSeatsData] = useState({ labels: [], datasets: [] });
  const [locationTotalData, setLocationTotalData] = useState({ labels: [], datasets: [] });
  const [traveledData, setTraveledData] = useState({ labels: [], datasets: [] });
  const [carStatusData, setCarStatusData] = useState({ labels: [], datasets: [] });
  const [totalChargesData, setTotalChargesData] = useState({ labels: [], datasets: [] });
  const [eventCountsData, setEventCountsData] = useState({ labels: [], datasets: [] });
  const [clientLocationData, setClientLocationData] = useState({ labels: [], datasets: [] });
  const [clientCityData, setClientCityData] = useState({ labels: [], datasets: [] });
  const [clientRevenueData, setClientRevenueData] = useState({ labels: [], datasets: [] });
  const [totalCarCount, setTotalCarCount] = useState(0);
  const [totalClientCount, setTotalClientCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetching client data
    fetch('http://localhost:3000/v1/api/client')
      .then(response => response.json())
      .then(data => {
        const clientNames = data.map(client => client.name);
        const clientRevenues = data.map(client => client.locationTotalClient);

        setClientRevenueData({
          labels: clientNames,
          datasets: [{
            label: 'Revenus par Client',
            data: clientRevenues,
            backgroundColor: 'rgba(192,12,192,0.4)',
            borderColor: 'rgba(192,12,192,1)',
            borderWidth: 1,
          }]
        });

        const clientLocationCounts = data.map(client => client.locations.length);
        setClientLocationData({
          labels: clientNames,
          datasets: [{
            label: 'Nombre de Locations par Client',
            data: clientLocationCounts,
            backgroundColor: 'rgba(70,12,192,0.4)',
            borderColor: 'rgba(70,12,192,1)',
            borderWidth: 1,
          }]
        });

        const cityCounts = data.reduce((acc, client) => {
          const city = client.address.split('-')[0]; // Assuming city is the first part of the address
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {});

        setClientCityData({
          labels: Object.keys(cityCounts),
          datasets: [{
            label: 'Répartition par Ville',
            data: Object.values(cityCounts),
            backgroundColor: ['rgba(70,192,192,0.4)', 'rgba(192,192,70,0.4)', 'rgba(192,70,70,0.4)'],
            borderColor: ['rgba(70,192,192,1)', 'rgba(192,192,70,1)', 'rgba(192,70,70,1)'],
            borderWidth: 1,
          }]
        });
      })
      .catch(error => console.error('Error fetching clients:', error));

    // Fetching total car count data
    fetch('http://localhost:3000/v1/api/voiture/count')
      .then(response => response.json())
      .then(data => {
        setTotalCarCount(data.totalCarCount);
      })
      .catch(error => console.error('Error fetching total car count data:', error));

    // Fetching total client count data
    fetch('http://localhost:3000/v1/api/client/clientCount')
      .then(response => response.json())
      .then(data => {
        setTotalClientCount(data.totalClientCount);
      })
      .catch(error => console.error('Error fetching total client count data:', error));

      fetch('http://localhost:3000/v1/api/evenement')
      .then(response => response.json())
      .then(data => {
        const filteredEvents = data.filter(event => isWithinAWeek(event.date));
        setEvents(filteredEvents);
      })
      .catch(error => console.error('Error fetching events:', error));

    // Fetching monthly location counts data
    fetch('http://localhost:3000/v1/api/location/monthly-location-counts')
      .then(response => response.json())
      .then(data => {
        const labels = data.map(item => `Mois ${item.month}`);
        const counts = data.map(item => item.count);

        setMonthlyLocationData({
          labels,
          datasets: [
            {
              label: 'Nombre de Locations Mensuelles',
              data: counts,
              backgroundColor: 'rgba(70,12,192,0.4)',
              borderColor: 'rgba(70,12,192,1)',
              borderWidth: 1,
            }
          ]
        });
      })
      .catch(error => console.error('Error fetching monthly location data:', error));

    // Fetching voiture data
    fetch('http://localhost:3000/v1/api/voiture')
      .then(response => response.json())
      .then(data => {
        const registrationPlates = data.map(car => car.registrationPlate);
        const locationPrices = data.map(car => car.locationPrice);
        const carSeats = data.reduce((acc, car) => {
          acc[car.numberOfCarSeats] = (acc[car.numberOfCarSeats] || 0) + 1;
          return acc;
        }, {});
        const locationTotals = data.map(car => car.locationTotal);
        const totalCharges = data.map(car => car.chargeTotale);
        const eventCounts = data.map(car => car.evenements.length);

        setLocationPriceData({
          labels: registrationPlates,
          datasets: [{
            label: 'Prix de Location',
            data: locationPrices,
            backgroundColor: 'rgba(70,12,192,0.4)',
            borderColor: 'rgba(70,12,192,1)',
            borderWidth: 1,
          }]
        });

        setCarSeatsData({
          labels: Object.keys(carSeats),
          datasets: [{
            label: 'Nombre de Voitures',
            data: Object.values(carSeats),
            backgroundColor: ['rgba(70,12,192,0.4)', 'rgba(192,12,70,0.4)', 'rgba(12,70,192,0.4)'],
            borderColor: ['rgba(70,12,192,1)', 'rgba(192,12,70,1)', 'rgba(12,70,192,1)'],
            borderWidth: 1,
          }]
        });

        setLocationTotalData({
          labels: registrationPlates,
          datasets: [{
            label: 'Total des Locations',
            data: locationTotals,
            backgroundColor: 'rgba(12,192,70,0.4)',
            borderColor: 'rgba(12,192,70,1)',
            borderWidth: 1,
          }]
        });

        // Calculating car status distribution
        const carStatus = data.reduce((acc, car) => {
          acc[car.status] = (acc[car.status] || 0) + 1;
          return acc;
        }, {});

        setCarStatusData({
          labels: Object.keys(carStatus),
          datasets: [{
            label: 'État des Voitures',
            data: Object.values(carStatus),
            backgroundColor: ['rgba(70,192,192,0.4)', 'rgba(192,192,70,0.4)', 'rgba(192,70,70,0.4)', 'rgba(12,70,70,0.4)'],
            borderColor: ['rgba(70,192,192,1)', 'rgba(192,192,70,1)', 'rgba(192,70,70,1)', 'rgba(12,70,70,1)'],
            borderWidth: 1,
          }]
        });

        // Fetching traveled data
        const traveled = data.map(car => car.traveled.reduce((total, distance) => total + distance, 0));

        setTraveledData({
          labels: registrationPlates,
          datasets: [{
            label: 'Distance Parcourue',
            data: traveled,
            backgroundColor: 'rgba(192,12,70,0.4)',
            borderColor: 'rgba(192,12,70,1)',
            borderWidth: 1,
          }]
        });

        // Setting total charges data
        setTotalChargesData({
          labels: registrationPlates,
          datasets: [{
            label: 'Charges Totales',
            data: totalCharges,
            backgroundColor: 'rgba(12,192,192,0.4)',
            borderColor: 'rgba(12,192,192,1)',
            borderWidth: 1,
          }]
        });

        // Setting event counts data
        setEventCountsData({
          labels: registrationPlates,
          datasets: [{
            label: 'Nombre d\'Événements',
            data: eventCounts,
            backgroundColor: 'rgba(192,70,12,0.4)',
            borderColor: 'rgba(192,70,12,1)',
            borderWidth: 1,
          }]
        });
      })
      .catch(error => console.error('Error fetching voiture data:', error));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  };

  const isWithinAWeek = (date) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours plus tard
    const eventDate = new Date(date);
    return eventDate >= today && eventDate <= nextWeek;
  };

  const filteredEvents = events.filter(event =>
    //(event.voiture && event.voiture.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.date.includes(searchTerm)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
    <div>
      <h2>Tableau de Bord</h2>

      <div style={{ marginLeft: '30%' }}>
        <h3><DirectionsCarRoundedIcon className="icon-right" />Nombre Total de Voitures: {totalCarCount}</h3>
      </div>

      <div style={{ marginLeft: '40%' }}>
        <h3><PeopleAltRoundedIcon className="icon-right" />Nombre Total de Clients: {totalClientCount}</h3>
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Locations Mensuelles</h3>
        <Bar data={monthlyLocationData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Prix de Location</h3>
        <Bar data={locationPriceData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Répartition des Sièges</h3>
        <Pie data={carSeatsData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Total des Locations</h3>
        <Line data={locationTotalData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Distance Parcourue</h3>
        <Bar data={traveledData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>État des Voitures</h3>
        <Pie data={carStatusData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Charges Totales</h3>
        <Bar data={totalChargesData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Nombre d'Événements par Voiture</h3>
        <Bar data={eventCountsData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Nombre de Locations par Client</h3>
        <Bar data={clientLocationData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Répartition des Clients par Ville</h3>
        <Pie data={clientCityData} options={options} />
      </div>

      <div style={{ width: '600px', height: '400px', margin: 'auto' }}>
        <h3>Revenus par Client</h3>
        <Bar data={clientRevenueData} options={options} />
      </div>
    </div>


<Card>
       
       <TableContainer sx={{ overflow: 'unset' }}>
         <Table sx={{ minWidth: 800 }}>
           <TableHead className="table-header">
             <TableRow>
             <TableCell className="table-header-cell" >modele</TableCell>
               <TableCell className="table-header-cell" >Voiture</TableCell>
               <TableCell className="table-header-cell">Type d'événement</TableCell>
               <TableCell className="table-header-cell">Note</TableCell>
               <TableCell className="table-header-cell">Date</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
 {/*{events
   .filter(event => 
     (event.voiture && event.voiture.registrationPlate && event.voiture.registrationPlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
   (event.voiture && event.voiture.model && event.voiture.model.modelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
   event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
   event.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
   event.date.includes(searchTerm)
   )*/}
   {filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
   .map((event) => (
     <TableRow key={event._id} >
       <TableCell>{event.voiture && event.voiture.model && event.voiture.model.modelName}</TableCell>
       <TableCell>{event.voiture ? event.voiture.registrationPlate : ''}</TableCell>
       <TableCell>{event.eventType}</TableCell>
       <TableCell>{event.note}</TableCell>
       <TableCell>{formatDate(event.date)}</TableCell>
     </TableRow>
   ))}
</TableBody>

         </Table>
       </TableContainer>
      
       <TablePagination
         component="div"
         count={events.length} 
         rowsPerPage={rowsPerPage}
         page={page}
         onPageChange={(event, newPage) => setPage(newPage)}
         onRowsPerPageChange={(event) => {
           setRowsPerPage(parseInt(event.target.value, 10));
           setPage(0); 
         }}
         rowsPerPageOptions={[5, 10, 25]}
       />
    

     </Card>

</div>
  );
};

export default Dashboard;
