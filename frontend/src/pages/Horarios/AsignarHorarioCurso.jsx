import { useState, useEffect, useCallback } from "react";
import {
  getCursos,
  getMaterias,
  getHorariosByCurso,
  saveHorarioCurso,
  notifyCourse,
  getEmailsByCourse,
} from "../../services/horario.service"; 
import EditarTablaHorarioCurso from "../../components/Horarios/EditarTablaHorarioCurso";

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

const AsignarHorarioCurso = () => {
  const [curso, setCurso] = useState("");
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [notificationError, setNotificationError] = useState("");

  const initializeHorario = useCallback(() => {
    const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];
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
    if (!curso) return;

    setLoading(true);
    try {
      const existingHorario = await getHorariosByCurso(curso);
      const formattedHorario = initializeHorario();

      if (existingHorario.length === 0) {
        setHorario(formattedHorario); 
        return;
      }

      existingHorario.forEach((item) => {
        if (formattedHorario[item.dia]?.[item.bloque]) {
          formattedHorario[item.dia][item.bloque] = {
            materia: item.ID_materia.toString(),
            nombre_materia: item.nombre_materia,
          };
        }
      });

      setHorario(formattedHorario);
      setError("");
    } catch (err) {
      setError("Error al cargar el horario del curso.", err);
      setHorario(initializeHorario()); 
    } finally {
      setLoading(false);
    }
  }, [curso, initializeHorario]);

  useEffect(() => {
    fetchHorarioCurso();
  }, [curso, fetchHorarioCurso]);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const materiasData = await getMaterias();
        setMaterias(materiasData);
      } catch {
        setError("Error al cargar materias.");
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await getCursos();
        setCursos(cursosData);
      } catch {
        setError("Error al cargar cursos.");
      }
    };
    fetchCursos();
  }, []);

  const handleGuardarHorario = async () => {
    if (!curso) {
      setError("Debes seleccionar un curso antes de guardar.");
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
        setError("No se han asignado bloques válidos para guardar.");
        return;
      }

      await saveHorarioCurso(payload);
      setSuccess("Horario guardado correctamente.");
      setError("");
    } catch {
      setError("Error al guardar el horario.");
    } finally {
      setSaving(false);
    }
  };

  const handleMateriaChange = (dia, bloque, value) => {
    const selectedMateria = materias.find((m) => m.ID_materia.toString() === value);

    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [bloque]: {
          ...prev[dia]?.[bloque],
          materia: value,
          nombre_materia: selectedMateria ? selectedMateria.nombre : "Sin asignar",
        },
      },
    }));
  };

  const handleSendNotification = async () => {
    try {
      const { emails } = await getEmailsByCourse(curso);

      if (!emails || emails.length === 0) {
        setNotificationError("No hay correos electrónicos asociados a este curso.");
        return;
      }

      const horarioDetails = `Horario actualizado para el curso: ${cursos.find((c) => c.ID_curso.toString() === curso)?.nombre}`;
      await notifyCourse(emails, horarioDetails); 
      setNotificationSuccess("Notificación enviada correctamente.");
      setNotificationError("");
    } catch {
      setNotificationError("Error al enviar la notificación.");
      setNotificationSuccess("");
    }
  };

  return (
    <div>
      <h2>Asignar Horario a Cursos</h2>
      <div>
        <label>Curso:</label>
        <select value={curso} onChange={(e) => setCurso(e.target.value)}>
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
      <button onClick={handleGuardarHorario} disabled={loading || saving}>
        {saving ? "Guardando..." : "Guardar"}
      </button>
      <button onClick={handleSendNotification} disabled={!curso}>
        Enviar Notificación
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {notificationError && <p style={{ color: "red" }}>{notificationError}</p>}
      {notificationSuccess && <p style={{ color: "green" }}>{notificationSuccess}</p>}
    </div>
  );
};

export default AsignarHorarioCurso;
