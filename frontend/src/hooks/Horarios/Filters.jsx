import React, { useState, useEffect } from "react";
import { getCursos, getProfesores } from "../../services/horario.service";
import "@styles/Horarios/botones.css";

const Filters = ({ onChange }) => {
  const [filterType, setFilterType] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError("");
      try {
        if (filterType === "curso") {
          const cursos = await getCursos();
          setOptions(cursos.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
        } else if (filterType === "profesor") {
          const profesores = await getProfesores();
          setOptions(
            profesores.map((profesor) => ({ value: profesor.rut, label: profesor.nombreCompleto }))
          );
        } else {
          setOptions([]);
        }
      } catch (err) {
        setError("Error al cargar opciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (filterType) {
      fetchOptions();
      setSelectedValue("");
    }
  }, [filterType]);

  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    onChange({ [filterType]: newValue || null });
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <label htmlFor="filterType" className="filters-label">
          Filtrar por:
        </label>
        <select
          id="filterType"
          onChange={(e) => setFilterType(e.target.value)}
          value={filterType}
          className="filters-select"
        >
          <option value="">Selecciona filtro</option>
          <option value="curso">Curso</option>
          <option value="profesor">Profesor</option>
        </select>
      </div>

      {filterType && !loading && options.length > 0 && (
        <div className="filters-dropdown">
          <label htmlFor="filterOptions" className="filters-label">
            Selecciona {filterType}:
          </label>
          <select
            id="filterOptions"
            onChange={handleFilterChange}
            value={selectedValue}
            className="filters-select"
          >
            <option value="">Selecciona {filterType}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {filterType && !loading && options.length === 0 && (
        <p className="filters-error">No se encontraron opciones para {filterType}.</p>
      )}

      {loading && <p className="filters-loading">Cargando opciones...</p>}
      {error && <p className="filters-error">{error}</p>}
    </div>
  );
};

export default Filters;
