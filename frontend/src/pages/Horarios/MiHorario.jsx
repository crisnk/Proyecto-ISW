import { useState, useEffect } from "react";
import VerTablaHorario from "../../hooks/Horarios/VerTablaHorario";
import { getHorariosByAlumno } from "../../services/horario.service";
import "@styles/Horarios/miHorario.css";

const MiHorario = () => {
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const data = await getHorariosByAlumno();
        
        const formattedHorario = {};
        data.forEach((bloque) => {
          if (!formattedHorario[bloque.dia]) {
            formattedHorario[bloque.dia] = {};
          }
          formattedHorario[bloque.dia][bloque.bloque] = {
            materia: bloque.nombre_materia || "Sin asignar",
            profesor: bloque.nombre_profesor || "Sin profesor",
          };
        });
        
        setHorario(formattedHorario);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar el horario.");
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  return (
    <div className="mi-horario">
      <h1>Mi Horario</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <VerTablaHorario horario={horario} />
      )}
    </div>
  );
};

export default MiHorario;
