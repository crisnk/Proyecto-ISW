import { useState, useEffect, useCallback } from "react";
import {
  getProfesores,
  getMaterias,
  getHorarioProfesor,
  saveHorarioProfesor,
} from "../services/horario.service";
import EditarTablaHorario from "../components/EditarTablaHorario";

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
const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];
const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];

const AsignarHorarioProfesor = () => {
  const [profesor, setProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
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
        newHorario[dia][hora] = recreoHoras.includes(hora) ? "Recreo" : "Sin asignar";
      });
    });
    return newHorario;
  }, []);

  const fetchHorario = useCallback(async () => {
    if (!profesor) return;
    setLoading(true);
    try {
      const existingHorario = await getHorarioProfesor(profesor);
      if (existingHorario.length > 0) {
        const formattedHorario = initializeHorario();
        existingHorario.forEach((item) => {
          formattedHorario[item.dia][item.bloque] = item.materia.nombre;
        });
        setHorario(formattedHorario);
      } else {
        setHorario(initializeHorario());
      }
      setError("");
    } catch (err) {
      console.error("Error al cargar el horario:", err);
      setError("Error al cargar el horario.");
    } finally {
      setLoading(false);
    }
  }, [profesor, initializeHorario]);

  useEffect(() => {
    fetchHorario();
  }, [profesor, fetchHorario]);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await getMaterias();
        setMaterias(response);
      } catch (err) {
        console.error("Error al cargar materias:", err);
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const response = await getProfesores();
        setProfesores(response);
      } catch (err) {
        console.error("Error al cargar profesores:", err);
      }
    };
    fetchProfesores();
  }, []);

  const handleGuardarHorario = async () => {
    try {
      await saveHorarioProfesor(profesor, horario);
      setSuccess("Horario guardado correctamente.");
      setError("");
    } catch (err) {
      console.error("Error al guardar el horario:", err);
      setError("Error al guardar el horario. Intenta nuevamente.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h2>Asignar Horario a Profesores</h2>
      <div>
        <label>Profesor: </label>
        <select value={profesor} onChange={(e) => setProfesor(e.target.value)}>
          <option value="">Selecciona profesor</option>
          {profesores.map((prof) => (
            <option key={prof.rut} value={prof.rut}>
              {prof.nombreCompleto}
            </option>
          ))}
        </select>
      </div>
      {profesor && !loading && (
        <div style={{ marginTop: "20px" }}>
          <EditarTablaHorario
            horario={horario}
            diasSemana={diasSemana}
            horas={horas}
            materias={materias}
            onMateriaChange={(dia, hora, materia) =>
              setHorario((prev) => ({
                ...prev,
                [dia]: { ...prev[dia], [hora]: materia },
              }))
            }
          />
          <button onClick={handleGuardarHorario}>Guardar Horario</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AsignarHorarioProfesor;
