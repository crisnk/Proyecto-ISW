import { useState, useEffect } from "react";
import { getCursos, getProfesores } from "../services/horario.service";

const Filters = ({ onChange }) => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (filterType === "curso") {
          const cursos = await getCursos();
          setOptions(cursos.map((curso) => curso.nombre));
        } else if (filterType === "profesor") {
          const profesores = await getProfesores();
          setOptions(profesores.map((profesor) => profesor.nombreCompleto));
        }
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      }
    };

    if (filterType) fetchOptions();
  }, [filterType]);

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue("");
    setOptions([]);
    onChange({ [e.target.value]: "" });
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
    onChange({ [filterType]: e.target.value });
  };

  return (
    <div>
      <select value={filterType} onChange={handleFilterTypeChange}>
        <option value="">Selecciona filtro</option>
        <option value="curso">Curso</option>
        <option value="profesor">Profesor</option>
      </select>

      {filterType && (
        <select value={filterValue} onChange={handleFilterValueChange}>
          <option value="">Selecciona {filterType}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Filters;
