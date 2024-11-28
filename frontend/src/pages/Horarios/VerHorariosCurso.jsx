import { useState, useEffect } from "react";
import VerTablaHorarioCurso from "@hooks/Horarios/VerTablaHorarioCurso";
import { getCursos, getHorariosCurso } from "@services/horario.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VerHorarioCurso = () => {
  const [curso, setCurso] = useState("");
  const [cursoNombre, setCursoNombre] = useState("");
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false); 

  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
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
      } catch (err) {
        setError("Error al cargar los cursos. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const fetchHorario = async () => {
    if (!curso) return;
    try {
      setLoading(true);
      setNoData(false); 
      const data = await getHorariosCurso(curso);

      const bloques = data[curso] || [];

      if (bloques.length === 0) {
        setNoData(true); 
        setHorario({});
        return;
      }

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

      bloques.forEach((bloque) => {
        if (formattedHorario[bloque.dia]) {
          formattedHorario[bloque.dia][bloque.bloque] = {
            materia: bloque.nombre_materia || "Sin asignar",
            profesor: bloque.nombre_profesor || "Sin profesor",
          };
        }
      });

      setHorario(formattedHorario);
      setError("");
    } catch (err) {
      setError("Error al cargar el horario del curso. Por favor, intente más tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (curso) {
      const cursoSeleccionado = cursos.find((c) => c.ID_curso.toString() === curso);
      setCursoNombre(cursoSeleccionado?.nombre || "");
      fetchHorario();
    }
  }, [curso]);

  const handleExportToPNG = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const link = document.createElement("a");
      link.download = `Horario_Curso_${cursoNombre}.png`;
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
      pdf.save(`Horario_Curso_${cursoNombre}.pdf`);
    } catch {
      setError("Error al exportar el horario como PDF.");
    }
  };

  return (
    <div>
      <h1>Horario del Curso {cursoNombre && `- ${cursoNombre}`}</h1>
      <select value={curso} onChange={(e) => setCurso(e.target.value)}>
        <option value="">Seleccione un curso</option>
        {cursos.map((c) => (
          <option key={c.ID_curso} value={c.ID_curso}>
            {c.nombre}
          </option>
        ))}
      </select>
      {loading && <p>Cargando horario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {noData && <p>No hay horario disponible para el curso seleccionado.</p>}
      {curso && !loading && Object.keys(horario).length > 0 && !noData && (
        <>
          <VerTablaHorarioCurso
            horario={horario} 
            diasSemana={diasSemana} 
            horas={horas} 
            displayFormat={{
              showProfesor: true,
              showMateriaOnly: true, 
              omitCurso: true 
            }}
          />
          <div className="export-buttons">
            <button onClick={handleExportToPNG}>Exportar como PNG</button>
            <button onClick={handleExportToPDF}>Exportar como PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerHorarioCurso;
