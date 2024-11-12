import { useState, useEffect } from "react";
import VerTablaHorario from "../../components/Horarios/VerTablaHorario";
import { getHorariosByCurso } from "../../services/horario.service";
import "@styles/Horarios/miHorario.css";

const MiHorario = () => {
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("usuario"));
        if (!user || !user.ID_curso) {
          throw new Error("No se encontró información del curso.");
        }

        const data = await getHorariosByCurso(user.ID_curso);
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
        setError(err.message);
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
