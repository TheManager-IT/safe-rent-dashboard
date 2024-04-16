import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import des composants de routage depuis react-router-dom
import Cars from './pages/cars';
import AddCarForm from './pages/AddCarForm';

import Client from './pages/client/clientList';
import AddClientForm from './pages/client/addClientForm';
import EditClient from './pages/client/editClient';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/car" element={<Cars />} /> {/* Définir la route pour le composant Cars */}
          <Route path="/addCar" element={<AddCarForm />} /> {/* Définir la route pour le formulaire d'ajout de voiture */}

          <Route path="/client" element={<Client />} />
          <Route path="/addClient" element={<AddClientForm />} />
          <Route path="/editClient" element={<EditClient />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
