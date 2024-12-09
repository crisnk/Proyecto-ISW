import "@styles/Horarios/tablaHorarioCursos.css";

const EditarTablaHorarioCurso = ({ horario, diasSemana, horas, materias, onMateriaChange }) => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

  return (
    <div className="tabla-horarios-container">
      <table className="tabla-horarios">
        <thead>
          <tr>
            <th className="tabla-header">Horas</th>
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
                <td key={`${dia}-${hora}`} className="contenido-col">
                  {recreoHoras.includes(hora) ? (
                    <span className="recreo-text">Recreo</span>
                  ) : (
                    <select
                      value={horario[dia]?.[hora]?.materia || "Sin asignar"}
                      onChange={(e) => onMateriaChange(dia, hora, e.target.value)}
                      className="materia-select"
                    >
                      <option value="Sin asignar">Sin asignar</option>
                      {materias.map((materia) => (
                        <option key={materia.ID_materia} value={materia.ID_materia}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditarTablaHorarioCurso;