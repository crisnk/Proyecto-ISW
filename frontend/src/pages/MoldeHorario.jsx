import { useState } from 'react';
import '@styles/moldeHorario.css';

const MoldeHorario = ({ onSubmitHorario }) => {
  const [horario, setHorario] = useState([]);

  const manejarClickBloque = (dia, hora) => {
    if (hora.includes('Recreo')) {
      return; // No permitir seleccionar recreos
    }

    const nuevoBloque = {
      dia,
      hora,
      materia: prompt(`Ingrese la materia para ${dia} - ${hora}:`)
    };

    if (nuevoBloque.materia) {
      setHorario((prevHorario) => [...prevHorario, nuevoBloque]);
    }
  };

  return (
    <div className="molde-horario">
      <h2>Molde de Horario</h2>
      <div className="cuadricula-horario">
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia) => (
          <div key={dia} className="columna-dia">
            <h3>{dia}</h3>
            {[
              '08:10-09:40 Clase',
              '09:40-09:55 Recreo',
              '09:55-11:25 Clase',
              '11:25-11:35 Recreo',
              '11:35-12:55 Clase',
              '12:55-13:00 Recreo',
              '13:00-14:00 Clase',
              '14:00-14:15 Recreo',
              '14:15-15:30 Clase',
              '15:30-15:40 Recreo',
              '15:40-17:00 Clase',
            ].map((hora) => (
              <div
                key={`${dia}-${hora}`}
                className={`bloque-horario ${hora.includes('Recreo') ? 'recreo' : 'clase'}`}
                onClick={() => manejarClickBloque(dia, hora)}
              >
                {`${hora}`}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="form-button" onClick={() => onSubmitHorario(horario)}>
        Guardar Horario
      </button>
    </div>
  );
};

export default MoldeHorario;
