export default function getColumnsByRole(rol, pageName) {
    if (rol === "alumno") {
      return [
        { title: "Nombre", field: "nombre", width: 200, responsive: 0 },
        { title: "Descripción", field: "descripcion", width: 250, responsive: 3 },
        { title: "Especialidad", field: "nombreEspecialidad", width: 200, responsive: 2 },
        { title: "Dirección", field: "direccion", width: 200, responsive: 2 },
        { title: "Publicado hace", field: "publicadoHace", width: 150, responsive: 2 },
        { title: "Cupo", field: "cupo", width: 80, responsive: 2 },
        { title: "Estado", field: "estadoPostulacion", width: 100, responsive: 2 },
      ];
    }
    if (rol === "EDP" && pageName === 'Postulaciones') {
      return [
          { title: "RUT", field: "rut", width: 100, responsive: 0 },
          { title: "Alumno", field: "nombreAlumno", width: 250, responsive: 0 },
          { title: "ID", field: "ID_practica", width: 50, responsive: 0 },
          { title: "Nombre de la practica", field: "nombrePractica", width: 200, responsive: 0 },
          { title: "Especialidad", field: "nombreEspecialidad", width: 150, responsive: 0 },
          { title: "Fecha postulación", field: "fechaPostulacion", width: 170, responsive: 0 },
          { title: "Cupos libres", field: "cupo", width: 150, responsive: 0 },
          { title: "Estado", field: "estadoPostulacion", width: 100 },
      ];
    }
    if (rol === "EDP" && pageName === 'Practica') {
      return [
          { title: "Nombre", field: "nombre", width: 250 },
          { title: "Descripcion", field: "descripcion", width: 250 },
          { title: "Direccion", field: "direccion", width: 50 },
          { title: "Especialidad", field: "nombreEspecialidad", width: 100 },
          { title: "Cupos", field: "cupo", width: 170 },
          { title: "Publicado hace", field: "fechaPublicacion", width: 150 },
          { title: "Estado", field: "estado", width: 150 },
      ];
    }
  }