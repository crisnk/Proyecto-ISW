import "@styles/Horarios/tablaHorarioProfesor.css";

const VerTablaHorario = ({ horario, diasSemana, horas }) => {
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
                    <>
                      <div className="materia-display">
                        <strong>Materia:</strong> {horario[dia]?.[hora]?.materia || "Sin asignar"}
                      </div>
                      <div className="profesor-display">
                        <strong>Profesor:</strong> {horario[dia]?.[hora]?.profesor || "Sin profesor"}
                      </div>
                      <div className="curso-display">
                        <strong>Curso:</strong> {horario[dia]?.[hora]?.curso || "Sin curso"}
                      </div>
                    </>
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

export default VerTablaHorario;
