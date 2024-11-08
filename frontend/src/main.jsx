import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Error404 from '@pages/Error404';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Root from '@pages/Root';
import Users from '@pages/Users';
import ProtectedRoute from '@components/ProtectedRoute';
import AsignarHorarios from '@pages/AsignarHorarios';
import AsignarHorarioProfesor from '@pages/AsignarHorarioProfesor'; 
import AsignarHorarioCurso from '@pages/AsignarHorarioCurso';
import VerHorarios from '@pages/VerHorarios';
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
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/horarios',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP', 'profesor', 'alumno']}>
            <VerHorarios />
          </ProtectedRoute>
        ),
      },
      {
        path: '/horarios/asignar',
        element: (
          <ProtectedRoute allowedRoles={['administrador', 'jefeUTP']}>
            <AsignarHorarios />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'profesor',
            element: <AsignarHorarioProfesor />
          },
          {
            path: 'curso',
            element: <AsignarHorarioCurso />
          }
        ]
      },
    ],
  },
  {
    path: '/auth',
    element: <Login />,
  },
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)