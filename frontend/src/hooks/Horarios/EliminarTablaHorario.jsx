import Swal from "sweetalert2";
import "@styles/Horarios/eliminarHorario.css";

const diasSemana = ["lunes", "martes", "miercoles", "jueves", "viernes"];
const horas = [
  "08:00 - 08:45",
  "08:50 - 09:35",
  "09:40 - 10:25",
  "10:30 - 11:15",
  "11:20 - 12:05",
  "12:10 - 12:55",
  "13:00 - 13:45",
  "14:30 - 15:15",
  "15:20 - 16:05",
  "16:10 - 16:55",
  "17:00 - 17:45",
];

const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

const EliminarTablaHorario = ({ horario = {}, onEliminarHorario }) => {
  const handleEliminar = async () => {
    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: "Esto eliminará el horario completo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await onEliminarHorario(); // Ejecuta la función de eliminación
        Swal.fire("Eliminado", "El horario ha sido eliminado con éxito.", "success");
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al eliminar el horario. Intente nuevamente.", "error");
      }
    }
  };

  return (
    <div className="tabla-horarios-container">
      {/* Mensaje si no hay horarios */}
      {Object.keys(horario).length === 0 ? (
        <p className="mensaje-sin-horario">No hay horarios disponibles para mostrar.</p>
      ) : (
        <>
          {/* Tabla de horarios */}
          <table className="tabla-horarios">
            <thead>
              <tr>
                <th className="tabla-header">Hora</th>
                {diasSemana.map((dia) => (
                  <th key={dia} className="tabla-header">
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horas.map((hora) => (
                <tr key={hora} className={recreoHoras.includes(hora) ? "recreo-row" : ""}>
                  <td className="hora-col">{hora}</td>
                  {diasSemana.map((dia) => (
                    <td
                      key={`${dia}-${hora}`}
                      className={`contenido-col ${
                        !horario[dia]?.[hora]?.materia ? "empty-cell" : ""
                      }`}
                    >
                      {recreoHoras.includes(hora) ? (
                        <span className="recreo-text">Recreo</span>
                      ) : horario[dia]?.[hora]?.materia ? (
                        <div>
                          <div className="materia-display">{horario[dia][hora].materia}</div>
                          <div className="profesor-display">
                            {horario[dia][hora].profesor || "Sin profesor"}
                          </div>
                          <div className="curso-display">
                            {horario[dia][hora].curso || "Sin curso"}
                          </div>
                        </div>
                      ) : (
                        <span className="sin-asignar">Sin asignar</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botón para eliminar horario */}
          <div className="eliminar-horario-actions">
            <button className="btn-eliminar-horario" onClick={handleEliminar}>
              Eliminar Horario
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EliminarTablaHorario;
