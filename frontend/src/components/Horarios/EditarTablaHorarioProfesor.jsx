const EditarTablaHorarioProfesor = ({
  horario,
  diasSemana,
  horas,
  materias,
  cursos,
  onMateriaCursoChange,
}) => {
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
                <div>
                  <label>Materia:</label>
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
                  >
                    <option value="Sin asignar">Sin asignar</option>
                    {materias.map((m) => (
                      <option key={m.ID_materia} value={m.ID_materia}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Curso:</label>
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
                  >
                    <option value="Sin asignar">Sin asignar</option>
                    {cursos.map((c) => (
                      <option key={c.ID_curso} value={c.ID_curso}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditarTablaHorarioProfesor;
