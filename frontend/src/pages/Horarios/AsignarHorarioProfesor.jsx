import { useState, useEffect, useCallback } from "react";
import {
  getProfesores,
  getMaterias,
  getCursos,
  getHorarioProfesor,
  saveHorarioProfesor,
} from "../../services/horario.service";
import EditarTablaHorarioProfesor from "../../components/Horarios/EditarTablaHorarioProfesor";

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

const AsignarHorarioProfesor = () => {
  const [profesor, setProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const initializeHorario = useCallback((existingHorario) => {
    const formattedHorario = {};

    diasSemana.forEach((dia) => {
      formattedHorario[dia] = {};
      horas.forEach((hora) => {
        formattedHorario[dia][hora] = { materia: "Sin asignar", curso: "Sin asignar" };
      });
    });

    if (existingHorario) {
      existingHorario.forEach((item) => {
        formattedHorario[item.dia][item.bloque] = {
          materia: item.ID_materia.toString(),
          curso: item.ID_curso.toString(),
        };
      });
    }

    return formattedHorario;
  }, []);

  const fetchHorarioProfesor = useCallback(async () => {
    if (!profesor) return;

    setLoading(true);
    try {
      const existingHorario = await getHorarioProfesor(profesor);
      setHorario(initializeHorario(existingHorario));
    } catch (error) {
      console.error("Error al cargar el horario:", error);
      setError("Error al cargar el horario.");
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
      } catch (err) {
        console.error("Error al cargar materias:", err);
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setProfesores(await getProfesores());
      } catch (err) {
        console.error("Error al cargar profesores:", err);
      }
    };
    fetchProfesores();
  }, []);

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

  const handleGuardarHorario = async () => {
    try {
      const cambios = diasSemana.flatMap((dia) =>
        horas.map((hora) => {
          const { materia, curso } = horario[dia]?.[hora] || {};
          if (materia !== "Sin asignar" && curso !== "Sin asignar") {
            return {
              ID_materia: parseInt(materia, 10),
              ID_curso: parseInt(curso, 10),
              dia,
              bloque: hora,
            };
          }
          return null;
        }).filter(Boolean)
      );

      const payload = {
        rut: profesor,
        horario: cambios,
      };

      if (payload.horario.length === 0) {
        setError("No se han asignado bloques válidos para guardar.");
        return;
      }

      await saveHorarioProfesor(payload);
      setSuccess("Horario guardado correctamente.");
      setError("");
    } catch (error) {
      console.error("Error al guardar el horario:", error.response?.data || error.message);
      setError("Error al guardar el horario.");
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
      <button onClick={handleGuardarHorario} disabled={loading}>
        Guardar
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AsignarHorarioProfesor;

