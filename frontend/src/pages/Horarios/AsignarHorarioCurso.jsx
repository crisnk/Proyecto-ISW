import { useState, useEffect, useCallback } from "react";
import {
  getCursos,
  getMaterias,
  getHorarioCurso,
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
  const [cursoEspecifico, setCursoEspecifico] = useState("");
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initializeHorario = useCallback(() => {
    const newHorario = {};
    diasSemana.forEach((dia) => {
      newHorario[dia] = {};
      horas.forEach((hora) => {
        newHorario[dia][hora] = "Sin asignar";
      });
    });
    return newHorario;
  }, []);

  const fetchHorarioCurso = useCallback(async () => {
    if (!cursoEspecifico) return;
    setLoading(true);
    try {
      const existingHorario = await getHorarioCurso(cursoEspecifico);
      const formattedHorario = initializeHorario();

      if (existingHorario && Array.isArray(existingHorario)) {
        existingHorario.forEach((item) => {
          formattedHorario[item.dia][item.bloque] = item.ID_materia;
        });
      }

      setHorario(formattedHorario);
      setError("");
    } catch (err) {
      console.error("Error al cargar el horario del curso:", err);
      setError("Error al cargar el horario.");
    } finally {
      setLoading(false);
    }
  }, [cursoEspecifico, initializeHorario]);

  useEffect(() => {
    fetchHorarioCurso();
  }, [cursoEspecifico, fetchHorarioCurso]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setCursos(await getCursos());
      } catch (err) {
        console.error("Error al cargar cursos:", err);
      }
    };
    fetchCursos();
  }, []);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setMaterias(await getMaterias());
      } catch (err) {
        console.error("Error al cargar materias:", err);
      }
    };
    fetchMaterias();
  }, []);

  const handleGuardarHorario = async () => {
    try {
      const cambios = [];

      diasSemana.forEach((dia) => {
        horas.forEach((hora) => {
          const materia = horario[dia]?.[hora];
          if (materia && materia !== "Sin asignar") {
            cambios.push({
              ID_materia: parseInt(materia, 10), // Convertimos a entero
              dia,
              bloque: hora,
            });
          }
        });
      });

      if (cambios.length === 0) {
        setError("No hay cambios válidos para guardar.");
        return;
      }

      console.log("Datos preparados para guardar en curso:", { cursoId: cursoEspecifico, horario: cambios });

      await saveHorarioCurso(cursoEspecifico, cambios);
      setSuccess("Horario del curso guardado correctamente.");
      setError("");
    } catch (error) {
      console.error("Error al guardar el horario del curso:", error);
      setError("Error al guardar el horario.");
    }
  };

  return (
    <div>
      <h2>Asignar Horario a Cursos</h2>
      <div>
        <label>Curso: </label>
        <select value={cursoEspecifico} onChange={(e) => setCursoEspecifico(e.target.value)}>
          <option value="">Selecciona curso</option>
          {cursos.map((curso) => (
            <option key={curso.ID_curso} value={curso.ID_curso}>
              {curso.nombre}
            </option>
          ))}
        </select>
      </div>
      {cursoEspecifico && (
        <EditarTablaHorarioCurso
          horario={horario}
          diasSemana={diasSemana}
          horas={horas}
          materias={materias}
          onMateriaChange={(dia, hora, materia) => {
            setHorario((prev) => ({
              ...prev,
              [dia]: {
                ...prev[dia],
                [hora]: materia,
              },
            }));
          }}
        />
      )}
      <button onClick={handleGuardarHorario} disabled={loading}>
        Guardar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AsignarHorarioCurso;
