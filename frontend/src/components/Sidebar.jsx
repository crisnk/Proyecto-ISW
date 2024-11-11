import { NavLink } from "react-router-dom";
import { useState } from "react";
import "@styles/sidebar.css";

const Sidebar = ({ isVisible, toggleSidebar }) => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.rol;

  const [isHorariosOpen, setIsHorariosOpen] = useState(false);

  const toggleHorarios = () => {
    setIsHorariosOpen(!isHorariosOpen);
  };

  const renderHorariosOptions = () => {
    switch (userRole) {
      case "administrador":
      case "jefeUTP":
        return (
          <>
            <li>
              <NavLink to="/horarios/asignar/profesor">Asignar a Profesores</NavLink>
            </li>
            <li>
              <NavLink to="/horarios/asignar/curso">Asignar a Cursos</NavLink>
            </li>
            <li>
              <NavLink to="/horarios">Ver todos</NavLink>
            </li>
            <li>
              <NavLink to="/horarios/eliminar">Eliminar Horarios</NavLink>
            </li>
          </>
        );
      case "profesor":
        return (
          <>
            <li>
              <NavLink to="/horarios">Ver todos</NavLink>
            </li>
          </>
        );
      case "alumno":
        return (
          <li>
            <NavLink to="/horarios/ver/alumno">Mi Horario</NavLink>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`sidebar ${isVisible ? "visible" : ""}`} onMouseLeave={toggleSidebar}>
      <ul>
        <li>
          <button onClick={toggleHorarios} className="sidebar-button">
            Horarios
          </button>
          {isHorariosOpen && <ul>{renderHorariosOptions()}</ul>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
