import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getCursos, eliminarCurso } from "../../services/horario.service";

const CursosExistentes = () => {
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const cursosData = await getCursos();
      setCursos(cursosData);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los cursos.", "error");
    }
  };

  const handleDeleteCurso = async (ID_curso) => {
    try {
      await eliminarCurso(ID_curso);
      setCursos(cursos.filter((curso) => curso.ID_curso !== ID_curso));
      Swal.fire("Eliminado", "El curso ha sido eliminado.", "success");
    } catch {
      Swal.fire("Error", "No se pudo eliminar el curso.", "error");
    }
  };

  return (
    <div className="cursos-existentes">
      <h2>Cursos Existentes</h2>
      <ul>
        {cursos.map((curso) => (
          <li key={curso.ID_curso}>
            {curso.nombre} - Aula: {curso.aula}
            <button onClick={() => handleDeleteCurso(curso.ID_curso)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CursosExistentes;
