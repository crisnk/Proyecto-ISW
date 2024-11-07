import axios from "./root.service";

export const getHorarios = async (params) => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value)
    );

    const response = await axios.get("/horarios/ver/todos", { params: filteredParams });
    console.log("Datos recibidos:", response.data);
    return {
      data: response.data.data || [],
      totalPages: response.data.pages || 1,
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

export const getProfesores = async () => {
  try {
    const response = await axios.get("/horarios/profesores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    return [];
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
