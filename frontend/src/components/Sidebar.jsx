import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "@styles/sidebar.css";

const Sidebar = ({ isVisible, toggleSidebar }) => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.rol;

  const [isHorariosOpen, setIsHorariosOpen] = useState(false);
  const [isAtrasosOpen, setIsAtrasosOpen] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsHorariosOpen(false);
      setIsAtrasosOpen(false);
    }
  }, [isVisible]);

  const closeSidebar = () => {
    toggleSidebar();
    setIsHorariosOpen(false);
    setIsAtrasosOpen(false);
  };

  const renderHorariosOptions = () => {
    if (!isHorariosOpen) return null;
    switch (userRole) {
      case "administrador":
      case "jefeUTP":
        return (
          <>
            <li>
              <NavLink to="/horarios/asignar" onClick={closeSidebar}>
                Asignar Horario
              </NavLink>
            </li>
            <li>
              <NavLink to="/horarios/materias" onClick={closeSidebar}>
                Gestión de Materias
              </NavLink>
            </li>
            <li>
              <NavLink to="/horarios/ver" onClick={closeSidebar}>
                Ver Horarios
              </NavLink>
            </li>
            <li>
              <NavLink to="/horarios/eliminar" onClick={closeSidebar}>
                Eliminar Horario
              </NavLink>
            </li>
          </>
        );
      case "profesor":
        return (
          <li>
            <NavLink to="/horarios/ver/profesor" onClick={closeSidebar}>
              Ver Horarios
            </NavLink>
          </li>
        );
      case "alumno":
        return (
          <li>
            <NavLink to="/horarios/ver/alumno" onClick={closeSidebar}>
              Mi Horario
            </NavLink>
          </li>
        );
      default:
        return null;
    }
  };

  const renderAtrasosOptions = () => {
    if (!isAtrasosOpen) return null;
    switch (userRole) {
      case "alumno":
        return (
          <>
            <li>
              <NavLink to="/atrasos" onClick={closeSidebar}>
                Ver Atrasos
              </NavLink>
            </li>
            <li>
              <NavLink to="/atraso/registrar" onClick={closeSidebar}>
                Registrar Atraso
              </NavLink>
            </li>
          </>
        );
      case "profesor":
        return (
          <li>
            <NavLink to="/atrasosProfesor" onClick={closeSidebar}>
              Ver Atrasos de Alumnos
            </NavLink>
          </li>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`sidebar ${isVisible ? "visible" : ""}`}>
      <ul>
        <li>
          <button onClick={() => setIsHorariosOpen((prev) => !prev)} className="sidebar-button">
            Horarios
          </button>
          <ul className={`submenu ${isHorariosOpen ? "open" : ""}`}>
            {renderHorariosOptions()}
          </ul>
        </li>
        <li>
          <button onClick={() => setIsAtrasosOpen((prev) => !prev)} className="sidebar-button">
            Atrasos
          </button>
          <ul className={`submenu ${isAtrasosOpen ? "open" : ""}`}>
            {renderAtrasosOptions()}
          </ul>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
