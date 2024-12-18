import { useState, useEffect } from "react";
import VerTablaHorarioAlumno from "../../hooks/Horarios/VerTablaHorarioAlumno";
import { getHorariosAlumno } from "../../services/horario.service";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "@styles/Horarios/miHorario.css";

const pastelColors = [
  "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF",
  "#FFC2E0", "#C2DFFF", "#C2FFD2", "#D1DCFF", "#FFDBE8",
  "#FFD7C2", "#D9C2FF", "#BAE8DB", "#E8FFDB", "#FFDBFF",
];

const MiHorario = () => {
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState(pastelColors[0]);
  const [backgroundColor, setBackgroundColor] = useState("rgba(255, 255, 255, 0.8)");
  const [curso, setCurso] = useState("Sin curso");
  const [cursorURL, setCursorURL] = useState("");

  const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
    "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
    "16:10 - 16:55", "17:00 - 17:45",
  ];

  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const data = await getHorariosAlumno();
        const formattedHorario = {};

        diasSemana.forEach((dia) => {
          formattedHorario[dia] = {};
          horas.forEach((hora) => {
            formattedHorario[dia][hora] = {
              materia: recreoHoras.includes(hora) ? "Recreo" : "Sin asignar",
              profesor: "",
              curso: "",
              color: recreoHoras.includes(hora) ? "#d3d3d3" : "#ffffff", // Color inicial distinto para recreo
            };
          });
        });

        data.forEach((bloque) => {
          if (formattedHorario[bloque.dia]?.[bloque.bloque]) {
            formattedHorario[bloque.dia][bloque.bloque] = {
              materia: bloque.nombre_materia || "Sin asignar",
              profesor: bloque.nombre_profesor || "",
              curso: bloque.nombre_curso || "",
              color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
            };
          }
        });

        setCurso(data[0]?.nombre_curso || "Sin curso");
        setHorario(formattedHorario);
        setError("");
      } catch {
        setError("Error al cargar el horario.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  const handleBlockColorChange = (materia) => {
    const updatedHorario = { ...horario };

    diasSemana.forEach((dia) => {
      horas.forEach((hora) => {
        if (updatedHorario[dia]?.[hora]?.materia === materia) {
          updatedHorario[dia][hora].color = selectedColor;
        }
      });
    });

    setHorario(updatedHorario);
  };

  const handleExportToPNG = async () => {
    const horarioElement = document.querySelector(".tabla-horarios-container");
    if (!horarioElement) return;

    try {
      const canvas = await html2canvas(horarioElement);
      const link = document.createElement("a");
      link.download = `Mi_Horario.png`;
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
      pdf.save(`Mi_Horario.pdf`);
    } catch {
      setError("Error al exportar el horario como PDF.");
    }
  };

  return (
    <div className='alumno-funciones'>
      <div className="mi-horario">
        <h1>Personaliza y descarga tu Horario</h1>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <div className="paleta-colores">
              <h3>Colores para las materias:</h3>
              <div className="colores">
                {pastelColors.map((color) => (
                  <div
                    key={color}
                    className="color-opcion"
                    style={{
                      backgroundColor: color,
                      boxShadow: color === selectedColor ? "0 0 10px black" : "none",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <VerTablaHorarioAlumno
              horario={horario}
              diasSemana={diasSemana}
              horas={horas}
              onBlockColorChange={handleBlockColorChange}
              backgroundColor={backgroundColor}
              curso={curso}
              setCursorURL={setCursorURL}
              selectedColor={selectedColor}
              cursorURL={cursorURL}
            />

            <div className="paleta-colores fondo-horario">
              <h3>Fondo del horario:</h3>
              <div className="colores">
                {pastelColors.map((color) => (
                  <div
                    key={color}
                    className="color-opcion"
                    style={{
                      backgroundColor: color,
                      opacity: 0.8,
                      boxShadow: color === backgroundColor ? "0 0 10px black" : "none",
                    }}
                    onClick={() => setBackgroundColor(color)} 
                  />
                ))}
              </div>
            </div>

            <div className="export-buttons">
              <button onClick={handleExportToPNG}>Exportar como PNG</button>
              <button onClick={handleExportToPDF}>Exportar como PDF</button>
            </div>
          </>
        )}
      </div>
    </div> 
  );
};

export default MiHorario;
