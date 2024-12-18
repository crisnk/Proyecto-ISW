import "@styles/Horarios/verTablaHorario.css";

const VerTablaHorarioProfesor = ({
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
                const isRecreo = recreoHoras.includes(hora);
                const isAsignado = bloque?.materia && bloque.materia !== "Sin asignar";

                return (
                  <td
                    key={`${dia}-${hora}`}
                    className="contenido-col"
                    style={{
                      backgroundColor: isRecreo
                        ? "#D0F0FF"
                        : isAsignado
                        ? "#CFFFD0" 
                        : "#FFFFFF", 
                    }}
                  >
                    {isRecreo ? (
                      <span className="recreo-text">Recreo</span>
                    ) : isAsignado ? (
                      <div className="contenido-bloque">
                        <div className="materia">
                          {bloque.materia}
                        </div>
                        <div className="curso">
                          {bloque.curso || "Sin curso"}
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

export default VerTablaHorarioProfesor;
