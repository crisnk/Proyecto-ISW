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

  const fetchHorarios = useCallback(async (filters) => {
    setLoading(true);
    setError("");
    try {
      const response = await getHorarios(filters);
      if (response.data.length > 0) {
        setHorario(formatHorario(response.data));
      } else {
        setHorario({});
        setError("No se encontraron horarios.");
      }
    } catch (err) {
      console.error("Error al cargar horarios:", err);
      setError("Error al cargar horarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHorarios(filters); 
  }, [fetchHorarios, filters]); 

  const formatHorario = (data) => {
    const formatted = {};
    diasSemana.forEach((dia) => {
      formatted[dia] = {};
      horas.forEach((hora) => {
        const bloque = data.find((h) => h.dia === dia && h.bloque === hora);
        formatted[dia][hora] = bloque
          ? { 
              materia: bloque.materia?.nombre || "Sin asignar", 
              curso: bloque.curso?.nombre || "", 
              profesor: bloque.profesor?.nombreCompleto || ""
            }
          : { materia: "Sin asignar", curso: "", profesor: "" };
      });
    });
    return formatted;
  };

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
        <VerTablaHorario horario={horario} diasSemana={diasSemana} horas={horas} />
      )}
    </div>
  );
};

export default VerHorarios;
