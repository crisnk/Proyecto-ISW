import { Outlet, NavLink } from "react-router-dom";
import "@styles/Horarios/asignarHorarios.css";

const AsignarHorarios = () => {
  return (
    <div className="asignar-horarios">
      <h1>Asignar Horarios</h1>
      <nav className="asignar-horarios-nav">
        <ul>
          <li>
            <NavLink to="profesor" className={({ isActive }) => (isActive ? "active" : "")}>
              Asignar a Profesores
            </NavLink>
          </li>
          <li>
            <NavLink to="curso" className={({ isActive }) => (isActive ? "active" : "")}>
              Asignar a Cursos
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

export default AsignarHorarios;
