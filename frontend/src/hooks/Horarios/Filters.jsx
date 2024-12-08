import React, { useState, useEffect } from "react";
import {
  getMaterias,
  getCursos,
  crearMateria,
  crearCurso,
  eliminarMateria,
  eliminarCurso,
} from "../../services/horario.service";
import Filters from "./Filters";
import Swal from "sweetalert2";
import "@styles/Horarios/materias.css";

const Materias = () => {
  const [activeSection, setActiveSection] = useState("crearMateria");
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [newMateria, setNewMateria] = useState("");
  const [newCurso, setNewCurso] = useState({ nombre: "", aula: "" });
  const [searchFilter, setSearchFilter] = useState({});
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [materias, cursos, searchFilter]);

  const fetchData = async () => {
    try {
      const materiasData = await getMaterias();
      const cursosData = await getCursos();
      setMaterias(materiasData);
      setCursos(cursosData);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los datos.", "error");
    }
  };

  const applyFilters = () => {
    if (searchFilter.curso) {
      setFilteredCursos(cursos.filter((curso) => curso.ID_curso === parseInt(searchFilter.curso, 10)));
    } else {
      setFilteredCursos(cursos);
    }

    if (searchFilter.materia) {
      setFilteredMaterias(
        materias.filter((materia) =>
          materia.nombre.toLowerCase().includes(searchFilter.materia.toLowerCase())
        )
      );
    } else {
      setFilteredMaterias(materias);
    }
  };

  const handleCreateMateria = async () => {
    if (!newMateria.trim()) {
      Swal.fire("Advertencia", "El nombre de la materia no puede estar vacío.", "warning");
      return;
    }
    try {
      const response = await crearMateria({ nombre: newMateria });
      setMaterias([...materias, response]);
      setNewMateria("");
      Swal.fire("Éxito", "Materia creada correctamente.", "success");
    } catch {
      Swal.fire("Error", "No se pudo crear la materia.", "error");
    }
  };

  const handleCreateCurso = async () => {
    if (!newCurso.nombre.trim() || !newCurso.aula.trim()) {
      Swal.fire("Advertencia", "El nombre y aula del curso son obligatorios.", "warning");
      return;
    }
    try {
      const response = await crearCurso(newCurso);
      setCursos([...cursos, response]);
      setNewCurso({ nombre: "", aula: "" });
      Swal.fire("Éxito", "Curso creado correctamente.", "success");
    } catch {
      Swal.fire("Error", "No se pudo crear el curso.", "error");
    }
  };

  const handleDeleteMateria = async (ID_materia) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarMateria(ID_materia);
        setMaterias(materias.filter((materia) => materia.ID_materia !== ID_materia));
        Swal.fire("Eliminada", "La materia ha sido eliminada.", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar la materia.", "error");
      }
    }
  };

  const handleDeleteCurso = async (ID_curso) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarCurso(ID_curso);
        setCursos(cursos.filter((curso) => curso.ID_curso !== ID_curso));
        Swal.fire("Eliminado", "El curso ha sido eliminado.", "success");
      } catch {
        Swal.fire("Error", "No se pudo eliminar el curso.", "error");
      }
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "crearMateria":
        return (
          <div className="form-section">
            <h3>Crear Materia</h3>
            <input
              type="text"
              placeholder="Nombre de la materia"
              value={newMateria}
              onChange={(e) => setNewMateria(e.target.value)}
            />
            <button onClick={handleCreateMateria}>Crear Materia</button>
          </div>
        );
      case "crearCurso":
        return (
          <div className="form-section">
            <h3>Crear Curso</h3>
            <input
              type="text"
              placeholder="Nombre del curso"
              value={newCurso.nombre}
              onChange={(e) => setNewCurso({ ...newCurso, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Aula"
              value={newCurso.aula}
              onChange={(e) => setNewCurso({ ...newCurso, aula: e.target.value })}
            />
            <button onClick={handleCreateCurso}>Crear Curso</button>
          </div>
        );
      case "gestionarMaterias":
        return (
          <div className="list-section">
            <h3>Materias Existentes</h3>
            <Filters
              onChange={(filter) => setSearchFilter((prev) => ({ ...prev, materia: filter.materia }))}
            />
            <ul>
              {filteredMaterias.map((materia) => (
                <li key={materia.ID_materia}>
                  {materia.nombre}
                  <button onClick={() => handleDeleteMateria(materia.ID_materia)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "gestionarCursos":
        return (
          <div className="list-section">
            <h3>Cursos Existentes</h3>
            <Filters
              onChange={(filter) => setSearchFilter((prev) => ({ ...prev, curso: filter.curso }))}
            />
            <ul>
              {filteredCursos.map((curso) => (
                <li key={curso.ID_curso}>
                  {curso.nombre} - Aula: {curso.aula}
                  <button onClick={() => handleDeleteCurso(curso.ID_curso)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="materias-container">
      <h2>Gestión de Materias y Cursos</h2>
      <div className="tabs">
        <button onClick={() => setActiveSection("crearMateria")}>Crear Materia</button>
        <button onClick={() => setActiveSection("crearCurso")}>Crear Curso</button>
        <button onClick={() => setActiveSection("gestionarMaterias")}>Materias Existentes</button>
        <button onClick={() => setActiveSection("gestionarCursos")}>Cursos Existentes</button>
      </div>
      {renderSection()}
    </div>
  );
};

export default Materias;
