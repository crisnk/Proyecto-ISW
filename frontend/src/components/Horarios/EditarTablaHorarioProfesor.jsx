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
          <th>Hora</th>
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
                <select
                  value={horario[dia]?.[hora]?.materia || ""}
                  onChange={(e) =>
                    onMateriaCursoChange(dia, hora, e.target.value, "materia")
                  }
                >
                  <option value="">Selecciona Materia</option>
                  {materias.map((m) => (
                    <option key={m.ID_materia} value={m.ID_materia}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={horario[dia]?.[hora]?.curso || ""}
                  onChange={(e) =>
                    onMateriaCursoChange(dia, hora, e.target.value, "curso")
                  }
                >
                  <option value="">Selecciona Curso</option>
                  {cursos.map((c) => (
                    <option key={c.ID_curso} value={c.ID_curso}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditarTablaHorarioProfesor;
