import "@styles/Horarios/verTablaHorario.css";

const VerTablaHorarioAlumno = ({
  horario = {},
  diasSemana = [],
  horas = [],
}) => {
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
                  ) : horario[dia]?.[hora] ? (
                    <div className="contenido-bloque">
                      <div className="materia">
                        <strong>{horario[dia][hora].materia || "Sin asignar"}</strong>
                      </div>
                      <div className="profesor">
                        {horario[dia][hora].profesor || "Sin profesor"}
                      </div>
                      <div className="curso">
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
    </div>
  );
};

export default VerTablaHorarioAlumno;
