import { useState, useEffect } from "react";
import EliminarTablaHorario from "../../hooks/Horarios/EliminarTablaHorario";
import {
  getCursos,
  getHorariosCurso,
  eliminarHorarioCurso,
} from "../../services/horario.service";
import "@styles/Horarios/eliminarHorario.css";

const EliminarHorarioCurso = () => {
  const [selectedId, setSelectedId] = useState("");
  const [cursos, setCursos] = useState([]);
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
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const data = await getCursos();
        setCursos(data.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
        setError("");
      } catch {
        setError("Error al cargar los cursos. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const fetchHorario = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      const data = await getHorariosCurso(selectedId);

      const bloques = data[selectedId] || [];

      if (!bloques || bloques.length === 0) {
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
            profesor: "",
          };
        });
      });

      bloques.forEach((bloque) => {
        if (formattedHorario[bloque.dia]) {
          formattedHorario[bloque.dia][bloque.bloque] = {
            materia: bloque.nombre_materia || "Sin asignar",
            profesor: bloque.nombre_profesor || "",
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
      setError("Debe seleccionar un curso para eliminar el horario.");
      return;
    }

    if (!window.confirm("¿Está seguro de que desea eliminar el horario completo de este curso?")) {
      return;
    }

    try {
      await eliminarHorarioCurso(selectedId);
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
      <h1>Eliminar Horarios de Cursos</h1>
      <div className="options-container">
        <label>
          Curso:
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Seleccione un curso</option>
            {cursos.map((curso) => (
              <option key={curso.value} value={curso.value}>
                {curso.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading && <p className="mensaje-cargando">Cargando horarios...</p>}
      {noData && <p>No se encontraron horarios para el curso seleccionado.</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {success && <p className="mensaje-exito">{success}</p>}
      {Object.keys(horario).length > 0 && !noData && (
        <EliminarTablaHorario horario={horario} onEliminarHorario={handleEliminarHorario} />
      )}
    </div>
  );
};

export default EliminarHorarioCurso;
