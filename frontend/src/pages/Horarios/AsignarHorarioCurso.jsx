import { useState, useEffect, useCallback } from "react";
import {
  getCursos,
  getMaterias,
  getHorarioCurso,
  saveHorarioCurso,
} from "../../services/horario.service";
import EditarTablaHorarioCurso from "../../components/Horarios/EditarTablaHorarioCurso";

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
        newHorario[dia][hora] = "Sin asignar";
      });
    });
    return newHorario;
  }, []);

  const fetchHorarioCurso = useCallback(async () => {
    if (!cursoEspecifico) return;
    setLoading(true);
    try {
      const response = await getHorarioCurso(cursoEspecifico);
      const formattedHorario = initializeHorario();
      Object.entries(response).forEach(([dia, bloques]) => {
        Object.entries(bloques).forEach(([bloque, materia]) => {
          formattedHorario[dia][bloque] = materia;
        });
      });
      setHorario(formattedHorario);
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
    const fetchCursosPorNivel = async () => {
      if (!nivel) return setCursosPorNivel([]);
      try {
        const cursos = await getCursos();
        setCursosPorNivel(cursos.filter((curso) => curso.nombre.startsWith(nivel)));
      } catch (err) {
        console.error("Error al cargar cursos:", err);
      }
    };
    fetchCursosPorNivel();
  }, [nivel]);

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
      await saveHorarioCurso(cursoEspecifico, horario);
      setSuccess("Horario guardado correctamente.");
      setError("");
    } catch (err) {
      console.error("Error al guardar el horario:", err);
      setError("Error al guardar el horario.");
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
              <option key={curso.ID_curso} value={curso.ID_curso}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
      {cursoEspecifico && !loading && (
        <div>
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
          <button onClick={handleGuardarHorario}>Guardar Horario</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AsignarHorarioCurso;



