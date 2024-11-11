import { useState, useEffect } from "react";
import { getCursos, getProfesores } from "../../services/horario.service";

const Filters = ({ onChange }) => {
  const [filterType, setFilterType] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        if (filterType === "curso") {
          const cursos = await getCursos();
          setOptions(cursos.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
        } else if (filterType === "profesor") {
          const profesores = await getProfesores();
          setOptions(profesores.map((profesor) => ({ value: profesor.rut, label: profesor.nombreCompleto })));
        } else {
          setOptions([]);
        }
      } catch (error) {
        console.error("Error al cargar opciones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filterType) {
      fetchOptions();
      setSelectedValue(""); // Resetear el valor seleccionado cuando cambie el filtro
    }
  }, [filterType]);

  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue); // Actualiza el valor seleccionado
    onChange({ [filterType]: newValue }); // Propaga el filtro al padre
  };

  return (
    <div>
      <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
        <option value="">Selecciona filtro</option>
        <option value="curso">Curso</option>
        <option value="profesor">Profesor</option>
      </select>

      {filterType && !loading && (
        <select onChange={handleFilterChange} value={selectedValue}>
          <option value="">Selecciona {filterType}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {loading && <p>Cargando opciones...</p>}
    </div>
  );
};

export default Filters;
