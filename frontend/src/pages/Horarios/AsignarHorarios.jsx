import { Outlet, NavLink } from 'react-router-dom';


const AsignarHorarios = () => {
  return (
    <div>
      <h1>Asignar Horarios</h1>
      <nav>
        <ul>
          <li>
            <NavLink to="profesor" className={({ isActive }) => (isActive ? 'active' : '')}>
              Asignar a Profesores
            </NavLink>
          </li>
          <li>
            <NavLink to="curso" className={({ isActive }) => (isActive ? 'active' : '')}>
              Asignar a Cursos
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default AsignarHorarios;