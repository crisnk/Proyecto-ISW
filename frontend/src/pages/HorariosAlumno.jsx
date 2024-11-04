import { useEffect, useState } from 'react';
import { obtenerHorarioAlumno } from '@services/horario.service.js';
import '@styles/horarios.css';

const HorariosAlumno = () => {
    const [horario, setHorario] = useState([]);

    useEffect(() => {
        const fetchHorario = async () => {
            const data = await obtenerHorarioAlumno();
            setHorario(data);
        };
        fetchHorario();
    }, []);

    return (
        <main className="container">
            <h1>Mi Horario</h1>
            <div className="horarios-table">
                {horario.map((bloque, index) => (
                    <div key={index} className="horario-bloque">
                        <p>{`${bloque.dia} ${bloque.horaInicio} - ${bloque.horaFin}`}: {bloque.materia}</p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default HorariosAlumno;
