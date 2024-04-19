import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import des composants de routage depuis react-router-dom
import Cars from './pages/cars/cars';
import AddCarForm from './pages/cars/AddCarForm';
import EditCarForm from './pages/cars/EditCarForm ';

import Client from './pages/client/clientList';
import AddClientForm from './pages/client/addClientForm';
import EditClient from './pages/client/editClient';

import Locations from './pages/location/Locations';
import AddLocationForm from './pages/location/addlocationform';
import EditLocation from './pages/location/editlocation';

import Events from './pages/event/eventList';
import AddEvent from './pages/event/addEventForm';
import EditEvent from './pages/event/editEvent';

import Login from './pages/login/login';

import Header from './pages/Header';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/header" element={<Header />} /> 
          <Route path="/login" element={<Login />} /> 
          
          <Route path="/car" element={<Cars />} /> 
          <Route path="/addCar" element={<AddCarForm />} /> 
          <Route path="/editCar/:id" element={<EditCarForm />} /> 

          <Route path="/client" element={<Client />} />
          <Route path="/addClient" element={<AddClientForm />} />
          <Route path="/editClient/:id" element={<EditClient />} />

          <Route path="/event" element={<Events />} />
          <Route path="/addEvent" element={<AddEvent />} />
          <Route path="/editEvent/:id" element={<EditEvent />} />
         
          
          <Route path="/Locations" element={<Locations />} />
          <Route path="/addlocationform" element={<AddLocationForm />} />
          <Route path="/editlocation/:id" element={<EditLocation />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
