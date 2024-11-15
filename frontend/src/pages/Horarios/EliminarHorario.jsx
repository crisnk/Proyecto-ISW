import { useState, useEffect, useCallback } from "react";
import { getHorarios, eliminarHorario } from "../../services/horario.service";
import PaginatedTable from "../../components/Horarios/PaginatedTable";
import Filters from "../../components/Horarios/Filters";
import "@styles/Horarios/verHorarios.css";

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
    } catch (err) {
      setError("No se pudieron cargar los horarios.", err);
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
    try {
      await eliminarHorario(id);
      setSuccess("Horario eliminado correctamente.");
      setError("");
      fetchHorarios(filters, pagination.page);
    } catch (err) {
      setError("No se pudo eliminar el horario.", err);
    }
  };

  const columns = [
    { field: "bloque", title: "Bloque Horario" },
    { field: "nombre_materia", title: "Materia" },
    { field: "nombre_profesor", title: "Profesor" },
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
        <p>Cargando horarios...</p>
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
