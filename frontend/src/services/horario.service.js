import axios from "./root.service";

export const getMaterias = async () => {
  const response = await axios.get("/horarios/materias");
  return response.data;
};

export const crearMateria = async (materiaData) => {
  try {
    const response = await axios.post("/horarios/materias/crear", materiaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear la materia.");
  }
};

export const eliminarMateria = async (ID_materia) => {
  try {
    const response = await axios.delete(`/horarios/materias/eliminar/${ID_materia}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar la materia.");
  }
};

export const getCursosRegister = async () => {
  const response = await axios.get("/horarios/cursosregister");
  return response.data;
};

export const getCursos = async () => {
  const response = await axios.get("/horarios/cursos");
  return response.data;
};

export const crearCurso = async (cursoData) => {
  try {
    const response = await axios.post("/horarios/cursos/crear", cursoData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al crear el curso.");
  }
};
export const eliminarCurso = async (ID_curso) => {
  try {
    const response = await axios.delete(`/horarios/cursos/eliminar/${ID_curso}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al eliminar el curso.");
  }
};

export const getProfesores = async () => {
  const response = await axios.get("/horarios/profesores");
  return response.data;
};

export const getEmailProfesor = async (rut) => {
  try {
    const response = await axios.get(`/horarios/profesor/email/${rut}`);
    return response.data.email; 
  } catch (error) {
    console.error("Error al obtener el email del profesor:", error.response?.data || error.message);
    throw error;
  }
};


export const getEmailsCurso = async (ID_curso) => {
  try {
    const response = await axios.get(`/horarios/curso/emails/${ID_curso}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener correos del curso:", error.response?.data || error.message);
    throw error;
  }
};

export const saveHorarioProfesor = async (payload) => {
  const response = await axios.post("/horarios/asignar/profesor", payload);
  return response.data;
};

export const saveHorarioCurso = async (payload) => {
  const response = await axios.post("/horarios/asignar/curso", payload);
  return response.data;
};

export const eliminarHorarioCurso = async (ID_curso) => {
  try {
    const response = await axios.delete(`/horarios/eliminar/curso/${ID_curso}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el horario del curso."
    );
  }
};

export const eliminarHorarioProfesor = async (rut) => {
  try {
    const response = await axios.delete(`/horarios/eliminar/profesor/${rut}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el horario del profesor."
    );
  }
};


export const getHorariosCurso = async (ID_curso) => {
  try {
    const response = await axios.get(`/horarios/ver/curso/${ID_curso}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el horario del curso:", error.response?.data || error.message);
    throw error;
  }
};

export const getHorarioProfesor = async (rut) => {
  try {
    const response = await axios.get("/horarios/ver/profesor", { params: { rut } });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el horario del profesor:", error.response?.data || error.message);
    throw error;
  }
};

export const getHorariosAlumno = async () => {
  try {
    const response = await axios.get("/horarios/alumno");
    return response.data;
  } catch (error) {
    console.error("Error al obtener horarios del alumno:", error.response?.data || error.message);
    throw error;
  }
};

export const notificacionProfesor = async (email, horarioDetails) => {
  try {
    const response = await axios.post("/horarios/notificacion/profesor", { email, horarioDetails });
    return response.data;
  } catch (error) {
    console.error("Error al enviar notificación al profesor:", error.response?.data || error.message);
    throw error;
  }
};

export const notificacionCurso = async (emails, horarioDetails) => {
  try {
    const response = await axios.post("/horarios/notificacion/curso", { emails, horarioDetails });
    return response.data;
  } catch (error) {
    console.error("Error al enviar notificación al curso:", error.response?.data || error.message);
    throw error;
  }
};

export const exportarHorario = async (type, identifier) => {
  try {
    const response = await axios.get(`/horarios/exportar/${type}/${identifier}`, { responseType: "blob" });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al exportar el horario.");
  }
};
