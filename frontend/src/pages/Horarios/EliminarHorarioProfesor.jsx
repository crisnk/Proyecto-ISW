import { useState, useEffect } from "react";
import EliminarTablaHorario from "../../hooks/Horarios/EliminarTablaHorario";
import {
  getProfesores,
  getHorarioProfesor,
  eliminarHorarioProfesor,
} from "../../services/horario.service";
import "@styles/Horarios/eliminarHorario.css";

const EliminarHorarioProfesor = () => {
  const [selectedId, setSelectedId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [horario, setHorario] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45",
    "08:50 - 09:35",
    "09:40 - 10:25",
    "10:30 - 11:15",
    "11:20 - 12:05",
    "12:10 - 12:55",
    "13:00 - 13:45",
    "14:30 - 15:15",
    "15:20 - 16:05",
    "16:10 - 16:55",
    "17:00 - 17:45",
  ];

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setLoading(true);
        const data = await getProfesores();
        setProfesores(data.map((profesor) => ({ value: profesor.rut, label: profesor.nombreCompleto })));
        setError("");
      } catch {
        setError("Error al cargar los profesores. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  const fetchHorario = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      const data = await getHorarioProfesor(selectedId);

      if (!data || data.length === 0) {
        setNoData(true);
        setHorario({});
        return;
      }

      const formattedHorario = {};
      diasSemana.forEach((dia) => {
        formattedHorario[dia] = {};
        horas.forEach((hora) => {
          formattedHorario[dia][hora] = {
            materia: "Sin asignar",
            curso: "",
          };
        });
      });

      data.forEach((bloque) => {
        if (formattedHorario[bloque.dia]) {
          formattedHorario[bloque.dia][bloque.bloque] = {
            materia: bloque.nombre_materia || "Sin asignar",
            curso: bloque.nombre_curso || "",
          };
        }
      });

      setHorario(formattedHorario);
      setError("");
      setNoData(false);
    } catch {
      setHorario({});
      setError("Error al cargar el horario. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarHorario = async () => {
    if (!selectedId) {
      setError("Debe seleccionar un profesor para eliminar el horario.");
      return;
    }

    if (!window.confirm("¿Está seguro de que desea eliminar el horario completo de este profesor?")) {
      return;
    }

    try {
      await eliminarHorarioProfesor(selectedId);
      setSuccess("Horario eliminado correctamente.");
      fetchHorario();
    } catch {
      setError("Error al eliminar el horario. Intente nuevamente.");
    } finally {
      setTimeout(() => {
        setSuccess("");
        setError("");
      }, 3000);
    }
  };

  useEffect(() => {
    if (selectedId) {
      fetchHorario();
    }
  }, [selectedId]);

  return (
    <div className="eliminar-horarios-container">
      <h1>Eliminar Horarios de Profesores</h1>
      <div className="options-container">
        <label>
          Profesor:
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Seleccione un profesor</option>
            {profesores.map((profesor) => (
              <option key={profesor.value} value={profesor.value}>
                {profesor.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading && <p className="mensaje-cargando">Cargando horarios...</p>}
      {noData && <p>No se encontraron horarios para el profesor seleccionado.</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {success && <p className="mensaje-exito">{success}</p>}
      {Object.keys(horario).length > 0 && !noData && (
        <EliminarTablaHorario horario={horario} onEliminarHorario={handleEliminarHorario} />
      )}
    </div>
  );
};

export default EliminarHorarioProfesor;

