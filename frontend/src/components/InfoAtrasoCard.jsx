import React from "react";
import '@styles/InfoAtrasoCard.css';

const InfoAtrasoCard = ({ materia, curso, aula, profesor, children }) => {
  return (
    <div className="info-card">
      <h1>Registrar Atraso</h1>
      <p><strong>Información de la Clase</strong></p>
      <p><strong>Materia:</strong> {materia}</p>
      <p><strong>Curso:</strong> {curso}</p>
      <p><strong>Aula:</strong> {aula}</p>
      <p><strong>Profesor:</strong> {profesor}</p>
      
      {children}
    </div>
  );
};

export default InfoAtrasoCard;
