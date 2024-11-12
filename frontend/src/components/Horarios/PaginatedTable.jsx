const PaginatedTable = ({ columns, data, loading, pagination, onPageChange }) => {
  if (loading) {
    return <p>Cargando horarios...</p>;
  }

  const getCellValue = (row, field) => {
    const keys = field.split(".");
    return keys.reduce((value, key) => value?.[key], row) || "N/A";
  };

  return (
    <div>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.field}>{getCellValue(row, col.field)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>No hay datos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      {pagination && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          <span style={{ margin: "0 10px" }}>
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;

