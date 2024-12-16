import React, { useState } from 'react';
import '@styles/tablaAlumnos.css';

const TablaAlumnos = ({ data, columns, onRowSelect }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRow, setSelectedRow] = useState(null);

    // Manejo de ordenación
    const handleSort = (key) => {
        setSortConfig((prevState) => ({
            key,
            direction: prevState.key === key && prevState.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
        }
        return ' ⇅';
    };

    // Ordenar y dividir datos por página
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(data.length / rowsPerPage);
    const currentPageData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Cambiar de página
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Seleccionar fila
    const handleRowSelect = (row) => {
        setSelectedRow(row);
        onRowSelect(row);
    };

    return (
        <div className="tablaAlumnos-container">
            <table className="tablaAlumnos-table">
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        {columns.map((col) => (
                            <th key={col.field} onClick={() => handleSort(col.field)}>
                                {col.title}
                                {renderSortArrow(col.field)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((row) => (
                        <tr
                            key={row.ID_atraso}
                            className={selectedRow === row ? 'tablaAlumnos-row-selected' : ''}
                            onClick={() => handleRowSelect(row)}
                        >
                            <td onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedRow === row}
                                    onChange={() => handleRowSelect(row)}
                                />
                            </td>
                            {columns.map((col) => (
                                <td key={col.field}>{row[col.field]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <div className="tablaAlumnos-pagination">
                <button onClick={() => goToPage(1)} disabled={currentPage === 1}>
                    Primero
                </button>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        className={currentPage === index + 1 ? 'tablaAlumnos-active-page' : ''}
                        onClick={() => goToPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                </button>
                <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                    Último
                </button>
            </div>

            {/* Control de filas por página */}
            <div className="tablaAlumnos-rows-per-page">
                <label>
                    Filas por página:
                    <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default TablaAlumnos;
