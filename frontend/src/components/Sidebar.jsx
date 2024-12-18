import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "@styles/sidebar.css";

const Sidebar = ({ isVisible, toggleSidebar }) => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userRole = user.rol;

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    if (!isVisible) {
      setOpenMenu(null);
    }
  }, [isVisible]);

  const closeSidebar = () => {
    toggleSidebar();
    setOpenMenu(null);
  };

  const menuItems = [
    {
      label: "Horarios",
      options: () => {
        switch (userRole) {
          case "administrador":
          case "jefeUTP":
            return [
              { path: "/horarios/asignar", label: "Asignar Horario" },
              { path: "/gestion-materias", label: "Gestión de Materias" },
              { path: "/horarios/ver", label: "Ver Horarios" },
              { path: "/horarios/eliminar", label: "Eliminar Horario" },
            ];
          case "profesor":
            return [
              { path: "/horarios/ver/profesor", label: "Ver Horarios" },
            ];
          case "alumno":
            return [
              { path: "/horarios/ver/alumno", label: "Mi Horario" },
            ];
          default:
            return [];
        }
      },
    },
    {
      label: "Atrasos",
      options: () => {
        switch (userRole) {
          case "alumno":
            return [
              { path: "/atrasos", label: "Ver Atrasos" },
              { path: "/atraso/registrar", label: "Registrar Atraso" },
            ];
          case "profesor":
            return [
              { path: "/atrasosProfesor", label: "Ver Atrasos de Alumnos" },
            ];
          default:
            return [];
        }
      },
    },
    {
      label: "Justificativos",
      options: () => {
        switch (userRole) {
          case "alumno":
            return [
              { path: "/ingresarJustificativo", label: "Ingresar Justificativo" },
            ];
          default:
            return [];
        }
      },
    },
    {
      label: "Practica",
      options: () => {
        switch (userRole) {
          case "alumno":
            return [
              { path: "/practica", label: "Ver practicas" },
              { path: "/practica/postulaciones", label: "Mis postulaciones" },
            ];
          case "EDP":
            return [
              { path: "/practica", label: "Ver practicas" },
            ];
          default:
            return [];
        }
      },
    },
  ];

  const renderMenu = (menu) => {
    const isOpen = openMenu === menu.label;
    return (
      <li key={menu.label}>
        <button
          onClick={() => setOpenMenu(isOpen ? null : menu.label)}
          className="sidebar-button"
          aria-expanded={isOpen}
          aria-controls={`submenu-${menu.label}`}
        >
          {menu.label}
        </button>
        <ul
          id={`submenu-${menu.label}`}
          className={`submenu ${isOpen ? "open" : ""}`}
        >
          {menu.options().map((option) => (
            <li key={option.path}>
              <NavLink
                to={option.path}
                onClick={closeSidebar}
                className={({ isActive }) => (isActive ? "active" : "inactive")}
              >
                {option.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </li>
    );
  };

  return (
    <aside className={`sidebar ${isVisible ? "visible" : ""}`}>
      <ul>
        {menuItems.map(renderMenu)}
      </ul>
    </aside>
  );
};

export default Sidebar;
