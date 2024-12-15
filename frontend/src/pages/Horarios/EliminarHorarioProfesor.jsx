import { useState, useEffect } from "react";
import EliminarTablaHorarioProfesor from "../../hooks/Horarios/EliminarTablaHorarioProfesor";
import {
  getProfesores,
  getHorarioProfesor,
  eliminarHorarioProfesor,
} from "../../services/horario.service";
import Swal from "sweetalert2";
import "@styles/Horarios/eliminarHorario.css";

const EliminarHorarioProfesor = () => {
  const [selectedId, setSelectedId] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
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
      } catch {
        Swal.fire("Error", "No se pudieron cargar los profesores.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesores();
  }, []);

  // Cargar horario del profesor seleccionado
  const fetchHorario = async () => {
    if (!selectedId) {
      setHorario({});
      setNoData(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getHorarioProfesor(selectedId);

      if (!data || data.length === 0) {
        setNoData(true);
        setHorario({});
        return;
      }

      const formattedHorario = {};
      data.forEach(({ dia, bloque, nombre_materia, nombre_curso }) => {
        if (!formattedHorario[dia]) formattedHorario[dia] = {};
        formattedHorario[dia][bloque] = {
          materia: nombre_materia || "Sin asignar",
          curso: nombre_curso || "Sin curso",
        };
      });

      setHorario(formattedHorario);
      setNoData(false);
    } catch {
      Swal.fire("Advertencia", "No se han asignado horarios para este profesor.", "warning");
      setHorario({});
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarHorario = async () => {
    if (!selectedId) {
      Swal.fire("Advertencia", "Debe seleccionar un profesor antes de eliminar el horario.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "Esto eliminará todo el horario del profesor seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await eliminarHorarioProfesor(selectedId);
      Swal.fire("Éxito", response.message, "success");
      fetchHorario(); 
    } catch {
      Swal.fire("Error", "No se pudo eliminar el horario. Intente nuevamente.", "error");
    }
  };
 
  useEffect(() => {
    if (selectedId) fetchHorario();
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
      {noData && !loading && (
        <p className="mensaje-sin-datos">No hay horarios disponibles para este profesor.</p>
      )}
      {Object.keys(horario).length > 0 && !noData && (
        <EliminarTablaHorarioProfesor horario={horario} onEliminarHorario={handleEliminarHorario} />
      )}
    </div>
  );
};

export default EliminarHorarioProfesor;