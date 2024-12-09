import { Outlet, NavLink } from "react-router-dom";
import "@styles/Horarios/gestionMaterias.css";

const GestionMateriasLayout = () => {
  return (
    <div className="gestion-materias-layout">
      <h1 className="gestion-materias-title">Gestión de Materias y Cursos</h1>
      <nav className="gestion-materias-nav">
        <ul className="gestion-materias-menu">
          <li>
            <NavLink
              to="crear-materia"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Crear Materia
            </NavLink>
          </li>
          <li>
            <NavLink
              to="crear-curso"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Crear Curso
            </NavLink>
          </li>
          <li>
            <NavLink
              to="materias-existentes"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Materias Existentes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="cursos-existentes"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Cursos Existentes
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="outlet-container">
        <Outlet />
      </div>
    </div>
  );
};

export default GestionMateriasLayout;
