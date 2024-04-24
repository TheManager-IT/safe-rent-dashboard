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
import EditLocationForm from './pages/location/editLocationForm';

import Events from './pages/event/eventList';
import AddEvent from './pages/event/addEventForm';
import EditEvent from './pages/event/editEvent';

import Login from './pages/login/login';
import Register from './pages/login/RegisterForm';
import Header from './pages/Header';
import NavBar from './pages/navBar';
import Error404 from './pages/error/notFoundView';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<NavBar/>} /> 
          <Route path="/header" element={<Header />} /> 
          <Route path="/404" element={<Error404 />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          
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
          <Route path="/editlocationform/:id" element={<EditLocationForm />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
