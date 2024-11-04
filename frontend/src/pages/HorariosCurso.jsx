import { useEffect, useState } from 'react';
import { obtenerHorariosCurso } from '@services/horario.service.js';
import '@styles/horarios.css';

const HorariosCurso = () => {
    const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const data = await obtenerHorariosCurso();
                console.log(data); 
                setHorarios(Array.isArray(data) ? data : []); 
            } catch (error) {
                console.error('Error al obtener los horarios:', error);
                setHorarios([]);
            }
        };
        fetchHorarios();
    }, []);
    return (
        <main className="container-horarios">
            <h1 className="horarios-title">Horarios de Cursos</h1>
            <div className="horarios-table">
                {horarios.map((curso, index) => (
                    <div key={index} className="horario-bloque">
                        <p>{`${curso.curso}: ${curso.dia} ${curso.horaInicio} - ${curso.horaFin}`}</p>
                    </div>
                ))}
            </div>
        </main>
    );
    
};
export default HorariosCurso;
