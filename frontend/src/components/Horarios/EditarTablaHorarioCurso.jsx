const EditarTablaHorarioCurso = ({ horario, diasSemana, horas, materias, onMateriaChange }) => {
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
                {horario[dia]?.[hora] === "Recreo" ? (
                  <span>Recreo</span>
                ) : (
                  <select
                    value={materias.find((m) => m.nombre === horario[dia]?.[hora])?.ID_materia || "Sin asignar"}
                    onChange={(e) => onMateriaChange(dia, hora, e.target.value)}
                  >
                    <option value="Sin asignar">Sin asignar</option>
                    {materias.map((materia) => (
                      <option key={materia.ID_materia} value={materia.ID_materia}>
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

export default EditarTablaHorarioCurso;






