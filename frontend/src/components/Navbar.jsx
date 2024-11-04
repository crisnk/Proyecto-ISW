import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth'); 
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    const toggleMenu = () => {
        if (!menuOpen) {
            removeActiveClass();
        } else {
            addActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    const addActiveClass = () => {
        const links = document.querySelectorAll('.nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    <li>
                        <NavLink 
                                to="/home" 
                                onClick={() => setMenuOpen(false)} 
                                className={({ isActive }) => isActive ? 'active' : ''}
                            >
                            Inicio
                        </NavLink>
                    </li>
                    {userRole === 'administrador' && (
                    <li>
                        <NavLink 
                            to="/users" 
                            onClick={() => { 
                                setMenuOpen(false); 
                                addActiveClass();
                            }} 
                            activeClassName="active"
                        >
                            Usuarios
                        </NavLink>
                    </li>
                    )}
                                        {userRole === 'jefeUTP' && (
                        <>
                            <li>
                                <NavLink to="/horarios/asignar" className={({ isActive }) => (isActive ? 'active' : '')}>
                                    Asignar Horario
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/horarios/curso" className={({ isActive }) => (isActive ? 'active' : '')}>
                                    Horarios de Curso
                                </NavLink>
                            </li>
                        </>
                    )}
                    {userRole === 'profesor' && (
                        <li>
                            <NavLink to="/horarios/profesor" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Horarios de Profesores
                            </NavLink>
                        </li>
                    )}
                    {userRole === 'alumno' && (
                        <li>
                            <NavLink to="/horarios/alumno" className={({ isActive }) => (isActive ? 'active' : '')}>
                                Mi Horario
                                </NavLink>
                        </li>
                    )}
                    <li>
                        <NavLink 
                            to="/auth" 
                            onClick={() => { 
                                logoutSubmit(); 
                                setMenuOpen(false); 
                            }} 
                            activeClassName="active"
                        >
                            Cerrar sesión
                        </NavLink>
                    </li>
                </ul>
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