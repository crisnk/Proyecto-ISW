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
        if (data.length === 0) {
          setError("No hay horarios disponibles para tu curso.");
        } else {
          setHorario(data);
        }
      } catch (err) {
        setError("Error al cargar tu horario.",err);
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, []);

  const columns = [
    { field: "dia", title: "Día" },
    { field: "bloque", title: "Bloque Horario" },
    { field: "nombre_materia", title: "Materia" },
    { field: "nombre_profesor", title: "Profesor" },
  ];

  return (
    <div>
      <h2>Mi Horario</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <PaginatedTable
          columns={columns}
          data={horario}
          pagination={{ page: 1, totalPages: 1 }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default MiHorario;
