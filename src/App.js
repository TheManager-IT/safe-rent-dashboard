// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cars from './pages/cars/cars';
import AddCarForm from './pages/cars/AddCarForm';
import EditCarForm from './pages/cars/EditCarForm ';
import CarDetail from './pages/cars/CarDetail';

import Brands from './pages/brand/brandList';
import AddBrand from './pages/brand/addBrand';
import EditBrand from './pages/brand/editBrand';

import ModelList from './pages/model/ModelList';
import AddModel from './pages/model/addModel';
import EditModel from './pages/model/editModel';

import Charges from './pages/charge/charge';
import AddChargeForm from './pages/charge/addChargeForm';
import EditChargeForm from './pages/charge/editChargeForm';

import Client from './pages/client/clientList';
import AddClientForm from './pages/client/addClientForm';
import EditClientForm from './pages/client/editClient';
import ClientDetail from './pages/client/ClientDetail';

import Locations from './pages/location/Locations';
import AddLocationForm from './pages/location/addlocationform';
import EditLocationForm from './pages/location/editLocationForm';

import Events from './pages/event/eventList';
import AddEvent from './pages/event/addEventForm';
import EditEvent from './pages/event/editEvent';

import LoginForm from './pages/login/loginForm';
import Error404 from './pages/error/notFoundView';

import { AuthProvider } from './pages/login/AuthContext';
import ProtectedRoute from './pages/login/ProtectedRoute';
import NavBar from './pages/navBar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <NavBar />
                <Routes>
                  <Route path="/car" element={<Cars />} />
                  <Route path="/addCar" element={<AddCarForm />} />
                  <Route path="/editCar/:id" element={<EditCarForm />} />
                  <Route path="/car/:id" element={<CarDetail />} />

                  <Route path="/brand" element={<Brands />} />
                  <Route path="/addBrand" element={<AddBrand />} />
                  <Route path="/editBrand/:id" element={<EditBrand />} />

                  <Route path="/model" element={<ModelList />} />
                  <Route path="/addModel" element={<AddModel />} />
                  <Route path="/editModel/:id" element={<EditModel />} />

                  <Route path="/charge" element={<Charges />} />
                  <Route path="/addCharge" element={<AddChargeForm />} />
                  <Route path="/editcharge/:id" element={<EditChargeForm />} />

                  <Route path="/client" element={<Client />} />
                  <Route path="/addClient" element={<AddClientForm />} />
                  <Route path="/editClient/:id" element={<EditClientForm />} />
                  <Route path="/client/:id" element={<ClientDetail />} />

                  <Route path="/event" element={<Events />} />
                  <Route path="/addEvent" element={<AddEvent />} />
                  <Route path="/editEvent/:id" element={<EditEvent />} />

                  <Route path="/locations" element={<Locations />} />
                  <Route path="/addlocationform" element={<AddLocationForm />} />
                  <Route path="/editlocationform/:id" element={<EditLocationForm />} />

                  <Route path="/404" element={<Error404 />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
