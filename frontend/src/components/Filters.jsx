import { useState, useEffect } from "react";
import { getCursos, getProfesores } from "../services/horario.service"; 

const Filters = ({ onChange }) => {
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [filters, setFilters] = useState({
    curso: "",
    profesor: "",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const cursosData = await getCursos();
        const profesoresData = await getProfesores();
        setCursos(cursosData);
        setProfesores(profesoresData);
      } catch (error) {
        console.error("Error al cargar opciones de filtro:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onChange(updatedFilters);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label>
        Curso:
        <select name="curso" value={filters.curso} onChange={handleChange}>
          <option value="">Todos</option>
          {cursos.map((curso) => (
            <option key={curso.id} value={curso.nombre}>
              {curso.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Profesor:
        <select name="profesor" value={filters.profesor} onChange={handleChange}>
          <option value="">Todos</option>
          {profesores.map((profesor) => (
            <option key={profesor.id} value={profesor.nombreCompleto}>
              {profesor.nombreCompleto}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Filters;
