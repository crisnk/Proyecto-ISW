import { useState, useEffect } from "react";
import VerTablaHorarioCurso from "@hooks/Horarios/VerTablaHorarioCurso";
import { getCursos, getHorariosCurso } from "@services/horario.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VerHorarioCurso = () => {
  const [curso, setCurso] = useState("");
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); 

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
    "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
    "16:10 - 16:55", "17:00 - 17:45",
  ];

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const data = await getCursos();
        setCursos(data);
        setError("");
      } catch {
        setError("Error al cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const fetchHorario = async () => {
    if (!curso) {
      setHorario({});
      setNoData(false);
      return;
    }
  
    try {
      setLoading(true);
      const data = await getHorariosCurso(curso);
  
      const formattedHorario = {};
      diasSemana.forEach((dia) => {
        formattedHorario[dia] = {};
        horas.forEach((hora) => {
          formattedHorario[dia][hora] = {
            materia: "Sin asignar",
            profesor: "Sin profesor",
          };
        });
      });
  
      if (data && Array.isArray(data)) {
        data.forEach((bloque) => {
          if (formattedHorario[bloque.dia]?.[bloque.bloque]) {
            formattedHorario[bloque.dia][bloque.bloque] = {
              materia: bloque.nombre_materia || "Sin asignar",
              profesor: bloque.nombre_profesor || "Sin profesor",
            };
          }
        });
      }
  
      const hasAssignments = data && data.some((bloque) => bloque.nombre_materia || bloque.nombre_profesor);
  
      if (!hasAssignments) {
        setNoData(true); 
        setHorario({});
        return;
      }
      setHorario(formattedHorario);
      setError(""); 
      setNoData(false); 
    } catch (e) {
      console.error("Error al cargar el horario:", e); 
      setHorario({});
      setError("No hay materias ni profesores asignados para este horario."); 
      setNoData(false); 
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchHorario();
  }, [curso]);

  const handleExportToPNG = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const link = document.createElement("a");
      link.download = `Horario_Curso_${curso}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setError("Error al exportar el horario como PNG.");
    }
  };

  const handleExportToPDF = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Horario_Curso_${curso}.pdf`);
    } catch {
      setError("Error al exportar el horario como PDF.");
    }
  };

  return (
    <div>
      <h1>Horario del Curso</h1>
      <select
        value={curso}
        onChange={(e) => {
          setCurso(e.target.value);
          setError("");
          setNoData(false);
        }}
      >
        <option value="">Seleccione un curso</option>
        {cursos.map((c) => (
          <option key={c.ID_curso} value={c.ID_curso}>
            {c.nombre}
          </option>
        ))}
      </select>
      {loading && <p>Cargando horario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {noData && <p>No hay materias o profesores asignados para este curso.</p>}
      {curso && !loading && !noData && (
        <>
          <VerTablaHorarioCurso horario={horario} diasSemana={diasSemana} horas={horas} />
          <div className="export-buttons" style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleExportToPNG}>Exportar como PNG</button>
            <button onClick={handleExportToPDF}>Exportar como PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerHorarioCurso;
