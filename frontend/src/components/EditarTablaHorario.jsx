const EditarTablaHorario = ({ horario, diasSemana, horas, materias, onMateriaChange }) => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

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
                {recreoHoras.includes(hora) ? (
                  <span>Recreo</span>
                ) : (
                  <select
                    value={horario[dia]?.[hora] || "Sin asignar"}
                    onChange={(e) => onMateriaChange(dia, hora, e.target.value)}
                  >
                    <option value="Sin asignar">Sin asignar</option>
                    {materias.map((materia) => (
                      <option key={materia.ID_materia} value={materia.nombre}>
                        {materia.nombre}
                      </option>
                    ))}
                  </select>
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

  
  
  
  
