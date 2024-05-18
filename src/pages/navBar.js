import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import LoginIcon from '@mui/icons-material/Login';
import ErrorIcon from '@mui/icons-material/Error';
import CarRentalRoundedIcon from '@mui/icons-material/CarRentalRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
const Navbar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <Link to="/">
          <img src="../image/LogoSafeRent.png" alt="Logo" />
          <br/>
          <img src="../images/logo/safe.jpg" alt="safee rent" />

          <span>SAFE RENT </span>
        </Link>
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link to="/">
            <DashboardIcon className="icon-right" /> 
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/car">
            <DirectionsCarRoundedIcon className="icon-right" />
            Voitures
          </Link>
        </li>
        <li>
          <Link to="/client">
            <PersonIcon className="icon-right" />
            Clients
          </Link>
        </li>
        <li>
          <Link to="/event">
            <EventIcon  className="icon-right"/>
            Evenements
          </Link>
        </li>
        <li>
          <Link to="/locations">
            <CarRentalRoundedIcon  className="icon-right"/>
            Locations
          </Link>
        </li>
        <li>
          <Link to="/brand">
            <DirectionsCarRoundedIcon  className="icon-right"/>
            Marque voiture
          </Link>
        </li>
        <li>
          <Link to="/model">
            <DirectionsCarRoundedIcon  className="icon-right"/>
            Modèle voiture
          </Link>
        </li>
        <li>
          <Link to="/charge">
            <PaidOutlinedIcon  className="icon-right"/>
            Charges voiture
          </Link>
        </li>
      </ul>
      <div className="sidebar-actions">
        <Link to="/loginform" className="btn btn-primary">
          <LoginIcon />
          Login
        </Link>
        <Link to="/404" className="btn btn-secondary">
          <ErrorIcon />
          Not Found
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
