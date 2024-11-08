import { useState, useEffect, useCallback } from "react";
import { getCursos, getMaterias, getHorarioCurso, saveHorarioCurso } from "../services/horario.service";
import EditarTablaHorario from "../components/EditarTablaHorario";

const niveles = ["1ro", "2do", "3ro", "4to"];
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

const AsignarHorarioCurso = () => {
  const [nivel, setNivel] = useState("");
  const [cursoEspecifico, setCursoEspecifico] = useState("");
  const [cursosPorNivel, setCursosPorNivel] = useState([]);
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
    if (!cursoEspecifico) return;
    setLoading(true);
    try {
      const existingHorario = await getHorarioCurso(cursoEspecifico);
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
  }, [cursoEspecifico, initializeHorario]);

  useEffect(() => {
    fetchHorario();
  }, [cursoEspecifico, fetchHorario]);

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
    const fetchCursosPorNivel = async () => {
      if (nivel) {
        try {
          const response = await getCursos();
          const cursosFiltrados = response.filter((curso) => curso.nombre.startsWith(nivel));
          setCursosPorNivel(cursosFiltrados.map((curso) => curso.nombre));
        } catch (err) {
          console.error("Error al cargar cursos:", err);
        }
      }
    };
    fetchCursosPorNivel();
  }, [nivel]);

  const handleGuardarHorario = async () => {
    try {
      await saveHorarioCurso(cursoEspecifico, horario);
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
      <h2>Asignar Horario a Cursos</h2>
      <div>
        <label>Nivel: </label>
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="">Selecciona nivel</option>
          {niveles.map((nivelOption) => (
            <option key={nivelOption} value={nivelOption}>
              {nivelOption}
            </option>
          ))}
        </select>
      </div>
      {nivel && (
        <div>
          <label>Curso: </label>
          <select value={cursoEspecifico} onChange={(e) => setCursoEspecifico(e.target.value)}>
            <option value="">Selecciona curso</option>
            {cursosPorNivel.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </div>
      )}
      {cursoEspecifico && !loading && (
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

export default AsignarHorarioCurso;








