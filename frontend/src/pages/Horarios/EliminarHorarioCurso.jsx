import { useState, useEffect } from "react";
import EliminarTablaHorarioCurso from "../../hooks/Horarios/EliminarTablaHorarioCurso";
import { getCursos, getHorariosCurso, eliminarHorarioCurso } from "../../services/horario.service";
import Swal from "sweetalert2";
import "@styles/Horarios/eliminarHorario.css";

const EliminarHorarioCurso = () => {
  const [selectedId, setSelectedId] = useState("");
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  // Cargar lista de cursos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const data = await getCursos();
        setCursos(data.map((curso) => ({ value: curso.ID_curso, label: curso.nombre })));
      } catch {
        Swal.fire("Error", "No se pudieron cargar los cursos.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  // Cargar horario del curso seleccionado
  const fetchHorario = async () => {
    if (!selectedId) {
      setHorario({});
      setNoData(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getHorariosCurso(selectedId);
      if (!data || data.length === 0) {
        setNoData(true);
        setHorario({});
        return;
      }

      const formattedHorario = {};
      data.forEach(({ dia, bloque, nombre_materia, nombre_profesor }) => {
        if (!formattedHorario[dia]) formattedHorario[dia] = {};
        formattedHorario[dia][bloque] = {
          materia: nombre_materia || "Sin asignar",
          profesor: nombre_profesor || "Sin profesor",
        };
      });

      setHorario(formattedHorario);
      setNoData(false);
    } catch {
      Swal.fire("Error", "No hay horario asignado para este curso.", "error");
      setNoData(true);
      setHorario({});
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminación del horario
  const handleEliminarHorario = async () => {
    if (!selectedId) {
      Swal.fire("Advertencia", "Seleccione un curso antes de eliminar el horario.", "warning");
      return;
    }

    const confirmation = await Swal.fire({
      title: "¿Está seguro?",
      text: "Esto eliminará todo el horario del curso seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const response = await eliminarHorarioCurso(selectedId);
      Swal.fire("Éxito", response.message, "success");
      fetchHorario(); // Actualiza el horario después de eliminar
    } catch {
      Swal.fire("Error", "No se pudo eliminar el horario. Intente nuevamente.", "error");
    }
  };

  // Actualizar horario cuando se selecciona un curso
  useEffect(() => {
    if (selectedId) fetchHorario();
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
      {noData && !loading && (
        <p className="mensaje-sin-datos">No hay horarios disponibles para este curso.</p>
      )}
      {Object.keys(horario).length > 0 && !noData && !loading && (
        <EliminarTablaHorarioCurso horario={horario} onEliminarHorario={handleEliminarHorario} />
      )}
    </div>
  );
};

export default EliminarHorarioCurso;
