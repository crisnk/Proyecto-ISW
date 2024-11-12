import { useState, useEffect, useCallback } from "react";
import VerTablaHorario from "../../components/Horarios/VerTablaHorario";
import Filters from "../../components/Horarios/Filters";
import { getHorarios, getCursos, getProfesores } from "../../services/horario.service"; // Importar servicios
import "@styles/Horarios/verHorarios.css";

const VerHorarios = () => {
  const [horarios, setHorarios] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tituloHorario, setTituloHorario] = useState("");
  const [cursos, setCursos] = useState([]);
  const [profesores, setProfesores] = useState([]);

  const fetchHorarios = useCallback(async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getHorarios({ ...appliedFilters, page, limit: 10 });
      if (data.length > 0) {
        const formattedHorario = {};
        data.forEach((bloque) => {
          if (!formattedHorario[bloque.dia]) {
            formattedHorario[bloque.dia] = {};
          }
          formattedHorario[bloque.dia][bloque.bloque] = {
            materia: bloque.nombre_materia || "Sin asignar",
            profesor: bloque.nombre_profesor || "Sin profesor",
            curso: bloque.curso || "Sin curso",
          };
        });
        setHorarios(formattedHorario);
        setPagination({ page, totalPages });
        setError("");
      } else {
        setHorarios({});
        setError("No se encontraron horarios para los filtros seleccionados.");
      }
    } catch (err) {
      console.error("Error al cargar horarios:", err);
      setError("Error al cargar horarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cursosData = await getCursos();
        const profesoresData = await getProfesores();
        setCursos(cursosData);
        setProfesores(profesoresData);
      } catch (error) {
        console.error("Error al cargar datos para títulos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchHorarios(filters);
      if (filters.curso) {
        const cursoSeleccionado = cursos.find((curso) => curso.ID_curso.toString() === filters.curso);
        setTituloHorario(`Horario del curso: ${cursoSeleccionado?.nombre || filters.curso}`);
      } else if (filters.profesor) {
        const profesorSeleccionado = profesores.find((prof) => prof.rut === filters.profesor);
        setTituloHorario(`Horario del profesor: ${profesorSeleccionado?.nombreCompleto || filters.profesor}`);
      } else {
        setTituloHorario("Todos los horarios");
      }
    }
  }, [filters, fetchHorarios, cursos, profesores]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    fetchHorarios(filters, newPage);
  };

  return (
    <div className="ver-horarios">
      <h1>Ver Horarios</h1>
      <Filters onChange={handleFilterChange} />
      {tituloHorario && <h2>{tituloHorario}</h2>}
      {loading ? (
        <p className="loading-message">Cargando horarios...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        Object.keys(horarios).length > 0 && (
          <VerTablaHorario
            horario={horarios}
            showProfesor={filters.profesor === undefined}
          />
        )
      )}
      {pagination.totalPages > 1 && Object.keys(horarios).length > 0 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default VerHorarios;
