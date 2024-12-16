import React, { useEffect, useState } from "react";
import { obtenerInfoAtraso, registrarAtrasos } from '@services/atrasos.service.js';
import '@styles/InfoAtrasoCard.css';
import "@styles/styles.css";
import InfoAtrasoCard from "../components/InfoAtrasoCard";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegistrarAtraso = () => {
  const navigate = useNavigate(); // Hook para navegar entre rutas
  const [infoAtraso, setInfoAtraso] = useState(null); // Datos de la clase.
  const [loading, setLoading] = useState(false); // Estado de carga.
  const [error, setError] = useState(""); // Mensajes de error.
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito.

  // Obtener información del atraso al cargar la página.
  useEffect(() => {
    const fetchInfoAtraso = async () => {
      setLoading(true);
      setError("");
      setSuccessMessage("");
  
      try {
        const response = await obtenerInfoAtraso();
        console.log(response);
        if (response.status === "Success") {
          setInfoAtraso(response.data);  // Accede al objeto 'data' aquí
        } else {
          setError("No se pudo obtener la información del atraso.");
        }
      } catch (err) {
        setError(err.message || "Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInfoAtraso();
  }, []);

  // Registrar el atraso
  const registrarAtraso = async () => {                                                 
    setLoading(true);
    setError("");
    setSuccessMessage("");
  
    try {
      const response = await registrarAtrasos(); // Llama al servicio
      if (response.status === "Success") { // Verifica si la operación fue exitosa
        setSuccessMessage("Atraso registrado correctamente.");
        setInfoAtraso(null); // Limpia los datos si es necesario
        Swal.fire({
          title: "¡Éxito!",
          text: "El atraso ha sido registrado correctamente.",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/homeAlumno"); // Redirige a /homeAlumno
        });
      } else {
        setError(response.message || "Error al registrar el atraso.");
      }
    } catch (err) {
      setError(err.message || "Error al registrar el atraso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='alumno-funciones'>
        <div className="page-container">
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {infoAtraso && (
            <InfoAtrasoCard
              materia={infoAtraso.materia}
              curso={infoAtraso.curso}
              aula={infoAtraso.aula}
              profesor={infoAtraso.profesor}
            >
              <button
                className="register-button"
                onClick={registrarAtraso}
                disabled={loading}
              >
                Registrar Atraso
              </button>
            </InfoAtrasoCard>
          )}
        </div> 
    </div>     
  );
};

export default RegistrarAtraso;
