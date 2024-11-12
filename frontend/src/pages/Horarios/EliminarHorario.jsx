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
      const { data, totalPages } = await getHorarios({ ...appliedFilters, page, limit: 10 });
      setHorarios(data);
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
    { field: "dia", title: "Día" },
    { field: "bloque", title: "Bloque Horario" },
    { field: "nombre_materia", title: "Materia" },
    { field: "nombre_profesor", title: "Profesor" },
    {
      field: "acciones",
      title: "Acciones",
      render: (row) => (
        <button onClick={() => handleEliminarHorario(row.id)} style={{ color: "red" }}>
          Eliminar
        </button>
      ),
    },
  ];

  return (
    <div>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default EliminarHorario;
