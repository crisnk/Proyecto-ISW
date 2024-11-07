import { useState, useCallback, useEffect } from "react";
import Filters from "../components/Filters";
import { getHorarios } from "../services/horario.service";
import TableHorario from "../components/TableHorario";

const Horarios = () => {
  const [filters, setFilters] = useState({});
  const [horarioCompleto, setHorarioCompleto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHorarioCompleto = useCallback(async (filters) => {
    setLoading(true);
    try {
      const response = await getHorarios(filters);
      const horarioEstandar = formatHorarioParaTabla(response.data);
      setHorarioCompleto(horarioEstandar);
    } catch (error) {
      console.error("Error al obtener horario completo:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      fetchHorarioCompleto(newFilters);
    },
    [fetchHorarioCompleto]
  );

  useEffect(() => {
    if (filters.curso || filters.profesor) {
      fetchHorarioCompleto(filters);
    }
  }, [filters, fetchHorarioCompleto]);

  return (
    <div>
      <h1>Gestión de Horarios</h1>
      <Filters onChange={handleFilterChange} />
      {loading && <p>Cargando horario...</p>}
      {horarioCompleto ? (
        <TableHorario horario={horarioCompleto} />
      ) : (
        <p>Selecciona un curso o profesor para ver su horario.</p>
      )}
    </div>
  );
};

const formatHorarioParaTabla = (data) => {
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const horas = [
    '08:00 - 08:45',
    '08:50 - 09:35',
    '09:40 - 10:25',
    '10:30 - 11:15',
    '11:20 - 12:05',
    '12:10 - 12:55',
    '13:00 - 13:45',
    '14:30 - 15:15',
    '15:20 - 16:05',
    '16:10 - 16:55',
    '17:00 - 17:45',
  ];

  const formatted = {};

  diasSemana.forEach((dia) => {
    formatted[dia] = {};
    horas.forEach((hora) => {
      formatted[dia][hora] = 'Sin asignar';
    });
  });

  data.forEach((item) => {
    const { dia, hora_Inicio, materia, profesor } = item;
    formatted[dia][hora_Inicio] = `${materia.nombre} - ${profesor.nombreCompleto}`;
  });

  return formatted;
};

export default Horarios;
