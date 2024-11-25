import axios from "./root.service";

export const getHorarios = async (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value)
  );

  try {
    const response = await axios.get("/horarios/ver/todos", { params: filteredParams });
    console.log("Respuesta de la API (Horarios):", response.data); 
    return {
      data: response.data.data || [],
      totalPages: response.data.totalPages || 1,
    };
  } catch (error) {
    console.error("Error al obtener horarios:", error.response?.data || error.message);
    throw error;
  }
};

export const getCursos = async () => {
  const response = await axios.get("/horarios/cursos");
  return response.data;
};

export const getProfesores = async () => {
  const response = await axios.get("/horarios/profesores");
  return response.data;
};

export const getMaterias = async () => {
  const response = await axios.get("/horarios/materias");
  return response.data;
};

export const getHorarioProfesor = async (rut) => {
  const response = await axios.get("/horarios/ver/profesor", { params: { rut } });
  return response.data || [];
};

export const saveHorarioProfesor = async (payload) => {
  const response = await axios.post("/horarios/asignar/profesor", payload);
  return response.data;
};

export const saveHorarioCurso = async (payload) => {
  const response = await axios.post("/horarios/asignar/curso", payload);
  return response.data;
};

export const eliminarHorario = async (id) => {
  const response = await axios.delete(`/horarios/eliminar/${id}`);
  return response.data;
};

export const getHorariosByCurso = async (ID_curso) => {
  try {
    const response = await axios.get(`/horarios/ver/curso/${ID_curso}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.warn("No se encontraron horarios para este curso.");
      return [];
    }
    throw error; 
  }
};

export const getHorariosByAlumno = async () => {
  try {
    const response = await axios.get("/horarios/alumno");
    return response.data;
  } catch (error) {
    console.error("Error al obtener horarios del alumno:", error.response?.data || error.message);
    throw error;
  }
};
