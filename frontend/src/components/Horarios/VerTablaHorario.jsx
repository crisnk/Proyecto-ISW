import "@styles/Horarios/tablaHorario.css";
const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
const horas = [
  "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25",
  "10:30 - 11:15", "11:20 - 12:05", "12:10 - 12:55",
  "13:00 - 13:45", "14:30 - 15:15", "15:20 - 16:05",
  "16:10 - 16:55", "17:00 - 17:45",
];

const VerTablaHorario = ({ horario }) => {
  return (
    <div className="tabla-horarios">
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
                  <div>{horario[dia]?.[hora]?.materia || "Sin asignar"}</div>
                  <div style={{ fontSize: "0.9em", color: "#555" }}>
                    {horario[dia]?.[hora]?.profesor}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTablaHorario;
