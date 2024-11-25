import { useState, useEffect, useCallback } from "react";
import VerTablaHorario from "../../hooks/Horarios/VerTablaHorario";
import Filters from "../../hooks/Horarios/Filters";
import { getHorarios, getCursos, getProfesores } from "../../services/horario.service";
import "@styles/Horarios/verHorarios.css";

// Días de la semana y horas del horario
const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const horas = [
  "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
  "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
  "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
  "16:10 - 16:55", "17:00 - 17:45",
];

const VerHorarios = () => {
  const [horarios, setHorarios] = useState({}); // Estado para los horarios
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 }); // Paginación
  const [filters, setFilters] = useState({}); // Filtros seleccionados
  const [loading, setLoading] = useState(false); // Indicador de carga
  const [error, setError] = useState(""); // Mensajes de error
  const [tituloHorario, setTituloHorario] = useState(""); // Título de la tabla de horarios
  const [cursos, setCursos] = useState([]); // Lista de cursos
  const [profesores, setProfesores] = useState([]); // Lista de profesores

  // Inicializa la estructura base del horario
  const initializeHorario = useCallback(() => {
    const horarioBase = {};
    diasSemana.forEach((dia) => {
      horarioBase[dia] = {};
      horas.forEach((hora) => {
        horarioBase[dia][hora] = {
          materia: "Sin asignar",
          profesor: "Sin profesor",
          curso: "Sin curso",
        };
      });
    });
    return horarioBase;
  }, []);

  // Carga los horarios desde el backend
  const fetchHorarios = useCallback(async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const { data, totalPages } = await getHorarios({ ...appliedFilters, page, limit: 10 });

      // Inicializa la estructura del horario
      const formattedHorario = initializeHorario();

      if (data && data.length > 0) {
        // Mapear los bloques al formato esperado
        data.forEach((bloque) => {
          const diaKey = bloque.dia?.toLowerCase();
          const bloqueKey = bloque.bloque;

          if (diasSemana.includes(diaKey) && horas.includes(bloqueKey)) {
            formattedHorario[diaKey][bloqueKey] = {
              materia: bloque.materia?.nombre || "Sin asignar",
              profesor: bloque.profesor?.nombreCompleto || "Sin profesor",
              curso: bloque.curso?.nombre || "Sin curso",
            };
          }
        });
      } else {
        setError("No se encontraron horarios para los filtros seleccionados.");
      }

      setHorarios(formattedHorario);
      setPagination({ page, totalPages });
    } catch (err) {
      console.error("Error al cargar horarios:", err);
      setError("Error al cargar horarios.");
    } finally {
      setLoading(false);
    }
  }, [initializeHorario]);

  // Cargar la lista de cursos y profesores al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cursosData = await getCursos();
        const profesoresData = await getProfesores();
        setCursos(cursosData);
        setProfesores(profesoresData);
      } catch (error) {
        console.error("Error al cargar datos de cursos o profesores:", error);
        setError("Error al cargar datos de cursos o profesores.");
      }
    };
    fetchData();
  }, []);

  // Actualizar horarios según los filtros aplicados
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

  // Manejo del cambio de filtros
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Cambio de página
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
            diasSemana={diasSemana}
            horas={horas}
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
