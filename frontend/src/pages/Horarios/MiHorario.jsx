import { useState, useEffect } from "react";
import VerTablaHorarioAlumno from "../../hooks/Horarios/VerTablaHorarioAlumno";
import { getHorariosAlumno } from "../../services/horario.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "@styles/Horarios/miHorario.css";

const MiHorario = () => {
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
    "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
    "16:10 - 16:55", "17:00 - 17:45",
  ];

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const data = await getHorariosAlumno();

        const formattedHorario = {};
        diasSemana.forEach((dia) => {
          formattedHorario[dia] = {};
          horas.forEach((hora) => {
            formattedHorario[dia][hora] = {
              materia: "Sin asignar",
              profesor: "Sin profesor",
              curso: "Sin curso",
            };
          });
        });

        data.forEach((bloque) => {
          if (formattedHorario[bloque.dia]?.[bloque.bloque]) {
            formattedHorario[bloque.dia][bloque.bloque] = {
              materia: bloque.nombre_materia || "Sin asignar",
              profesor: bloque.nombre_profesor || "Sin profesor",
              curso: bloque.nombre_curso || "Sin curso",
            };
          }
        });

        setHorario(formattedHorario);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el horario.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  const handleExportToPNG = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const link = document.createElement("a");
      link.download = `Mi_Horario.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
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
      pdf.save(`Mi_Horario.pdf`);
    } catch (err) {
      setError("Error al exportar el horario como PDF.");
    }
  };

  return (
    <div className="mi-horario">
      <h1>Mi Horario</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <VerTablaHorarioAlumno horario={horario} diasSemana={diasSemana} horas={horas} />
          <div className="export-buttons">
            <button onClick={handleExportToPNG}>Exportar como PNG</button>
            <button onClick={handleExportToPDF}>Exportar como PDF</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MiHorario;
