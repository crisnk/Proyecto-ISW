import { useState, useEffect } from 'react';
import { obtenerMaterias, obtenerCursos } from '@services/horario.service.js';
import '@styles/horarios.css';

const materiaColores = {
    Matemáticas: 'lightblue',
    Historia: 'lightyellow',
    Lenguaje: 'lightcoral',
    Biología: 'lightgreen',
    Química: 'lightpink',
    Física: 'lightgoldenrodyellow',
    'Educación Física': 'lightgray',
    Tecnología: 'lightseagreen',
    'Especialidad de Mecánica': 'lightsalmon',
    'Especialidad de Electricidad': 'lightsteelblue',
};

const AsignarHorarioCurso = () => {
    const [materias, setMaterias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');
    const [horario, setHorario] = useState([]);
    const [bloqueActivo, setBloqueActivo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const materiasData = await obtenerMaterias();
                const cursosData = await obtenerCursos();
                setMaterias(materiasData);
                setCursos(cursosData);
            } catch (error) {
                console.error('Error al obtener materias o cursos:', error);
            }
        };
        fetchData();
    }, []);

    const manejarClickBloque = (e, dia, hora) => {
        if (e.target.closest('.selector-contenedor')) return;

        if (bloqueActivo && bloqueActivo.dia === dia && bloqueActivo.hora === hora) {
            setBloqueActivo(null);
        } else {
            setBloqueActivo({ dia, hora });
        }
    };

    const guardarSeleccion = (materia) => {
        if (materia && cursoSeleccionado) {
            setHorario((prevHorario) => [
                ...prevHorario,
                { ...bloqueActivo, materia, profesor: 'Asignado', curso: cursoSeleccionado }
            ]);
            setBloqueActivo(null);
        }
    };

    return (
        <div>
            <h2>Asignar Horario a Curso</h2>
            <select onChange={(e) => setCursoSeleccionado(e.target.value)}>
                <option value="">Seleccione un curso</option>
                {cursos.map((curso) => (
                    <option key={curso.ID_curso} value={curso.nombre}>{curso.nombre}</option>
                ))}
            </select>
            {cursoSeleccionado && (
                <div className="cuadricula-horario">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
                        <div key={dia} className="columna-dia">
                            <h3>{dia}</h3>
                            {['08:10-09:40', '09:55-11:25', 'Recreo', '11:35-12:55', '13:00-14:00', 'Recreo', '14:15-15:30', '15:40-17:00'].map((hora) => (
                                <div
                                    key={`${dia}-${hora}`}
                                    className={`bloque-horario ${hora === 'Recreo' ? 'recreo' : 'clase'}`}
                                    style={{
                                        backgroundColor:
                                            horario.find(h => h.dia === dia && h.hora === hora)?.materia
                                                ? materiaColores[horario.find(h => h.dia === dia && h.hora === hora).materia]
                                                : 'transparent'
                                    }}
                                    onClick={hora !== 'Recreo' ? (e) => manejarClickBloque(e, dia, hora) : undefined}
                                >
                                    {hora === 'Recreo' ? 'Recreo' : `${hora}`}
                                    {bloqueActivo && bloqueActivo.dia === dia && bloqueActivo.hora === hora && (
                                        <div className="selector-contenedor">
                                            <label>
                                                Materia:
                                                <select onChange={(e) => guardarSeleccion(e.target.value, cursoSeleccionado)}>
                                                    <option value="">Seleccione una materia</option>
                                                    {materias.map((materia) => (
                                                        <option key={materia.ID_materia} value={materia.nombre}>{materia.nombre}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
            <button className="form-button" onClick={() => console.log(horario)}>Guardar Horario Curso</button>
        </div>
    );
};

export default AsignarHorarioCurso;
