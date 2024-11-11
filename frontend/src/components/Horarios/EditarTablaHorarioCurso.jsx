const EditarTablaHorarioCurso = ({ horario, diasSemana, horas, materias, onMateriaChange }) => {
  if (!horario || !diasSemana || !horas || !materias) {
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
                      onChange={(e) => onMateriaChange(dia, hora, e.target.value)}
                      disabled={horario[dia]?.[hora]?.materia === "Recreo"}
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
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditarTablaHorarioCurso;