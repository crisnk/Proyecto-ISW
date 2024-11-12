import { useState, useEffect, useCallback } from "react";
import Filters from "../../components/Horarios/Filters";
import PaginatedTable from "../../components/Horarios/PaginatedTable";
import { getHorarios } from "../../services/horario.service";

const VerHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHorarios = useCallback(async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getHorarios({ ...appliedFilters, page, limit: 10 });
      if (data.length > 0) {
        setHorarios(data);
        setPagination({ page, totalPages });
        setError("");
      } else {
        setHorarios([]);
        setError("No se encontraron horarios para los filtros seleccionados.");
      }
    } catch (err) {
      setError("Error al cargar horarios.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchHorarios(filters);
    }
  }, [filters, fetchHorarios]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchHorarios(filters, newPage);
  };

  const columns = [
    { field: "dia", title: "Día" },
    { field: "bloque", title: "Bloque" },
    { field: "nombre_materia", title: "Materia" },
    { field: "nombre_profesor", title: "Profesor" },
  ];

  return (
    <div>
      <h1>Ver Horarios</h1>
      <Filters onChange={handleFilterChange} />
      {loading ? (
        <p>Cargando horarios...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <PaginatedTable
          columns={columns}
          data={horarios}
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}
    </div>
  );
};

export default VerHorarios;
