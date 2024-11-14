import "@styles/Horarios/tablaHorarioProfesor.css";

const EditarTablaHorarioProfesor = ({
  horario,
  diasSemana,
  horas,
  materias,
  cursos,
  onMateriaCursoChange,
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
                  ) : (
                    <div>
                      <label className="select-label">Materia:</label>
                      <select
                        value={horario[dia]?.[hora]?.materia || "Sin asignar"}
                        onChange={(e) =>
                          onMateriaCursoChange(
                            dia,
                            hora,
                            "materia",
                            e.target.value
                          )
                        }
                        className="materia-select"
                      >
                        <option value="Sin asignar">Sin asignar</option>
                        {materias.map((m) => (
                          <option key={m.ID_materia} value={m.ID_materia}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {!recreoHoras.includes(hora) && (
                    <div>
                      <label className="select-label">Curso:</label>
                      <select
                        value={horario[dia]?.[hora]?.curso || "Sin asignar"}
                        onChange={(e) =>
                          onMateriaCursoChange(
                            dia,
                            hora,
                            "curso",
                            e.target.value
                          )
                        }
                        className="curso-select"
                      >
                        <option value="Sin asignar">Sin asignar</option>
                        {cursos.map((c) => (
                          <option key={c.ID_curso} value={c.ID_curso}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
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

export default EditarTablaHorarioProfesor;
