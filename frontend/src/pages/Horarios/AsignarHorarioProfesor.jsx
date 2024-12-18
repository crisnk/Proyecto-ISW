import { useState, useEffect, useCallback } from "react";
import {
  getProfesores,
  getMaterias,
  getCursos,
  getHorarioProfesor,
  saveHorarioProfesor,
  notificacionProfesor,
  getEmailProfesor,
} from "../../services/horario.service";
import EditarTablaHorarioProfesor from "../../hooks/Horarios/EditarTablaHorarioProfesor";
import Spinner from "../../hooks/Horarios/Spinner";
import { diasSemana, horas, recreoHoras } from "../../hooks/Horarios/HorariosConfig";
import Swal from "sweetalert2";
import "@styles/Horarios/asignarHorario.css";

const AsignarHorarioProfesor = () => {
  const [profesor, setProfesor] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [horario, setHorario] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  const initializeHorario = useCallback(() => {
    const newHorario = {};
    diasSemana.forEach((dia) => {
      newHorario[dia] = {};
      horas.forEach((hora) => {
        newHorario[dia][hora] = recreoHoras.includes(hora)
          ? { materia: "Recreo", curso: "Recreo" }
          : { materia: "Sin asignar", curso: "Sin asignar" };
      });
    });
    return newHorario;
  }, []);

  const fetchHorarioProfesor = useCallback(async () => {
    if (!profesor) {
      setHorario(initializeHorario());
      return;
    }

    setLoading(true);
    try {
      const existingHorario = await getHorarioProfesor(profesor);
      const formattedHorario = initializeHorario();

      if (existingHorario && Array.isArray(existingHorario)) {
        existingHorario.forEach((item) => {
          if (formattedHorario[item.dia]?.[item.bloque]) {
            formattedHorario[item.dia][item.bloque] = {
              materia: item.ID_materia?.toString() || "Sin asignar",
              curso: item.ID_curso?.toString() || "Sin asignar",
            };
          }
        });
      }

      setHorario(formattedHorario);
    } catch (error) {
      setHorario(initializeHorario());
    } finally {
      setLoading(false);
    }
  }, [profesor, initializeHorario]);

  useEffect(() => {
    fetchHorarioProfesor();
  }, [profesor, fetchHorarioProfesor]);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setMaterias(await getMaterias());
      } catch (error) {
        console.error("Error cargando materias:", error.message);
        Swal.fire("Error", "No se pudieron cargar las materias.", "error");
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setProfesores(await getProfesores());
      } catch (error) {
        console.error("Error cargando profesores:", error.message);
        Swal.fire("Error", "No se pudieron cargar los profesores.", "error");
      }
    };
    fetchProfesores();
  }, []);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setCursos(await getCursos());
      } catch (error) {
        console.error("Error cargando cursos:", error.message);
        Swal.fire("Error", "No se pudieron cargar los cursos.", "error");
      }
    };
    fetchCursos();
  }, []);

  const handleGuardarHorario = async () => {
    console.log("Ejecutando handleGuardarHorario"); 
    if (!profesor) {
      Swal.fire("Advertencia", "Debes seleccionar un profesor antes de guardar.", "warning");
      return;
    }
  
    const bloquesInvalidos = diasSemana.flatMap((dia) =>
      horas.filter((hora) => {
        const bloque = horario[dia]?.[hora];
        return (
          bloque &&
          ((bloque.materia !== "Sin asignar" && bloque.curso === "Sin asignar") ||
            (bloque.materia === "Sin asignar" && bloque.curso !== "Sin asignar")) &&
          bloque.materia !== "Recreo"
        );
      })
    );
  
    if (bloquesInvalidos.length > 0) {
      Swal.fire(
        "Error",
        "Cada bloque modificado debe tener tanto una materia como un curso asignados.",
        "error"
      );
      return;
    }
  
    setSaving(true);
    try {
      const cambios = diasSemana.flatMap((dia) =>
        horas
          .map((hora) => {
            const bloque = horario[dia]?.[hora];
            if (
              bloque &&
              bloque.materia !== "Sin asignar" &&
              bloque.curso !== "Sin asignar" &&
              bloque.materia !== "Recreo"
            ) {
              return {
                ID_materia: parseInt(bloque.materia, 10),
                ID_curso: parseInt(bloque.curso, 10),
                dia,
                bloque: hora,
              };
            }
            return null;
          })
          .filter(Boolean)
      );
      
      if (cambios.length === 0) {
        Swal.fire("Advertencia", "No hay bloques válidos para guardar.", "warning");
        return;
      }
      console.log("Payload enviado al backend:", { rut: profesor, horario: cambios });
      await saveHorarioProfesor({ rut: profesor, horario: cambios });
      await fetchHorarioProfesor();
      Swal.fire("Éxito", "Horario guardado correctamente.", "success");
    } catch (error) {
      if (error.response?.data?.message) {
        Swal.fire("Error", error.response.data.message, "error");
      } else {
        Swal.fire("Error", "No se pudo guardar el horario.", "error");
      }
    } finally {
      setSaving(false);
    }
  };
  

  const handleNotificarProfesor = async () => {
    if (!profesor) {
      Swal.fire("Advertencia", "Debes seleccionar un profesor para notificar.", "warning");
      return;
    }
  
    setNotificationLoading(true);
    try {
      const response = await getEmailProfesor(profesor);
      console.log("Respuesta de la API para obtener email:", response); 
  
      let email = response;
      if (!email) {
        Swal.fire("Error", "El correo electrónico no está definido o no se pudo obtener.", "error");
        return;
      }
  
      const horarioDetails = diasSemana
        .flatMap((dia) =>
          horas
            .map((hora) => {
              const bloque = horario[dia]?.[hora];
              if (
                bloque &&
                bloque.materia !== "Recreo" &&
                bloque.materia !== "Sin asignar" &&
                bloque.curso !== "Sin asignar"
              ) {
                return `${dia}: ${bloque.materia} (${hora})`;
              }
              return null;
            })
            .filter(Boolean)
        )
        .join(", ");
  
      await notificacionProfesor(email, horarioDetails);
  
      Swal.fire("Éxito", "El profesor ha sido notificado correctamente.", "success");
    } catch (error) {
      if (error.response?.data?.message) {
        Swal.fire("Error", error.response.data.message, "error");
      } else {
        Swal.fire("Error", "No se pudo enviar la notificación al profesor.", "error");
      }
    } finally {
      setNotificationLoading(false);
    }
  };
  

  const handleMateriaCursoChange = (dia, bloque, key, value) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [bloque]: {
          ...prev[dia][bloque],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div>
      <h2 style={{ fontSize: "2rem", textAlign: "center" }}>Asignar Horario a Profesores</h2>
      <div>
        <label
          style={{
            fontSize: "1.5rem",
            display: "block",  
            marginBottom: "8px"
          }}
        >
          Profesor:</label>
  <select
    value={profesor}
    onChange={(e) => setProfesor(e.target.value)}
    style={{
      fontSize: "1.5rem",
      padding: "10px",    
      width: "100%",      
      maxWidth: "400px",  
    }}
  >
    <option value="" style={{ fontSize: "1.5rem" }}>Selecciona profesor</option>
    {profesores.map((p) => (
      <option key={p.rut} value={p.rut} style={{ fontSize: "1.5rem" }}>
        {p.nombreCompleto}
      </option>
    ))}
  </select>
</div>

      {profesor && (
        <EditarTablaHorarioProfesor
          horario={horario}
          diasSemana={diasSemana}
          horas={horas}
          materias={materias}
          cursos={cursos}
          onMateriaCursoChange={handleMateriaCursoChange}
        />
      )}
      <div
        className="button-group"
        style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}
      >
        <button onClick={handleGuardarHorario} disabled={saving}>
          {saving ? <Spinner /> : "Guardar"}
        </button>
        <button onClick={handleNotificarProfesor} disabled={notificationLoading}>
          {notificationLoading ? <Spinner /> : "Notificar"}
        </button>
      </div>
    </div>
  );
};

export default AsignarHorarioProfesor;
