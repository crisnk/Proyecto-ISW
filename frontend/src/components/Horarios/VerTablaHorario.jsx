const VerTablaHorario = ({ horarios, isFilteredByProfesor }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
      <thead>
        <tr>
          <th>Día</th>
          <th>Bloque</th>
          <th>Materia</th>
          {!isFilteredByProfesor && <th>Profesor</th>}
        </tr>
      </thead>
      <tbody>
        {horarios.map((bloque, index) => (
          <tr key={index}>
            <td>{bloque.dia}</td>
            <td>{bloque.bloque}</td>
            <td>{bloque.nombre_materia || "Sin asignar"}</td>
            {!isFilteredByProfesor && <td>{bloque.nombre_profesor || "Sin profesor"}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VerTablaHorario;
