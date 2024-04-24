import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src="/logo.png" alt="Logo" />
          <span>Jaydon Frankie</span>
        </Link>
      </div>
      <ul className="navbar-nav">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/car">voiture</Link></li>
        <li><Link to="/client">client</Link></li>
        <li><Link to="/event">evenement</Link></li>
        <li><Link to="/locations">locations</Link></li>
      </ul>
      <div className="navbar-actions">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/not-found" className="btn btn-secondary">Not Found</Link>
      </div>
    </nav>
  );
};

export default Navbar;