const TableHorario = ({ horario }) => {
  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes"];
  const horas = [
    "08:00 - 08:45", "08:50 - 09:35", "09:40 - 10:25", "10:30 - 11:15",
    "11:20 - 12:05", "12:10 - 12:55", "13:00 - 13:45", "14:30 - 15:15",
    "15:20 - 16:05", "16:10 - 16:55", "17:00 - 17:45",
  ];  

  return (
    <div style={{ overflowX: "auto", marginTop: "20px" }}>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
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
                <td key={dia}>{horario?.[dia]?.[hora] || "Sin asignar"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableHorario;