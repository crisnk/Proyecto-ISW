import { useState, useEffect } from "react";
import {
  getMaterias,
  getCursos,
  crearMateria,
  crearCurso,
  eliminarMateria,
  eliminarCurso,
} from "../../services/horario.service";
import "@styles/Horarios/materias.css";

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [newMateria, setNewMateria] = useState("");
  const [newCurso, setNewCurso] = useState({ nombre: "", aula: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const materiasData = await getMaterias();
      const cursosData = await getCursos();
      setMaterias(materiasData);
      setCursos(cursosData);
      setError("");
    } catch (err) {
      setError("Error al cargar datos.");
    }
  };

  const handleCreateMateria = async () => {
    if (!newMateria.trim()) {
      setError("El nombre de la materia no puede estar vacío.");
      return;
    }
    try {
      const response = await crearMateriaService({ nombre: newMateria });
      setMaterias([...materias, response]);
      setNewMateria("");
      setSuccess("Materia creada correctamente.");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al crear materia.");
      setSuccess("");
    }
  };

  const handleCreateCurso = async () => {
    if (!newCurso.nombre.trim() || !newCurso.aula.trim()) {
      setError("El nombre y aula del curso son obligatorios.");
      return;
    }
    try {
      const response = await crearCursoService(newCurso);
      setCursos([...cursos, response]);
      setNewCurso({ nombre: "", aula: "" });
      setSuccess("Curso creado correctamente.");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al crear curso.");
      setSuccess("");
    }
  };

  const handleDeleteMateria = async (ID_materia) => {
    try {
      await eliminarMateria(ID_materia);
      setMaterias(materias.filter((materia) => materia.ID_materia !== ID_materia));
      setSuccess("Materia eliminada correctamente.");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Error al eliminar materia.");
      setSuccess("");
    }
  };

  const handleDeleteCurso = async (ID_curso) => {
    try {
      await eliminarCurso(ID_curso);
      setCursos(cursos.filter((curso) => curso.ID_curso !== ID_curso));
      setSuccess("Curso eliminado correctamente.");
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Error al eliminar curso.");
      setSuccess("");
    }
  };

  return (
    <div className="materias-container">
      <h2>Gestión de Materias y Cursos</h2>
      
      <div className="form-section">
        <h3>Crear Materia</h3>
        <input
          type="text"
          placeholder="Nombre de la materia"
          value={newMateria}
          onChange={(e) => {
            setNewMateria(e.target.value);
            setError("");
          }}
        />
        <button onClick={handleCreateMateria}>Crear</button>
      </div>
      
      <div className="form-section">
        <h3>Crear Curso</h3>
        <input
          type="text"
          placeholder="Nombre del curso"
          value={newCurso.nombre}
          onChange={(e) => {
            setNewCurso({ ...newCurso, nombre: e.target.value });
            setError("");
          }}
        />
        <input
          type="text"
          placeholder="Aula"
          value={newCurso.aula}
          onChange={(e) => {
            setNewCurso({ ...newCurso, aula: e.target.value });
            setError("");
          }}
        />
        <button onClick={handleCreateCurso}>Crear</button>
      </div>

      <div className="list-section">
        <h3>Materias Existentes</h3>
        <ul>
          {materias.map((materia) => (
            <li key={materia.ID_materia}>
              {materia.nombre}
              <button onClick={() => handleDeleteMateria(materia.ID_materia)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h3>Cursos Existentes</h3>
        <ul>
          {cursos.map((curso) => (
            <li key={curso.ID_curso}>
              {curso.nombre} - Aula: {curso.aula}
              <button onClick={() => handleDeleteCurso(curso.ID_curso)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Materias;
