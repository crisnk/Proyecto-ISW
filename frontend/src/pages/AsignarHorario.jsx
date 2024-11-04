import { useEffect, useState } from 'react';
import { obtenerCursos, obtenerMaterias, obtenerProfesores } from '@services/horario.service.js';
//import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import '@styles/horarios.css';

const AsignarHorario = () => {
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [horario, setHorario] = useState([]);
  const [bloqueActivo, setBloqueActivo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materiasData = await obtenerMaterias();
        const cursosData = await obtenerCursos();
        const profesoresData = await obtenerProfesores();
        setMaterias(materiasData);
        setCursos(cursosData);
        setProfesores(profesoresData);
      } catch (error) {
        console.error('Error al obtener materias, cursos o profesores:', error);
      }
    };
    fetchData();
  }, []);

  const manejarClickBloque = (dia, hora) => {
    setBloqueActivo({ dia, hora });
  };

  const guardarSeleccion = (materia, profesor, curso) => {
    if (materia && profesor && curso) {
      setHorario((prevHorario) => [
        ...prevHorario,
        { ...bloqueActivo, materia, profesor, curso }
      ]);
      setBloqueActivo(null);
    }
  };

  return (
    <div className="container-horarios">
      <h1 className="horarios-title">Asignar Horario</h1>
      <div className="cuadricula-horario">
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
          <div key={dia} className="columna-dia">
            <h3>{dia}</h3>
            {[
              '08:10-09:40',
              '09:55-11:25',
              '11:35-12:55',
              '13:00-14:00',
              '14:15-15:30',
              '15:40-17:00'
            ].map((hora) => (
              <div
                key={`${dia}-${hora}`}
                className="bloque-horario clase"
                onClick={() => manejarClickBloque(dia, hora)}
              >
                {`${hora}`}
                {bloqueActivo && bloqueActivo.dia === dia && bloqueActivo.hora === hora && (
                  <div className="selector-contenedor">
                    <label>
                      Materia:
                      <select onChange={(e) => guardarSeleccion(e.target.value, 'profesorSeleccionado', 'cursoSeleccionado')}>
                        <option value="">Seleccione una materia</option>
                        {materias.map((materia) => (
                          <option key={materia.id} value={materia.nombre}>{materia.nombre}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Profesor:
                      <select onChange={(e) => guardarSeleccion('materiaSeleccionada', e.target.value, 'cursoSeleccionado')}>
                        <option value="">Seleccione un profesor</option>
                        {profesores.map((profesor) => (
                          <option key={profesor.rut} value={profesor.rut}>{profesor.rut}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Curso:
                      <select onChange={(e) => guardarSeleccion('materiaSeleccionada', 'profesorSeleccionado', e.target.value)}>
                        <option value="">Seleccione un curso</option>
                        {cursos.map((curso) => (
                          <option key={curso.id} value={curso.nombre}>{curso.nombre}</option>
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
      <button className="form-button" onClick={() => console.log(horario)}>
        Guardar Horario
      </button>
    </div>
  );
};

export default AsignarHorario;
