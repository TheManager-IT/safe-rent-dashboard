import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import des composants de routage depuis react-router-dom
import Cars from './pages/cars';
import AddCarForm from './pages/AddCarForm';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Cars />} /> {/* Définir la route pour le composant Cars */}
          <Route path="/add-car" element={<AddCarForm />} /> {/* Définir la route pour le formulaire d'ajout de voiture */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
