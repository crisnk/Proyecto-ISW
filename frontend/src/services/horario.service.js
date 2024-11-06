import axios from './root.service.js';

export async function obtenerMaterias() {
    try {
      const response = await axios.get("/horarios/materias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener materias:", error);
      return [];
    }
  }
  
  export async function obtenerCursos() {
    try {
      const response = await axios.get("/horarios/cursos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      return [];
    }
  }
  
  export async function obtenerProfesores() {
    try {
      const response = await axios.get("/horarios/profesores");
      return response.data;
    } catch (error) {
      console.error("Error al obtener profesores:", error);
      return [];
    }
  }
  
export const getAllHorarios = async (page = 1, limit = 6, filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page), 
        limit: String(limit),
        ...filters,
      }).toString();
      
      const response = await axios.get(`/horarios/ver/todos?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching paginated horarios:", error);
      throw error;
    }
  };
  