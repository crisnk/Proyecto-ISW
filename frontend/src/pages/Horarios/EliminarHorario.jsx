import { useState, useEffect } from "react";
import EliminarTablaHorario from "../../hooks/Horarios/EliminarTablaHorario";
import {
  getCursos,
  getProfesores,
  getHorariosCurso,
  getHorarioProfesor,
  eliminarHorarioCurso,
  eliminarHorarioProfesor,
} from "../../services/horario.service";
import "@styles/Horarios/eliminarHorario.css";

const EliminarHorario = () => {
  const [selectedId, setSelectedId] = useState("");
  const [filterType, setFilterType] = useState("curso");
  const [options, setOptions] = useState([]);
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
    const fetchOptions = async () => {
      setLoading(true);
      try {
        if (filterType === "curso") {
          const data = await getCursos();
          setOptions(data.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
        } else if (filterType === "profesor") {
          const data = await getProfesores();
          setOptions(data.map((profesor) => ({ value: profesor.rut, label: profesor.nombreCompleto })));
        }
        setError("");
      } catch {
        setError("Error al cargar las opciones. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [filterType]);

  const fetchHorario = async () => {
    if (!selectedId) return;

    setLoading(true);
    try {
      let data;
      if (filterType === "curso") {
        data = await getHorariosCurso(selectedId);
      } else if (filterType === "profesor") {
        data = await getHorarioProfesor(selectedId);
      }

      const bloques = filterType === "curso" ? data[selectedId] || [] : data;

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
      setError("Debe seleccionar un elemento para eliminar el horario.");
      return;
    }

    const confirmMessage =
      filterType === "curso"
        ? "¿Está seguro de que desea eliminar el horario completo de este curso?"
        : "¿Está seguro de que desea eliminar el horario completo de este profesor?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      if (filterType === "curso") {
        await eliminarHorarioCurso(selectedId);
      } else if (filterType === "profesor") {
        await eliminarHorarioProfesor(selectedId);
      }
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
      <h1>Eliminar Horarios</h1>
      <div className="filter-container">
        <label>
          Seleccionar por:
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setSelectedId("");
              setHorario({});
              setNoData(false);
            }}
          >
            <option value="curso">Curso</option>
            <option value="profesor">Profesor</option>
          </select>
        </label>
      </div>
      <div className="options-container">
        <label>
          {filterType === "curso" ? "Curso:" : "Profesor:"}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">Seleccione {filterType}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading && <p className="mensaje-cargando">Cargando horarios...</p>}
      {noData && <p>No se encontraron horarios para la selección.</p>}
      {error && <p className="mensaje-error">{error}</p>}
      {success && <p className="mensaje-exito">{success}</p>}
      {Object.keys(horario).length > 0 && !noData && (
        <EliminarTablaHorario horario={horario} onEliminarHorario={handleEliminarHorario} />
      )}
    </div>
  );
};

export default EliminarHorario;
