const EditarTablaHorario = ({ horario, materias, cursos, onHorarioChange }) => {
  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
    "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
    "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
    "16:10 - 16:55", "17:00 - 17:45"
  ];
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

  if (!horario || !materias || !cursos) {
    return <p>Error: Datos incompletos para renderizar la tabla.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Horas</th>
          {diasSemana.map((dia) => (
            <th key={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {horas.map((hora) => (
          <tr key={hora}>
            <td>{hora}</td>
            {diasSemana.map((dia) => (
              <td key={`${dia}-${hora}`}>
                {recreoHoras.includes(hora) ? (
                  <span>Recreo</span>
                ) : (
                  <div>
                    <label>Materia:</label>
                    <select
                      value={horario[dia]?.[hora]?.materia || "Sin asignar"}
                      onChange={(e) =>
                        onHorarioChange(dia, hora, {
                          ...horario[dia]?.[hora],
                          materia: e.target.value,
                        })
                      }
                    >
                      <option value="Sin asignar">Sin asignar</option>
                      {materias.map((materia) => (
                        <option key={materia.ID_materia} value={materia.ID_materia}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>

                    <div>
                      <label>Curso:</label>
                      <select
                        value={horario[dia]?.[hora]?.curso || "Sin asignar"}
                        onChange={(e) =>
                          onHorarioChange(dia, hora, {
                            ...horario[dia]?.[hora],
                            curso: e.target.value,
                          })
                        }
                      >
                        <option value="Sin asignar">Sin asignar</option>
                        {cursos.map((curso) => (
                          <option key={curso.ID_curso} value={curso.ID_curso}>
                            {curso.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditarTablaHorario;
