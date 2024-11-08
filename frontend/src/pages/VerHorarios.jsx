import { useState, useCallback, useEffect } from "react";
import Filters from "../components/Filters";
import { getHorarios } from "../services/horario.service";
import TableHorario from "../components/TableHorario";

const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

const VerHorarios = ({ userRole, userCourse }) => {
  const [horarioCompleto, setHorarioCompleto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(userRole === "alumno" ? { curso: userCourse } : {});

  const formatHorarioParaTabla = useCallback((data) => {
    const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
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

    const formatted = {};
    diasSemana.forEach((dia) => {
      formatted[dia] = {};
      horas.forEach((hora) => {
        formatted[dia][hora] = recreoHoras.includes(hora) ? "Recreo" : "Sin asignar";
      });
    });

    data.forEach((item) => {
      const dia = item.dia.toLowerCase().trim();
      const bloque = item.bloque.trim();

      if (formatted[dia] && formatted[dia][bloque] !== "Recreo") {
        formatted[dia][bloque] = `${item.materia.nombre} - ${item.profesor.nombreCompleto}`;
      }
    });

    return formatted;
  }, []);

  const fetchHorarioCompleto = useCallback(async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getHorarios({ ...appliedFilters, page, limit: 10 });
      setHorarioCompleto(formatHorarioParaTabla(data));
      setPagination({ page, totalPages });
    } catch (error) {
      console.error("Error al obtener horario completo:", error);
    } finally {
      setLoading(false);
    }
  }, [formatHorarioParaTabla]);

  useEffect(() => {
    if (userRole === "alumno") {
      fetchHorarioCompleto({ curso: userCourse });
    } else {
      fetchHorarioCompleto(filters);
    }
  }, [userRole, userCourse, fetchHorarioCompleto, filters]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      fetchHorarioCompleto(newFilters);
    },
    [fetchHorarioCompleto]
  );

  return (
    <div>
      <h1>Gestión de Horarios</h1>
      {userRole !== "alumno" && <Filters onChange={handleFilterChange} />}
      {loading && <p>Cargando horario...</p>}
      {horarioCompleto ? (
        <div>
          <TableHorario horario={horarioCompleto} />
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => fetchHorarioCompleto(filters, pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Anterior
            </button>
            <span>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchHorarioCompleto(filters, pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : (
        <p>Selecciona un curso o profesor para ver su horario.</p>
      )}
    </div>
  );
};

export default VerHorarios;
