import { useEffect, useState } from "react";
import { getHorariosByCurso } from "../../services/horario.service"; 
import PaginatedTable from "../../components/Horarios/PaginatedTable"; 

const MiHorario = () => {
  const [horario, setHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("usuario"));
        if (!user || !user.ID_curso) {
          setError("No se encontró información de tu curso.");
          return;
        }
        const data = await getHorariosByCurso(user.ID_curso);
        setHorario(data);
      } catch (err) {
        setError("Error al cargar tu horario.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  const columns = [
    { field: "dia", title: "Día" },
    { field: "bloque", title: "Bloque Horario" },
    { field: "materia", title: "Materia" },
    { field: "profesor", title: "Profesor" },
  ];

  return (
    <div>
      <h2>Mi Horario</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <PaginatedTable
          columns={columns}
          data={Object.entries(horario).flatMap(([dia, bloques]) =>
            Object.entries(bloques).map(([bloque, materia]) => ({
              dia,
              bloque,
              materia: materia || "Sin asignar",
              profesor: materia.profesor || "Sin asignar",
            }))
          )}
          pagination={{ page: 1, totalPages: 1 }} 
        />
      )}
    </div>
  );
};

export default MiHorario;
