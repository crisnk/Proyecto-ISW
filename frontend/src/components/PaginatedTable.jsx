import usePaginatedTable from "../hooks/usePaginatedTable";
import Table from "./Table"; 
import FilterBar from "./FilterBar"; 
import "@styles/tablaHorarios.css"; 

export default function PaginatedTable({ columns }) {
  const { data, page, totalPages, isLoading, setPage, setFilters } = usePaginatedTable(1, 6);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      {/* FilterBar debe estar aquí */}
      <FilterBar onFilterChange={setFilters} />

      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <Table data={data} columns={columns} />

          <div className="pagination-controls">
            <button onClick={() => handlePageChange(1)} disabled={page === 1}>
              Primero
            </button>
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Siguiente
            </button>
            <button onClick={() => handlePageChange(totalPages)} disabled={page === totalPages}>
              Último
            </button>
          </div>
        </>
      )}
    </div>
  );
}
