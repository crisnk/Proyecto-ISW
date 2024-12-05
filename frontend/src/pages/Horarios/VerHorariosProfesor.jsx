import { useState, useEffect } from "react";
import VerTablaHorarioProfesor from "@hooks/Horarios/VerTablaHorarioProfesor";
import { getProfesores, getHorarioProfesor } from "@services/horario.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const VerHorarioProfesor = () => {
  const [profesor, setProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [horario, setHorario] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
    "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
    "16:10 - 16:55", "17:00 - 17:45",
  ];

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setLoading(true);
        const data = await getProfesores();
        setProfesores(data);
        setError("");
      } catch {
        setError("Error al cargar los profesores.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  const fetchHorario = async () => {
    if (!profesor) {
      setHorario({});
      return;
    }

    try {
      setLoading(true);
      const data = await getHorarioProfesor(profesor);

      const formattedHorario = {};
      diasSemana.forEach((dia) => {
        formattedHorario[dia] = {};
        horas.forEach((hora) => {
          formattedHorario[dia][hora] = {
            materia: "Sin asignar",
            curso: "Sin curso",
          };
        });
      });

      if (Array.isArray(data) && data.length > 0) {
        data.forEach((bloque) => {
          if (formattedHorario[bloque.dia]?.[bloque.bloque]) {
            formattedHorario[bloque.dia][bloque.bloque] = {
              materia: bloque.nombre_materia || "Sin asignar",
              curso: bloque.nombre_curso || "Sin curso",
            };
          }
        });
      }

      setHorario(formattedHorario);
      setError("");
    } catch {
      setHorario({});
      setError("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorario();
  }, [profesor]);

  const handleExportToPNG = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const link = document.createElement("a");
      link.download = `Horario_Profesor_${profesor}.png`;
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
      pdf.save(`Horario_Profesor_${profesor}.pdf`);
    } catch {
      setError("Error al exportar el horario como PDF.");
    }
  };

  return (
    <div>
      <h1>Horario del Profesor</h1>
      <select
        value={profesor}
        onChange={(e) => {
          setProfesor(e.target.value);
          setError("");
        }}
      >
        <option value="">Seleccione un profesor</option>
        {profesores.map((p) => (
          <option key={p.rut} value={p.rut}>
            {p.nombreCompleto}
          </option>
        ))}
      </select>
      {loading && <p>Cargando horario...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {profesor && !loading && (
        <>
          <VerTablaHorarioProfesor horario={horario} diasSemana={diasSemana} horas={horas} />
          <div className="export-buttons">
            <button onClick={handleExportToPNG}>Exportar como PNG</button>
            <button onClick={handleExportToPDF}>Exportar como PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerHorarioProfesor;
