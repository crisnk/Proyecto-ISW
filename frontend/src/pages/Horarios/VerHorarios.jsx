import { useState, useCallback, useEffect } from "react";
import Filters from "../../components/Horarios/Filters";
import { getHorarios } from "../../services/horario.service";
import PaginatedTable from "../../components/Horarios/PaginatedTable";

const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

const VerHorarios = ({ userRole, userCourse }) => {
  const [horarioCompleto, setHorarioCompleto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState(userRole === "alumno" ? { curso: userCourse } : {});

  const formatHorarioParaTabla = useCallback((data) => {
    return data.map((item) => ({
      dia: item.dia,
      bloque: item.bloque,
      materia: recreoHoras.includes(item.bloque) ? "Recreo" : item.materia?.nombre || "Sin asignar",
      curso: item.curso?.nombre || "Sin asignar",
      profesor: item.profesor?.nombreCompleto || "Sin asignar",
    }));
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

  const handlePageChange = (newPage) => {
    fetchHorarioCompleto(filters, newPage);
  };

  const columns = [
    { field: "dia", title: "Día" },
    { field: "bloque", title: "Bloque Horario" },
    { field: "materia", title: "Materia" },
    { field: "curso", title: "Curso" },
    { field: "profesor", title: "Profesor" },
  ];

  return (
    <div>
      <h1>Gestión de Horarios</h1>
      {userRole !== "alumno" && <Filters onChange={handleFilterChange} />}
      {loading ? (
        <p>Cargando horarios...</p>
      ) : horarioCompleto.length > 0 ? (
        <PaginatedTable
          columns={columns}
          data={horarioCompleto}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      ) : (
        <p>Selecciona un curso o profesor para ver su horario.</p>
      )}
    </div>
  );
};

export default VerHorarios;

