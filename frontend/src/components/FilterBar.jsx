import { useEffect, useState } from "react";
import { obtenerMaterias, obtenerCursos, obtenerProfesores } from "../services/horario.service"; 

export default function FilterBar({ onFilterChange }) {
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedProfesor, setSelectedProfesor] = useState("");

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
        console.error("Error loading filter data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    onFilterChange({
      materia: selectedMateria,
      curso: selectedCurso,
      profesor: selectedProfesor,
    });
  }, [selectedMateria, selectedCurso, selectedProfesor, onFilterChange]);

  return (
    <div className="filter-bar">
      <select value={selectedMateria} onChange={(e) => setSelectedMateria(e.target.value)}>
        <option value="">Todas las Materias</option>
        {materias.map((materia) => (
          <option key={materia.ID_materia} value={materia.ID_materia}>
            {materia.nombre}
          </option>
        ))}
      </select>

      <select value={selectedCurso} onChange={(e) => setSelectedCurso(e.target.value)}>
        <option value="">Todos los Cursos</option>
        {cursos.map((curso) => (
          <option key={curso.ID_curso} value={curso.ID_curso}>
            {curso.nombre}
          </option>
        ))}
      </select>

      <select value={selectedProfesor} onChange={(e) => setSelectedProfesor(e.target.value)}>
        <option value="">Todos los Profesores</option>
        {profesores.map((profesor) => (
          <option key={profesor.rut} value={profesor.rut}>
            {profesor.nombreCompleto}
          </option>
        ))}
      </select>
    </div>
  );
}
