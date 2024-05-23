import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import PersonIcon from '@mui/icons-material/Person';
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

  useEffect(() => {


     // Fetching total car count data
     fetch('http://localhost:3000/v1/api/voiture/count')
     .then(response => response.json())
     .then(data => {
       setTotalCarCount(data.totalCarCount);
     })
     .catch(error => console.error('Error fetching total car count data:', error));


     fetch('http://localhost:3000/v1/api/client/clientCount')
     .then(response => response.json())
     .then(data => {
         setTotalClientCount(data.totalClientCount);
     })
     .catch(error => console.error('Error fetching total client count data:', error));

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
           // backgroundColor: 'rgba(70,192,12,0.4)',
            borderColor: 'rgba(70,192,12,1)',
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

        // Fetching client data and calculating revenues by client
        fetch('http://localhost:3000/v1/api/client')
          .then(response => response.json())
          .then(clients => {
            const clientNames = clients.map(client => `${client.firstName} ${client.name}`);
            const locationCounts = clients.map(client => client.locations.length);

            setClientLocationData({
              labels: clientNames,
              datasets: [{
                label: 'Nombre de Locations',
                data: locationCounts,
                backgroundColor: 'rgba(70,12,192,0.4)',
                borderColor: 'rgba(70,12,192,1)',
                borderWidth: 1,
              }]
            });

            const cityCounts = clients.reduce((acc, client) => {
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

            const clientRevenues = clients.map(client => {
              return client.locations.reduce((total, location) => {
                const car = data.find(car => car._id === location.carId);
                return total + (car ? car.locationPrice : 0);
              }, 0);
            });

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

          })
          .catch(error => console.error('Error fetching client data:', error));

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

  return (
    <div>
      <h2>Tableau de Bord</h2>

      <div style={{ marginLeft: '30%' }}>
        <h3> <DirectionsCarRoundedIcon className="icon-right" />Nombre Total de Voitures: {totalCarCount}</h3>
      </div>

      <div style={{ marginLeft: '40%' }}>
        <h3><PeopleAltRoundedIcon className="icon-right" />   Nombre Total de Clients: {totalClientCount}</h3>
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
  );
};

export default Dashboard;
