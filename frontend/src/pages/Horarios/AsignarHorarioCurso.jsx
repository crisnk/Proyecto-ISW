import { useState, useEffect, useCallback } from "react";
import {
  getCursos,
  getMaterias,
  getHorariosByCurso,
  saveHorarioCurso,
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

      existingHorario.forEach((item) => {
        if (formattedHorario[item.dia]?.[item.bloque]) {
          formattedHorario[item.dia][item.bloque] = {
            materia: item.ID_materia ? item.ID_materia.toString() : "Sin asignar",
          };
        }
      });

      setHorario(formattedHorario);
      setError("");
    } catch (err) {
      console.error("Error al cargar el horario:", err);
      setError("Error al cargar el horario.");
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
        setMaterias(await getMaterias());
        setError("");
      } catch (err) {
        console.error("Error al cargar materias:", err);
        setError("Error al cargar materias.");
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setCursos(await getCursos());
        setError("");
      } catch (err) {
        console.error("Error al cargar cursos:", err);
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
          horas.map((hora) => {
            const materia = horario[dia]?.[hora]?.materia;
            if (materia && materia !== "Sin asignar" && materia !== "Recreo") {
              return {
                ID_materia: parseInt(materia, 10),
                dia,
                bloque: hora,
              };
            }
            return null;
          }).filter(Boolean)
        ),
      };

      if (payload.horario.length === 0) {
        setError("No se han asignado bloques válidos para guardar.");
        return;
      }

      await saveHorarioCurso(payload);
      setSuccess("Horario guardado correctamente.");
      setError("");
    } catch (error) {
      console.error("Error al guardar el horario:", error);
      setError("Error al guardar el horario.");
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AsignarHorarioCurso;
