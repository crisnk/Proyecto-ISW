const VerTablaHorarioAlumno = ({
  horario = {},
  diasSemana = [],
  horas = [],
  onBlockColorChange,
  backgroundColor = "rgba(255, 255, 255, 0.8)",
  curso = "Sin curso",
  setCursorURL,
  selectedColor,
  cursorURL,
}) => {
  const recreoHoras = ["10:30 - 11:15", "13:00 - 13:45"];

  const handleMouseEnter = () => {
    if (selectedColor) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
          <path d="M4 4 L28 16 L16 28 Z" fill="${selectedColor}" stroke="#fff" stroke-width="1" />
          <path d="M5 5 L16 27 L26 17 Z" fill="rgba(255, 255, 255, 0.5)" />
          <circle cx="16" cy="16" r="15.5" fill="none" stroke="rgba(0, 0, 0, 0.3)" stroke-width="1" />
        </svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      setCursorURL(URL.createObjectURL(blob));
    }
  };

  const handleMouseLeave = () => {
    setCursorURL("");
  };

  const handleRecreoClick = () => {
    const updatedHorario = { ...horario };

    diasSemana.forEach((dia) => {
      recreoHoras.forEach((recreo) => {
        if (updatedHorario[dia]?.[recreo]) {
          updatedHorario[dia][recreo].color = selectedColor;
        }
      });
    });

    onBlockColorChange(updatedHorario);
  };

  const handleMateriaClick = (materia) => {
    const updatedHorario = { ...horario };

    diasSemana.forEach((dia) => {
      horas.forEach((hora) => {
        if (updatedHorario[dia]?.[hora]?.materia === materia) {
          updatedHorario[dia][hora].color = selectedColor;
        }
      });
    });

    onBlockColorChange(updatedHorario);
  };

  return (
    <div
      className="tabla-horarios-container"
      style={{
        backgroundColor: backgroundColor,
        borderRadius: "12px",
        padding: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        cursor: cursorURL ? `url(${cursorURL}), auto` : "auto",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tabla-header-container">
        <p className="tabla-header-cursoM">Curso: {curso}</p>
      </div>
      <table className="tabla-horarios">
        <thead>
          <tr>
            <th className="tabla-header">Horas</th>
            {diasSemana.map((dia) => (
              <th key={dia} className="tabla-header">
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora) => (
            <tr key={hora} className={recreoHoras.includes(hora) ? "recreo-row" : ""}>
              <td className="hora-col">{hora}</td>
              {diasSemana.map((dia) => (
                <td
                  key={`${dia}-${hora}`}
                  className="contenido-col"
                  style={{
                    backgroundColor: horario[dia]?.[hora]?.color || "#ffffff",
                  }}
                  onClick={
                    recreoHoras.includes(hora)
                      ? handleRecreoClick
                      : () => handleMateriaClick(horario[dia][hora]?.materia)
                  }
                >
                  {recreoHoras.includes(hora) ? (
                    <span className="recreo-text">Recreo</span>
                  ) : horario[dia]?.[hora] ? (
                    <div className="contenido-bloque">
                      <div className="materia">
                        <strong>{horario[dia][hora].materia || "Sin asignar"}</strong>
                      </div>
                      <div className="profesor">
                        {horario[dia][hora].profesor || "Sin profesor"}
                      </div>
                    </div>
                  ) : (
                    <span className="sin-asignar">Sin asignar</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerTablaHorarioAlumno;
