import { useState, useEffect } from "react";
import { getCursos, getProfesores } from "../../services/horario.service";

const Filters = ({ onChange }) => {
  const [filter, setFilter] = useState({ type: "", value: "" });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError("");
      try {
        if (filter.type === "curso") {
          const cursos = await getCursos();
          setOptions(cursos.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
        } else if (filter.type === "profesor") {
          const profesores = await getProfesores();
          setOptions(profesores.map((profesor) => ({ value: profesor.rut, label: profesor.nombreCompleto })));
        } else {
          setOptions([]);
        }
      } catch (err) {
        console.error("Error al cargar opciones:", err);
        setError("No se pudieron cargar las opciones, inténtelo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    if (filter.type) {
      fetchOptions();
    }
  }, [filter.type]);

  const handleFilterTypeChange = (e) => {
    setFilter({ type: e.target.value, value: "" });
    setOptions([]);
    onChange({ [e.target.value]: "" });
  };

  const handleFilterValueChange = (e) => {
    setFilter((prev) => ({ ...prev, value: e.target.value }));
    onChange({ [filter.type]: e.target.value });
  };

  return (
    <div>
      <select value={filter.type} onChange={handleFilterTypeChange}>
        <option value="">Selecciona filtro</option>
        <option value="curso">Curso</option>
        <option value="profesor">Profesor</option>
      </select>

      {filter.type && !loading && (
        <select value={filter.value} onChange={handleFilterValueChange}>
          <option value="">Selecciona {filter.type}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {loading && <p>Cargando opciones...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Filters;
