import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { useState, useEffect } from "react";
import { FaBell } from 'react-icons/fa'; // Importación del ícono de la campana
import { initSocket } from '@services/socket.service.js';
import "@styles/navbar.css";
import { disconnectSocket } from '@services/socket.service.js';	

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]); // Estado para almacenar notificaciones
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    useEffect(() => {
        const socket = initSocket();
        if (socket) {
            socket.on("recibo-notificacion", (data) => {
                console.log('Notificación recibida:', data);
                setNotificaciones((prev) => [...prev, data.mensaje]); // Agrega la nueva notificación
            });

            return () => {
                if (socket) {
                    socket.off("recibo-notificacion"); // Desconectar el evento
                }
            };
        }
    }, []);

    const logoutSubmit = () => {
        try {
            logout();
            disconnectSocket();
            navigate("/auth");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleNotificaciones = () => {
        setMostrarNotificaciones((prev) => !prev);
        console.log('Mostrando notificaciones:', notificaciones);
    };
    
    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? "activado" : ""}`}>
                <ul>
                    {userRole === "administrador" && (
                        <li>
                            <NavLink
                                to="/users"
                                className={({ isActive }) => (isActive ? "active" : "")}
                                onClick={() => setMenuOpen(false)}
                            >
                                Usuarios
                            </NavLink>
                        </li>
                    )}
                    {userRole === "profesor" && (
                        <li>
                            <NavLink
                                to="/homeProfesor"
                                className={({ isActive }) => (isActive ? "active" : "")}
                                onClick={() => setMenuOpen(false)}
                            >
                                Inicio
                            </NavLink>
                        </li>
                    )}
                    {userRole === "alumno" && (
                        <li>
                            <NavLink
                                to="/homeAlumno"
                                className={({ isActive }) => (isActive ? "active" : "")}
                                onClick={() => setMenuOpen(false)}
                            >
                                Inicio
                            </NavLink>
                        </li>
                    )}
                    {userRole === "EDP" || userRole === "jefeUTP" || userRole === "administrador" && (
                        <li>
                            <NavLink
                                to="/home"
                                className={({ isActive }) => (isActive ? "active" : "")}
                                onClick={() => setMenuOpen(false)}
                            >
                                Inicio
                            </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink
                            to="/auth"
                            className={({ isActive }) => (isActive ? "active" : "")}
                            onClick={() => {
                                logoutSubmit();
                                setMenuOpen(false);
                            }}
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Icono de la campana */}
            <div className="notificaciones-wrapper">
                <div className="notificaciones" onClick={toggleNotificaciones}>
                    <FaBell size={24} color={notificaciones.length > 0 ? "red" : "black"} />
                    {notificaciones.length > 0 && (
                        <span className="badge">{notificaciones.length}</span>
                    )}
                </div>

                {/* Pop-up de notificaciones */}
                {mostrarNotificaciones && (
                    <div className="notificaciones-popup">
                        {notificaciones.length === 0 ? (
                            <p>No hay notificaciones</p>
                        ) : (
                            <ul>
                                {notificaciones.map((mensaje, index) => (
                                    <li key={index}>{mensaje}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;
