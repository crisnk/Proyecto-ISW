import React from "react";
import '@styles/InfoAtrasoCard.css';

const InfoAtrasoCard = ({ materia, curso, aula, profesor }) => {
  return (
    <div className="info-card">
      <h2>Información de la Clase</h2>
      <p><strong>Materia:</strong> {materia}</p>
      <p><strong>Curso:</strong> {curso}</p>
      <p><strong>Aula:</strong> {aula}</p>
      <p><strong>Profesor:</strong> {profesor}</p>
    </div>
  );
};

export default InfoAtrasoCard;
