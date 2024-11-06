import { useState, useEffect } from 'react';
import { obtenerMaterias, obtenerCursos, obtenerProfesores } from '@services/horario.service.js';
import '@styles/horarios.css';

const AsignarHorarioProfesor = () => {
  const [materias, setMaterias] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState('');
  const [bloqueActivo, setBloqueActivo] = useState(null);
  const [horario, setHorario] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasData = await obtenerMaterias();
        const profesoresData = await obtenerProfesores();
        const cursosData = await obtenerCursos();
        setMaterias(materiasData);
        setProfesores(profesoresData);
        setCursos(cursosData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
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

  const guardarSeleccion = (materia, curso) => {
    if (materia && curso && profesorSeleccionado) {
      setHorario((prevHorario) => [
        ...prevHorario,
        { ...bloqueActivo, materia, profesor: profesorSeleccionado, curso }
      ]);
      setBloqueActivo(null);
    }
  };

  return (
    <div>
      <h2>Asignar Horario a Profesor</h2>
      <label>
        Seleccione un profesor:
        <select onChange={(e) => setProfesorSeleccionado(e.target.value)} value={profesorSeleccionado}>
          <option value="">Seleccione un profesor</option>
          {profesores.map((profesor) => (
            <option key={profesor.rut} value={profesor.nombre}>{profesor.nombre}</option>
          ))}
        </select>
      </label>
      {profesorSeleccionado && (
        <div className="cuadricula-horario">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
            <div key={dia} className="columna-dia">
              <h3>{dia}</h3>
              {['08:10-09:40', '09:55-11:25', 'Recreo', '11:35-12:55', '13:00-14:00', 'Recreo', '14:15-15:30', '15:40-17:00'].map((hora) => (
                <div
                  key={`${dia}-${hora}`}
                  className={`bloque-horario ${hora === 'Recreo' ? 'recreo' : 'clase'}`}
                  onClick={hora !== 'Recreo' ? (e) => manejarClickBloque(e, dia, hora) : undefined}
                >
                  <span className="hora-lateral">{hora}</span>
                  {hora === 'Recreo' ? 'Recreo' : `${hora}`}
                  {bloqueActivo && bloqueActivo.dia === dia && bloqueActivo.hora === hora && (
                    <div className="selector-contenedor">
                      <label>
                        Materia:
                        <select onChange={(e) => guardarSeleccion(e.target.value, 'cursoSeleccionado')}>
                          <option value="">Seleccione una materia</option>
                          {materias.map((materia) => (
                            <option key={materia.ID_materia} value={materia.nombre}>{materia.nombre}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Curso:
                        <select onChange={(e) => guardarSeleccion('materiaSeleccionada', e.target.value)}>
                          <option value="">Seleccione un curso</option>
                          {cursos.map((curso) => (
                            <option key={curso.ID_curso} value={curso.nombre}>{curso.nombre}</option>
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
      <button className="form-button" onClick={() => console.log(horario)}>Guardar Horario Profesor</button>
    </div>
  );
};

export default AsignarHorarioProfesor;
