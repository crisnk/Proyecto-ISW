import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error404 from '@pages/Error404';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Root from '@pages/Root';
import Users from '@pages/Users';
import AtrasosAlumno from '@pages/AtrasosAlumno';
import AtrasosProfesor from '@pages/AtrasosProfesor';
import RegistrarAtraso from '@pages/RegistrarAtraso';
import Practica from '@pages/Practica';
import ProtectedRoute from '@components/ProtectedRoute';
import AsignarHorarioProfesor from '@pages/Horarios/AsignarHorarioProfesor';
import AsignarHorarioCurso from '@pages/Horarios/AsignarHorarioCurso';
import VerHorariosLayout from '@pages/Horarios/VerHorariosLayout';
import VerHorariosProfesor from '@pages/Horarios/VerHorariosProfesor';
import VerHorariosCurso from '@pages/Horarios/VerHorariosCurso';
import EliminarHorarioProfesor from '@pages/Horarios/EliminarHorarioProfesor';
import EliminarHorarioCurso from '@pages/Horarios/EliminarHorarioCurso';
import MiHorario from '@pages/Horarios/MiHorario';
import GestionMateriasLayout from '@pages/Horarios/GestionMateriasLayout';
import CrearMateria from '@pages/Horarios/CrearMateria';
import CrearCurso from '@pages/Horarios/CrearCurso';
import MateriasExistentes from '@pages/Horarios/MateriasExistentes';
import CursosExistentes from '@pages/Horarios/CursosExistentes';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: '/home', element: <Home /> },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/practica',
        element: <Practica />,
      },
      {
        path: '/atrasos',
        element: (
          <ProtectedRoute allowedRoles={['alumno']}>
            <AtrasosAlumno />
          </ProtectedRoute>
        ),
      },
      {
        path: '/atrasosProfesor',
        element: (
          <ProtectedRoute allowedRoles={['profesor', 'alumno']}>
            <AtrasosProfesor />
          </ProtectedRoute>
        ),
      },
      {
        path: '/atraso/registrar',
        element: (
          <ProtectedRoute allowedRoles={['alumno']}>
            <RegistrarAtraso />
          </ProtectedRoute>
        ),
      },
      {
        path: '/horarios/ver',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP', 'profesor']}>
            <VerHorariosLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'profesor', element: <VerHorariosProfesor /> },
          { path: 'curso', element: <VerHorariosCurso /> },
        ],
      },
      {
        path: '/horarios/ver/alumno',
        element: (
          <ProtectedRoute allowedRoles={['alumno']}>
            <MiHorario />
          </ProtectedRoute>
        ),
      },
      {
        path: '/horarios/asignar',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <VerHorariosLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'profesor', element: <AsignarHorarioProfesor /> },
          { path: 'curso', element: <AsignarHorarioCurso /> },
        ],
      },
      {
        path: '/horarios/eliminar',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <VerHorariosLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'profesor', element: <EliminarHorarioProfesor /> },
          { path: 'curso', element: <EliminarHorarioCurso /> },
        ],
      },
      {
        path: '/gestion-materias',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <GestionMateriasLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'crear-materia', element: <CrearMateria /> },
          { path: 'crear-curso', element: <CrearCurso /> },
          { path: 'materias-existentes', element: <MateriasExistentes /> },
          { path: 'cursos-existentes', element: <CursosExistentes /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
