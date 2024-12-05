import { useState, useEffect, useCallback } from "react";
import {
  getCursos,
  getMaterias,
  getHorariosCurso,
  saveHorarioCurso,
  notificacionCurso,
  getEmailsCurso,
} from "../../services/horario.service";
import EditarTablaHorarioCurso from "../../hooks/Horarios/EditarTablaHorarioCurso";
import Spinner from "../../hooks/Horarios/spinner";
import { diasSemana, horas, recreoHoras } from "../../hooks/Horarios/HorariosConfig";
import Swal from "sweetalert2";
import "@styles/Horarios/asignarHorario.css";

const AsignarHorarioCurso = () => {
  const [curso, setCurso] = useState("");
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const initializeHorario = useCallback(() => {
    const newHorario = {};
    diasSemana.forEach((dia) => {
      newHorario[dia] = {};
      horas.forEach((hora) => {
        newHorario[dia][hora] = recreoHoras.includes(hora)
          ? { materia: "Recreo" }
          : { materia: "Sin asignar" };
      });
    });
    return newHorario;
  }, []);

  const fetchHorarioCurso = useCallback(async () => {
    if (!curso) {
      setHorario(initializeHorario());
      return;
    }

    setLoading(true);
    try {
      const response = await getHorariosCurso(curso);
      const formattedHorario = initializeHorario();

      if (response && typeof response === "object" && Object.keys(response).length > 0) {
        Object.entries(response).forEach(([dia, bloques]) => {
          bloques.forEach(({ bloque, ID_materia, nombre_materia }) => {
            if (formattedHorario[dia]?.[bloque]) {
              formattedHorario[dia][bloque] = {
                materia: ID_materia?.toString() || "Sin asignar",
                nombre_materia: nombre_materia || "Sin asignar",
              };
            }
          });
        });
      }

      setHorario(formattedHorario);
    } catch {
      Swal.fire("Error", "No se pudo cargar el horario del curso.", "error");
      setHorario(initializeHorario());
    } finally {
      setLoading(false);
    }
  }, [curso, initializeHorario]);

  const fetchMaterias = useCallback(async () => {
    try {
      const materiasData = await getMaterias();
      setMaterias(materiasData);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las materias.", "error");
    }
  }, []);

  const fetchCursos = useCallback(async () => {
    try {
      const cursosData = await getCursos();
      setCursos(cursosData);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los cursos.", "error");
    }
  }, []);

  useEffect(() => {
    fetchHorarioCurso();
  }, [curso, fetchHorarioCurso]);

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const handleGuardarHorario = async () => {
    if (!curso) {
      Swal.fire("Advertencia", "Debes seleccionar un curso antes de guardar.", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ID_curso: parseInt(curso, 10),
        horario: diasSemana.flatMap((dia) =>
          horas
            .map((hora) => {
              const materia = horario[dia]?.[hora]?.materia;
              if (materia && materia !== "Sin asignar" && materia !== "Recreo") {
                return {
                  ID_materia: parseInt(materia, 10),
                  dia,
                  bloque: hora,
                };
              }
              return null;
            })
            .filter(Boolean)
        ),
      };

      if (payload.horario.length === 0) {
        Swal.fire("Advertencia", "No hay bloques válidos para guardar.", "warning");
        return;
      }

      await saveHorarioCurso(payload);
      await fetchHorarioCurso(); 
      Swal.fire("Éxito", "Horario guardado correctamente.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el horario. Verifica los datos ingresados.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleMateriaChange = (dia, bloque, value) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [bloque]: {
          ...prev[dia]?.[bloque],
          materia: value,
        },
      },
    }));
  };

  const handleSendNotification = async () => {
    if (!curso) {
      Swal.fire("Advertencia", "Debes seleccionar un curso antes de enviar la notificación.", "warning");
      return;
    }

    setNotificationLoading(true);
    try {
      const { emails } = await getEmailsCurso(curso);

      if (!emails || emails.length === 0) {
        Swal.fire("Advertencia", "No hay correos electrónicos asociados al curso.", "warning");
        return;
      }

      const horarioDetails = `Horario actualizado para el curso: ${cursos.find((c) => c.ID_curso.toString() === curso)?.nombre}`;
      await notificacionCurso(emails, horarioDetails);
      Swal.fire("Éxito", "Notificación enviada correctamente.", "success");
    } catch {
      Swal.fire("Error", "No se pudo enviar la notificación.", "error");
    } finally {
      setNotificationLoading(false);
    }
  };

  return (
    <div>
      <h2>Asignar Horario a Cursos</h2>
      <div>
        <label>Curso:</label>
        <select
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
        >
          <option value="">Selecciona curso</option>
          {cursos.map((c) => (
            <option key={c.ID_curso} value={c.ID_curso}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>
      {curso && (
        <EditarTablaHorarioCurso
          horario={horario}
          diasSemana={diasSemana}
          horas={horas}
          materias={materias}
          onMateriaChange={handleMateriaChange}
        />
      )}
      <div className="button-group" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <button onClick={handleGuardarHorario} disabled={saving}>
          {saving ? <Spinner /> : "Guardar"}
        </button>
        <button onClick={handleSendNotification} disabled={notificationLoading || !curso}>
          {notificationLoading ? <Spinner /> : "Enviar Notificación"}
        </button>
      </div>
    </div>
  );
};

export default AsignarHorarioCurso;
