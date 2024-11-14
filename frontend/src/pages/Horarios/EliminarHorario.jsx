import { useState, useEffect, useCallback } from "react";
import { getHorariosConId, eliminarHorario } from "../../services/horario.service";
import PaginatedTable from "../../hooks/Horarios/PaginatedTable";
import Filters from "../../hooks/Horarios/Filters";
import "@styles/Horarios/verHorarios.css";
import { diasSemana, horas } from "../../hooks/Horarios/HorariosConfig";

const EliminarHorario = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHorarios = useCallback(async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getHorariosConId({ ...appliedFilters, page, limit: 10 });

      // Sort data for consistent order
      const sortedData = data.sort((a, b) => {
        if (a.bloque === b.bloque) {
          return diasSemana.indexOf(a.dia) - diasSemana.indexOf(b.dia);
        }
        return horas.indexOf(a.bloque) - horas.indexOf(b.bloque);
      });

      setHorarios(sortedData);
      setPagination({ page, totalPages });
      setError("");
    } catch {
      setError("No se pudieron cargar los horarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHorarios(filters);
  }, [filters, fetchHorarios]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ page: 1, totalPages: pagination.totalPages }); 
  };

  const handlePageChange = (newPage) => {
    fetchHorarios(filters, newPage);
  };

  const handleEliminarHorario = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      try {
        await eliminarHorario(id);
        setSuccess("Horario eliminado correctamente.");
        setError("");
        fetchHorarios(filters, pagination.page);
      } catch {
        setError("No se pudo eliminar el horario.");
      }
    }
  };

  const columns = [
    { field: "bloque", title: "Bloque Horario" },
    { field: "dia", title: "Día" },
    { field: "nombre_materia", title: "Materia" },
    { field: "nombre_profesor", title: "Profesor" },
    { field: "curso", title: "Curso" },
    {
      field: "acciones",
      title: "Acciones",
      render: (row) => (
        <button className="btn-eliminar" onClick={() => handleEliminarHorario(row.id)}>
          Eliminar
        </button>
      ),
    },
  ];

  return (
    <div className="eliminar-horarios-container">
      <h1>Eliminar Horarios</h1>
      <Filters onChange={handleFilterChange} />
      {loading ? (
        <p className="mensaje-cargando">Cargando horarios...</p>
      ) : (
        <PaginatedTable
          columns={columns}
          data={horarios}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
      {error && <p className="mensaje-error">{error}</p>}
      {success && <p className="mensaje-exito">{success}</p>}
    </div>
  );
};

export default EliminarHorario;
