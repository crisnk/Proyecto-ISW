import { useState, useEffect, useCallback } from "react";
import {
  getProfesores,
  getMaterias,
  getCursos,
  getHorarioProfesor,
  saveHorarioProfesor,
  notifyProfessor,
  getEmailByProfesor,
} from "../../services/horario.service";
import EditarTablaHorarioProfesor from "../../hooks/Horarios/EditarTablaHorarioProfesor";
import Spinner from "../../hooks/Horarios/Spinner"; 
import { diasSemana, horas, recreoHoras } from "../../hooks/Horarios/HorariosConfig";

const AsignarHorarioProfesor = () => {
  const [profesor, setProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState("");
  const [notificationError, setNotificationError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false); 

  const initializeHorario = useCallback(() => {
    const newHorario = {};
    diasSemana.forEach((dia) => {
      newHorario[dia] = {};
      horas.forEach((hora) => {
        newHorario[dia][hora] = recreoHoras.includes(hora)
          ? { materia: "Recreo", curso: "Recreo" }
          : { materia: "Sin asignar", curso: "Sin asignar" };
      });
    });
    return newHorario;
  }, []);

  const fetchHorarioProfesor = useCallback(async () => {
    if (!profesor) return;
    setLoading(true);
    try {
      const existingHorario = await getHorarioProfesor(profesor);
      const formattedHorario = initializeHorario();
      existingHorario.forEach((item) => {
        if (formattedHorario[item.dia]?.[item.bloque]) {
          formattedHorario[item.dia][item.bloque] = {
            materia: item.materia?.ID_materia.toString() || "Sin asignar",
            curso: item.curso?.ID_curso.toString() || "Sin asignar",
          };
        }
      });
      setHorario(formattedHorario);
      setError("");
    } catch (error) {
      setError("Error al cargar el horario.", error);
    } finally {
      setLoading(false);
    }
  }, [profesor, initializeHorario]);

  useEffect(() => {
    fetchHorarioProfesor();
  }, [profesor, fetchHorarioProfesor]);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setMaterias(await getMaterias());
      } catch {
        setError("Error al cargar materias.");
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setProfesores(await getProfesores());
      } catch {
        setError("Error al cargar profesores.");
      }
    };
    fetchProfesores();
  }, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setCursos(await getCursos());
      } catch {
        setError("Error al cargar cursos.");
      }
    };
    fetchCursos();
  }, []);

  const handleGuardarHorario = async () => {
    if (!profesor) {
      setError("Debes seleccionar un profesor antes de guardar.");
      return;
    }
    setSaving(true);
    try {
      const cambios = diasSemana.flatMap((dia) =>
        horas.map((hora) => {
          const materia = horario[dia]?.[hora]?.materia;
          const curso = horario[dia]?.[hora]?.curso;
          if (materia && curso && materia !== "Sin asignar" && curso !== "Recreo" && curso !== "Sin asignar") {
            return {
              ID_materia: parseInt(materia, 10),
              ID_curso: curso !== "SIN_PROFESOR" ? parseInt(curso, 10) : null,
              rut: profesor || "SIN_PROFESOR",
              dia,
              bloque: hora,
            };
          }
          return null;
        }).filter(Boolean)
      );

      if (cambios.length === 0) {
        setError("No se han asignado bloques válidos.");
        return;
      }

      await saveHorarioProfesor({ rut: profesor || "SIN_PROFESOR", horario: cambios });
      setSuccess("Horario guardado correctamente.");
    } catch {
      setError("Error al guardar el horario.");
    } finally {
      setSaving(false);
    }
  };

  const handleEnviarNotificacion = async () => {
    try {
      setNotificationLoading(true);
      if (!profesor) {
        setNotificationError("Debe seleccionar un profesor antes de enviar la notificación.");
        return;
      }

      const { email } = await getEmailByProfesor(profesor);
      if (!email) {
        setNotificationError("No se encontró el email del profesor.");
        return;
      }

      const bloquesAsignados = Object.entries(horario).flatMap(([dia, bloques]) =>
        Object.entries(bloques).filter(([, detalle]) => detalle.materia !== "Sin asignar").map(([bloque, detalle]) => ({
          dia,
          bloque,
          materia: detalle.materia,
        }))
      );

      if (bloquesAsignados.length === 0) {
        setNotificationError("No hay bloques asignados para notificar.");
        return;
      }

      const horarioDetails = bloquesAsignados
        .map((detalle) => `${detalle.dia} ${detalle.bloque}: ${detalle.materia}`)
        .join("\n");

      await notifyProfessor(email, horarioDetails);
      setNotificationSuccess("Notificación enviada correctamente.");
      setNotificationError("");
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
      setNotificationError("Error al enviar la notificación.");
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleMateriaCursoChange = (dia, bloque, key, value) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [bloque]: {
          ...prev[dia][bloque],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div>
      <h2>Asignar Horario a Profesores</h2>
      <div>
        <label>Profesor:</label>
        <select value={profesor} onChange={(e) => setProfesor(e.target.value)}>
          <option value="">Selecciona profesor</option>
          {profesores.map((p) => (
            <option key={p.rut} value={p.rut}>
              {p.nombreCompleto}
            </option>
          ))}
        </select>
      </div>
      {profesor && (
        <EditarTablaHorarioProfesor
          horario={horario}
          diasSemana={diasSemana}
          horas={horas}
          materias={materias}
          cursos={cursos}
          onMateriaCursoChange={handleMateriaCursoChange}
        />
      )}
      <button onClick={handleGuardarHorario} disabled={loading || saving}>
        {saving ? "Guardando..." : "Guardar"}
      </button>
      <button onClick={handleEnviarNotificacion} disabled={!profesor || notificationLoading}>
        {notificationLoading ? <Spinner /> : "Enviar Notificación"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {notificationError && <p style={{ color: "red" }}>{notificationError}</p>}
      {notificationSuccess && <p style={{ color: "green" }}>{notificationSuccess}</p>}
    </div>
  );
};

export default AsignarHorarioProfesor;
