import { useState, useEffect, useCallback } from "react";
import VerTablaHorario from "../../components/Horarios/VerTablaHorario";
import Filters from "../../components/Horarios/Filters";
import { getHorarios } from "../../services/horario.service";

const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const horas = [
  "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
  "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
  "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
  "16:10 - 16:55", "17:00 - 17:45"
];

const VerHorarios = () => {
  const [horario, setHorario] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTable, setShowTable] = useState(false);

  const initializeEmptyHorario = useCallback(() => {
    const emptyHorario = {};
    diasSemana.forEach((dia) => {
      emptyHorario[dia] = {};
      horas.forEach((hora) => {
        emptyHorario[dia][hora] = { materia: "Sin asignar", curso: "", profesor: "" };
      });
    });
    return emptyHorario;
  }, []);

  const formatHorario = useCallback((data) => {
    const formatted = initializeEmptyHorario();
    data.forEach((bloque) => {
      if (formatted[bloque.dia]?.[bloque.bloque]) {
        formatted[bloque.dia][bloque.bloque] = {
          materia: bloque.materia?.nombre || "Sin asignar",
          curso: bloque.curso?.nombre || "",
          profesor: bloque.profesor?.nombreCompleto || "",
        };
      }
    });
    return formatted;
  }, [initializeEmptyHorario]);

  const fetchHorarios = useCallback(async (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setShowTable(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getHorarios(filters);
      if (response.data.length > 0) {
        setHorario(formatHorario(response.data));
        setShowTable(true);
      } else {
        setHorario(initializeEmptyHorario());
        setError("No se encontraron horarios para los filtros seleccionados.");
        setShowTable(false);
      }
    } catch (err) {
      setError("Error al cargar horarios.", err);
      setShowTable(false);
    } finally {
      setLoading(false);
    }
  }, [formatHorario, initializeEmptyHorario]);

  useEffect(() => {
    fetchHorarios(filters);
  }, [filters, fetchHorarios]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <h1>Ver Horarios</h1>
      <Filters onChange={handleFilterChange} />
      {loading ? (
        <p>Cargando horarios...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        showTable && <VerTablaHorario horario={horario} diasSemana={diasSemana} horas={horas} />
      )}
    </div>
  );
};

export default VerHorarios;
