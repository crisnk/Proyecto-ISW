import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getMaterias, eliminarMateria } from "../../services/horario.service";
import "@styles/Horarios/gestionMaterias.css";

const MateriasExistentes = () => {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    fetchMaterias();
  }, []);

  const fetchMaterias = async () => {
    try {
      const materiasData = await getMaterias();
      setMaterias(materiasData);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las materias.", "error");
    }
  };

  const handleDeleteMateria = async (ID_materia) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarMateria(ID_materia);
          setMaterias(materias.filter((materia) => materia.ID_materia !== ID_materia));
          Swal.fire("Eliminada", "La materia ha sido eliminada.", "success");
        } catch {
          Swal.fire("Error", "No se pudo eliminar la materia.", "error");
        }
      }
    });
  };

  return (
    <div className="materias-existentes">
      <h2>Materias Existentes</h2>
      <ul>
        {materias.length > 0 ? (
          materias.map((materia) => (
            <li key={materia.ID_materia}>
              {materia.nombre}
              <button onClick={() => handleDeleteMateria(materia.ID_materia)}>Eliminar</button>
            </li>
          ))
        ) : (
          <p>No hay materias disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default MateriasExistentes;
