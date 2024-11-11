import { diasSemana, horas } from "../../config/horariosConfig";

const TableHorario = ({ horario }) => {
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
                <td key={`${dia}-${hora}`}>{horario?.[dia]?.[hora] || "Sin asignar"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableHorario;
