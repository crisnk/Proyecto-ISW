import { Outlet, NavLink } from "react-router-dom";
import "@styles/Horarios/verHorarios.css";

const VerHorariosLayout = () => {
  return (
    <div className="ver-horarios-layout">
      <h1 className="ver-horarios-title">Gestión de Horarios</h1>
      <nav className="ver-horarios-nav">
        <ul className="ver-horarios-menu">
          <li>
            <NavLink
              to="profesor"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Horarios de Profesores
            </NavLink>
          </li>
          <li>
            <NavLink
              to="curso"
              className={({ isActive }) => (isActive ? "active" : "inactive")}
            >
              Horarios de Cursos
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

export default VerHorariosLayout;
