const VerTablaHorario = ({ horario, diasSemana, horas }) => {
  if (!horario || !diasSemana || !horas) {
    return <p>Error: Datos incompletos para renderizar la tabla.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
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
                {horario[dia]?.[hora]?.materia || "Sin asignar"}
                {horario[dia]?.[hora]?.curso && <div>Curso: {horario[dia][hora].curso}</div>}
                {horario[dia]?.[hora]?.profesor && <div>Profesor: {horario[dia][hora].profesor}</div>}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VerTablaHorario;
