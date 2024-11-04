import { useNavigate } from 'react-router-dom';
import '@styles/horarios.css';

const HorariosProfesor = () => {
    const navigate = useNavigate();

    return (
        <main className="container">
            <h1>Ver Horarios</h1>
            <div className="buttons-container">
                <button onClick={() => navigate('/horarios/profesores')} className="button-style">Ver Horarios de Profesores</button>
                <button onClick={() => navigate('/horarios/cursos')} className="button-style">Ver Horarios de Cursos</button>
            </div>
        </main>
    );
};

export default HorariosProfesor;
