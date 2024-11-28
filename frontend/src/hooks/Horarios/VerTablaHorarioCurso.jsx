import "@styles/Horarios/verTablaHorario.css";

const VerTablaHorarioCurso = ({
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
              {diasSemana.map((dia) => {
                const bloque = horario[dia]?.[hora];
                return (
                  <td key={`${dia}-${hora}`} className="contenido-col">
                    {recreoHoras.includes(hora) ? (
                      <span className="recreo-text">Recreo</span>
                    ) : bloque ? (
                      <div className="contenido-bloque">
                        <div className="materia">
                          {bloque.materia || "Sin asignar"}
                        </div>
                        <div className="profesor">
                          {bloque.profesor || "Sin profesor"}
                        </div>
                      </div>
                    ) : (
                      <span className="sin-asignar">Sin asignar</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTablaHorarioCurso;
