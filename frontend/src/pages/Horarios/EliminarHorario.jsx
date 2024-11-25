import { useState, useEffect, useCallback } from "react";
import { getHorariosConId, eliminarHorario } from "../../services/horario.service";
import EliminarTablaHorario from "../../hooks/Horarios/EliminarTablaHorario";
import Filters from "../../hooks/Horarios/Filters";
import "@styles/Horarios/verHorarios.css";

const EliminarHorario = () => {
  const [horarios, setHorarios] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHorarios = useCallback(async (appliedFilters) => {
    setLoading(true);
    try {
      const { data } = await getHorariosConId({ ...appliedFilters, page: 1, limit: 50 });
      const formattedHorario = {};
      data.forEach((bloque) => {
        if (!formattedHorario[bloque.dia]) {
          formattedHorario[bloque.dia] = {};
        }
        formattedHorario[bloque.dia][bloque.bloque] = {
          materia: bloque.nombre_materia || "Sin asignar",
          profesor: bloque.nombre_profesor || "",
        };
      });
      setHorarios(formattedHorario);
      setError("");
    } catch (err) {
      console.error("Error al cargar horarios:", err);
      setError("Error al cargar horarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    
    fetchHorarios(filters);
  }, [filters, fetchHorarios]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEliminarHorario = async () => {
    try {
      await eliminarHorario(filters);
      setSuccess("Horario eliminado correctamente.");
      setHorarios({}); 

      setTimeout(() => setSuccess(""), 3000); 
    } catch (err) {
      console.error("Error al eliminar horario:", err);
      setError("No se pudo eliminar el horario.");

      setTimeout(() => setError(""), 3000); 
    }
  };

  return (
    <div className="eliminar-horarios-container">
      <h1>Eliminar Horario</h1>
      <Filters onChange={handleFilterChange} />
      {loading ? (
        <p className="mensaje-cargando">Cargando horarios...</p>
      ) : (
        <>
          <EliminarTablaHorario horario={horarios} onEliminarHorario={handleEliminarHorario} />
          {success && <p className="mensaje-exito">{success}</p>}
          {error && <p className="mensaje-error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default EliminarHorario;
