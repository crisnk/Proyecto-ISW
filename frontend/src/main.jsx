import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import AsignarHorario from '@pages/AsignarHorario';
import HorariosAlumno from '@pages/HorariosAlumno';
import HorariosProfesor from '@pages/HorariosProfesor';
import HorariosCurso from '@pages/HorariosCurso';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
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
          path: '/horarios/asignar',
          element: (
            <ProtectedRoute allowedRoles={['jefeUTP', 'administrador']}>
              <AsignarHorario />
            </ProtectedRoute>
          ),
        },
        {
          path: '/horarios/alumno',
          element: (
            <ProtectedRoute allowedRoles={['alumno', 'administrador']}>
              <HorariosAlumno />
            </ProtectedRoute>
          ),
        },
        {
          path: '/horarios/profesor',
          element: (
            <ProtectedRoute allowedRoles={['profesor', 'jefeUTP', 'administrador']}>
              <HorariosProfesor />
            </ProtectedRoute>
          ),
        },
        {
          path: '/horarios/curso',
          element: (
            <ProtectedRoute allowedRoles={['alumno', 'profesor', 'jefeUTP', 'administrador']}>
              <HorariosCurso />
            </ProtectedRoute>
          ),
        }
      ]
    },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)