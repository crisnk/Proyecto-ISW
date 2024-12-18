import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import Form from '@components/Form';
import useLogin from '@hooks/auth/useLogin.jsx';
import '@styles/form.css';
import { jwtDecode } from 'jwt-decode';
import { initSocket } from '@services/socket.service.js';	

const Login = () => {
    const navigate = useNavigate();
    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange
    } = useLogin();

    const loginSubmit = async (data) => {
        try {
            const response = await login(data);
            if (response.status === 'Success') {
                const token = response.data.token; 
                const decodedToken = jwtDecode(token);
                const socket = initSocket();
                const rut = decodedToken.rut; 
                socket.emit('register-user', rut); 
                const rol = decodedToken.rol;      
                if (rol === 'alumno') {
                    navigate('/homeAlumno'); 
                } else if (rol === 'profesor') {
                    navigate('/homeProfesor'); 
                }else {
                    navigate('/home'); 
                }

            } else if (response.status === 'Client error') {
                errorData(response.details);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="container">
<Form
    title="Iniciar sesión"
    fields={[
        {
            label: "Correo electrónico",
            name: "email",
            placeholder: "example@gmail.cl",
            fieldType: 'input',
            type: "email",
            required: true,
            minLength: 15,
            maxLength: 50,
            defaultValue: sessionStorage.getItem('usuario') ? JSON.parse(sessionStorage.getItem('usuario')).email : '',
            errorMessageData: errorEmail,
            validate: {
                emailDomain: (value) => {
                    const validDomains = ['@gmail.cl', '@gmail.com', '@alumnos.ubiobio.cl','@liceo.cl'];
                    return validDomains.some(domain => value.endsWith(domain)) || 'El correo debe terminar en @gmail.cl, @gmail.com o @alumnos.ubiobio.cl o @liceo.cl';
                }
            },
            onChange: (e) => handleInputChange('email', e.target.value),
        },
        {
            label: "Contraseña",
            name: "password",
            placeholder: "**********",
            fieldType: 'input',
            type: "password",
            required: true,
            minLength: 8,
            maxLength: 26,
            pattern: /^[a-zA-Z0-9]+$/,
            patternMessage: "Debe contener solo letras y números",
            defaultValue: '', 
            errorMessageData: errorPassword,
            onChange: (e) => handleInputChange('password', e.target.value)
        },
    ]}
    buttonText="Iniciar sesión"
    onSubmit={loginSubmit}
    footerContent={
        <p>
            ¿No tienes cuenta?, <a href="/register">¡Regístrate aquí!</a>
        </p>
    }
/>

        </main>
    );
};

export default Login;