const EditarTablaHorarioProfesor = ({ horario, diasSemana, horas, materias, cursos, onMateriaCursoChange }) => {
  if (!horario || !diasSemana || !horas || !materias || !cursos) {
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
                {horario[dia]?.[hora]?.materia === "Recreo" ? (
                  <span>Recreo</span>
                ) : (
                  <div>
                    <label>Materia:</label>
                    <select
                      value={horario[dia]?.[hora]?.materia || "Sin asignar"}
                      onChange={(e) => onMateriaCursoChange(dia, hora, "materia", e.target.value)}
                    >
                      <option value="Sin asignar">Sin asignar</option>
                      {materias.map((materia) => (
                        <option key={materia.ID_materia} value={materia.ID_materia}>
                          {materia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {horario[dia]?.[hora]?.materia !== "Recreo" && (
                  <div>
                    <label>Curso:</label>
                    <select
                      value={horario[dia]?.[hora]?.curso || "Sin asignar"}
                      onChange={(e) => onMateriaCursoChange(dia, hora, "curso", e.target.value)}
                    >
                      <option value="Sin asignar">Sin asignar</option>
                      {cursos.map((curso) => (
                        <option key={curso.ID_curso} value={curso.ID_curso}>
                          {curso.nombre}
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
  );
};


export default EditarTablaHorarioProfesor;