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
    if (!response.data || response.data.length === 0) {
      console.warn("No se encontraron cursos disponibles.");
      return [];
    }
    return response.data; 
  } catch (error) {
    console.error("Error al obtener cursos:", error.response?.data || error.message);
    throw error;
  }
};
export const getCursosRegister = async () => {
  try {
    const response = await axios.get("/horarios/cursosregister");
    return response.data;
  } catch (error) {
    console.error("Error al obtener cursos para registro:", error);
    throw error;
  }
};

export const getProfesores = async () => {
  try {
    const response = await axios.get("/horarios/profesores");
    return response.data;
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    throw error;
  }
};

export const getMaterias = async () => {
  try {
    const response = await axios.get("/horarios/materias");
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias:", error);
    throw error;
  }
};

export const getHorarioCurso = async (ID_curso) => {
  try {
    const response = await axios.get(`/horarios/ver/curso/${ID_curso}`);
    return response.data.data || {}; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { data: [] }; 
    }
    throw error;
  }
};



export const getHorarioProfesor = async (rut) => {
  try {
    const response = await axios.get(`/horarios/ver/profesor`, { params: { rut } });
    return response.data.data || []; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return []; 
    }
    throw error;
  }
};


export const saveHorarioCurso = async (cursoId, horario) => {
  try {
    if (!cursoId || !horario || Object.keys(horario).length === 0) {
      throw new Error("Datos de horario incompletos o mal estructurados.");
    }
   
    const payload = {
      cursoId,
      horario: Object.entries(horario).flatMap(([dia, bloques]) =>
        Object.entries(bloques)
          .filter(([, { materia }]) => materia !== "Sin asignar")
          .map(([bloque, { materia }]) => ({
            ID_materia: materia,
            dia,
            bloque,
          }))
      ),
    };

    if (payload.horario.length === 0) {
      throw new Error("No se han asignado bloques válidos para guardar.");
    }

    const response = await axios.post("/horarios/asignar/curso", payload);
    return response.data;
  } catch (error) {
    console.error("Error al guardar horario del curso:", error.response?.data || error.message);
    throw error;
  }
};


export const saveHorarioProfesor = async (rut, horario) => {
  try {
    if (!rut || !horario || Object.keys(horario).length === 0) {
      throw new Error("Datos de horario incompletos o mal estructurados.");
    }

    const payload = {
      rut,
      horario: Object.entries(horario).flatMap(([dia, bloques]) =>
        Object.entries(bloques)
          .filter(([, { materia, curso }]) => materia !== "Sin asignar" && curso !== "Sin asignar")
          .map(([bloque, { materia, curso }]) => ({
            ID_materia: materia,
            ID_curso: curso,
            dia,
            bloque,
          }))
      ),
    };

    if (payload.horario.length === 0) {
      throw new Error("No se han asignado bloques válidos para guardar.");
    }

    const response = await axios.post("/horarios/asignar", payload);
    return response.data;
  } catch (error) {
    console.error("Error al guardar el horario del profesor:", error.response?.data || error.message);
    throw error;
  }
};
export const eliminarHorario = async (id) => {
  try {
    const response = await axios.delete(`/horarios/eliminar/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("El horario no existe o ya fue eliminado.");
      throw new Error("El horario no existe o ya fue eliminado.");
    }
    console.error("Error al eliminar horario:", error.response?.data || error.message);
    throw error;
  }
};




