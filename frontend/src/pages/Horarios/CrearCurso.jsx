import React, { useState } from "react";
import Swal from "sweetalert2";
import { crearCurso } from "../../services/horario.service";

const CrearCurso = () => {
  const [newCurso, setNewCurso] = useState({ nombre: "", aula: "" });

  const handleCreateCurso = async () => {
    if (!newCurso.nombre.trim() || !newCurso.aula.trim()) {
      Swal.fire("Advertencia", "El nombre y aula del curso son obligatorios.", "warning");
      return;
    }
    try {
      await crearCurso(newCurso);
      setNewCurso({ nombre: "", aula: "" });
      Swal.fire("Éxito", "Curso creado correctamente.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error"); 
    }
  };

  return (
    <div className="crear-curso">
      <h2>Crear Curso</h2>
      <input
        type="text"
        placeholder="Ejemplo: 1ro Medio A"
        value={newCurso.nombre}
        onChange={(e) => setNewCurso({ ...newCurso, nombre: e.target.value })}
      />
      <input
        type="text"
        placeholder="Ejemplo: 2"
        value={newCurso.aula}
        onChange={(e) => setNewCurso({ ...newCurso, aula: e.target.value })}
      />
      <button onClick={handleCreateCurso}>Crear Curso</button>
    </div>
  );
};

export default CrearCurso;
