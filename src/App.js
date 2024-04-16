import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import des composants de routage depuis react-router-dom
import Cars from './pages/cars/cars';
import AddCarForm from './pages/cars/AddCarForm';
import EditCarForm from './pages/cars/EditCarForm ';
import Client from './pages/client/clientList';
import AddClientForm from './pages/client/addClientForm';
import EditClient from './pages/client/editClient';
import Locations from './pages/location/Locations';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/car" element={<Cars />} /> 
          <Route path="/addCar" element={<AddCarForm />} /> 
          <Route path="/editCar/:id" element={<EditCarForm />} /> 
          <Route path="/client" element={<Client />} />
          <Route path="/addClient" element={<AddClientForm />} />
          <Route path="/editClient" element={<EditClient />} />
          <Route path="/Locations" element={<Locations />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
