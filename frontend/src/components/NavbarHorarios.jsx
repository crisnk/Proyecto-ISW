import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import '@styles/navbarHorarios.css';

const NavbarHorarios = () => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <li className="nav-item">
      <div className="submenu" onClick={toggleSubmenu}>
        Horarios
        <span className={`arrow ${submenuOpen ? 'open' : ''}`}></span>
      </div>
      {submenuOpen && (
        <ul className="submenu-items">
          <li>
            <NavLink to="/horarios" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ver Horarios
            </NavLink>
          </li>
          <li>
            <NavLink to="/horarios/asignar" className={({ isActive }) => (isActive ? 'active' : '')}>
              Asignar Horarios
            </NavLink>
          </li>
        </ul>
      )}
    </li>
  );
};

export default NavbarHorarios;
