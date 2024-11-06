import PaginatedTable from "@components/PaginatedTable"; 

const Horarios = () => {
  const columns = [
    { title: "Día", field: "dia" },
    { title: "Hora Inicio", field: "hora_Inicio" },
    { title: "Hora Fin", field: "hora_Fin" },
    { title: "Materia", field: "materia.nombre" },
    { title: "Curso", field: "curso.nombre" },
    { title: "Aula", field: "curso.aula" },
    { title: "Profesor", field: "profesor.nombreCompleto" },
  ];

  return (
    <div>
      <h1>Gestión de Horarios</h1>
      <PaginatedTable columns={columns} />
    </div>
  );
};

export default Horarios;
