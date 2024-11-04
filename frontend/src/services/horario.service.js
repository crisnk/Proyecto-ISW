import axios from './root.service.js';

export async function asignarHorario(horarioData) {
    try {
        const response = await axios.post('/horarios/asignar', horarioData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function modificarHorario(id, horarioData) {
    try {
        const response = await axios.patch(`/horarios/modificar/${id}`, horarioData);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function eliminarHorario(id) {
    try {
        const response = await axios.delete(`/horarios/eliminar/${id}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function verHorarioProfesor() {
    try {
        const response = await axios.get('/horarios/ver/profesor');
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function verHorarioCurso(ID_curso) {
    try {
        const response = await axios.get(`/horarios/ver/curso/${ID_curso}`);
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function verTodosHorarios() {
    try {
        const response = await axios.get('/horarios/ver/todos');
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}


export async function obtenerHorarioAlumno() {
    try {
        const response = await axios.get('/horarios/alumno');
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}
export async function obtenerHorariosCurso() {
    try {
        const response = await axios.get('/horarios/ver/cursos');
        return response.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}
export async function obtenerMaterias() {
    try {
      const response = await axios.get('/api/materias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener materias:', error);
      return [];
    }
  }
  
  export async function obtenerCursos() {
    try {
      const response = await axios.get('/api/cursos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cursos:', error);
      return [];
    }
  }
  
  export async function obtenerProfesores() {
    try {
      const response = await axios.get('/api/profesores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener profesores:', error);
      return [];
    }
  }