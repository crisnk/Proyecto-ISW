import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error404 from '@pages/Error404';
import Home from '@pages/Home';
import HomeAlumno from '@pages/HomeAlumno';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Root from '@pages/Root';
import Users from '@pages/Users';
import AtrasosAlumno from '@pages/AtrasosAlumno';
import AtrasosProfesor from '@pages/AtrasosProfesor';
import RegistrarAtraso from '@pages/RegistrarAtraso';
import ProtectedRoute from '@components/ProtectedRoute';
import AsignarHorariosLayout from '@pages/Horarios/AsignarHorariosLayout';
import AsignarHorarioProfesor from '@pages/Horarios/AsignarHorarioProfesor'; 
import AsignarHorarioCurso from '@pages/Horarios/AsignarHorarioCurso';
import VerHorarios from '@pages/Horarios/VerHorarios';
import EliminarHorario from '@pages/Horarios/EliminarHorario';
import MiHorario from '@pages/Horarios/MiHorario';
import Materias from '@pages/Horarios/Materias';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/homeAlumno',
        element: (
          <ProtectedRoute allowedRoles={['alumno']}>
            <HomeAlumno />
          </ProtectedRoute>
        ),      
      },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path:'/atrasos',
        element: (
          <ProtectedRoute allowedRoles={['alumno']}>
            <AtrasosAlumno />
          </ProtectedRoute>
        )
      },
      {
        path:'/atrasosProfesor',
        element: (
          <ProtectedRoute allowedRoles={['profesor', 'alumno']}>
            <AtrasosProfesor />
          </ProtectedRoute>
        )
      },
      {
        path: '/horarios',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP', 'profesor']}>
            <VerHorarios />
          </ProtectedRoute>
        ),
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
            <AsignarHorariosLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'profesor',
            element: <AsignarHorarioProfesor />,
          },
          {
            path: 'curso',
            element: <AsignarHorarioCurso />,
          },
        ],
      },
      {
        path: '/horarios/eliminar',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <EliminarHorario />
          </ProtectedRoute>
        ),
      },
      {
        path: '/atraso/registrar',
        element: ( 
        <ProtectedRoute allowedRoles={['alumno']}>
          < RegistrarAtraso/> 
        </ProtectedRoute>
        ),
      },
      {
        path: '/horarios/materias',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <Materias />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register/>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)