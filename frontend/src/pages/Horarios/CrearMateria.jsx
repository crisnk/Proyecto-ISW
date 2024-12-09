import React, { useState } from "react";
import Swal from "sweetalert2";
import { crearMateria } from "../../services/horario.service";

const CrearMateria = () => {
  const [newMateria, setNewMateria] = useState("");

  const handleCreateMateria = async () => {
    if (!newMateria.trim()) {
      Swal.fire("Advertencia", "El nombre de la materia no puede estar vacío.", "warning");
      return;
    }
    try {
      await crearMateria({ nombre: newMateria });
      setNewMateria("");
      Swal.fire("Éxito", "Materia creada correctamente.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error"); 
    }
  };

  return (
    <div className="crear-materia">
      <h2>Crear Materia</h2>
      <input
        type="text"
        placeholder="Nombre de la materia"
        value={newMateria}
        onChange={(e) => setNewMateria(e.target.value)}
      />
      <button onClick={handleCreateMateria}>Crear Materia</button>
    </div>
  );
};

export default CrearMateria;
