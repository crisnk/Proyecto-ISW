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
  "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
  "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
  "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
  "16:10 - 16:55", "17:00 - 17:45",
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

  const initializeHorario = useCallback(() => {
    const newHorario = {};
    diasSemana.forEach((dia) => {
      newHorario[dia] = {};
      horas.forEach((hora) => {
        newHorario[dia][hora] = { materia: "Sin asignar", curso: "Sin asignar" };
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

      if (Array.isArray(existingHorario) && existingHorario.length > 0) {
        existingHorario.forEach((item) => {
          formattedHorario[item.dia][item.bloque] = {
            materia: item.materia.ID_materia,
            curso: item.curso.ID_curso,
          };
        });
      }

      setHorario(formattedHorario);
      setError("");
    } catch (err) {
      console.error("Error al cargar el horario:", err);
      setError("Error al cargar el horario.");
      setHorario(initializeHorario());
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
      const cambios = [];

      diasSemana.forEach((dia) => {
        horas.forEach((hora) => {
          const bloque = horario[dia][hora];
          if (
            bloque.materia !== "Sin asignar" &&
            bloque.materia !== "Recreo" &&
            bloque.curso !== "Sin asignar"
          ) {
            cambios.push({
              ID_materia: bloque.materia,
              ID_curso: bloque.curso,
              dia,
              bloque: hora,
            });
          }
        });
      });

      if (cambios.length === 0) {
        setError("No hay cambios para guardar.");
        return;
      }

      console.log("Datos a enviar al backend:", { rut: profesor, horario: cambios });

      await saveHorarioProfesor(profesor, cambios);

      setSuccess("Horarios guardados correctamente.");
      setError("");
      fetchHorarioProfesor(); // Actualizamos los horarios
    } catch (err) {
      console.error("Error al guardar el horario:", err);
      setError("Error al guardar el horario.");
    }
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
          onMateriaCursoChange={(dia, hora, value, type) =>
            setHorario((prev) => ({
              ...prev,
              [dia]: {
                ...prev[dia],
                [hora]: { ...prev[dia][hora], [type]: value },
              },
            }))
          }
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

