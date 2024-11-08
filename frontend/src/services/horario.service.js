import axios from "./root.service";

export const getHorarios = async (params) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value)
    );
    const response = await axios.get("/horarios/ver/todos", { params: filteredParams });
    return {
      data: response.data.data || [],
      totalPages: response.data.totalPages || 1,
    };
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    throw error;
  }
};

export const getCursos = async () => {
  try {
    const response = await axios.get("/horarios/cursos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return [];
  }
};
export const getHorarioCurso = async (cursoId) => {
  try {
    const response = await axios.get(`/horarios/ver/curso/${cursoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el horario del curso:", error);
    throw error;
  }
};


export const getProfesores = async () => {
  try {
    const response = await axios.get("/horarios/profesores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return [];
  }
};
export const getHorarioProfesor = async (rut) => {
  try {
    const response = await axios.get(`/horarios/ver/profesor?rut=${rut}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el horario del profesor:", error);
    throw error;
  }
};


export const getMaterias = async () => {
  try {
    const response = await axios.get("/horarios/materias");
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias:", error);
    return [];
  }
};

export const saveHorarioCurso = async (cursoId, horario) => {
  try {
    const response = await axios.post("/horarios/asignar", { cursoId, horario });
    return response.data;
  } catch (error) {
    console.error("Error al asignar horario:", error);
    throw error;
  }
};
export const saveHorarioProfesor = async (rut, horario) => {
  try {
    const response = await axios.post("/horarios/asignar", { rut, horario });
    return response.data;
  } catch (error) {
    console.error("Error al asignar horario al profesor:", error);
    throw error;
  }
};

