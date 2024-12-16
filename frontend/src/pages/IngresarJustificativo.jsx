import { useEffect, useState } from 'react';
import Form from '../components/Form'; // Importa tu Form
import { obtenerInfoAtrasosJustificables } from '@services/atrasos.service.js';
import { justificarAtraso } from '@services/justificativos.service.js';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 

const IngresarJustificativo = () => {
    const navigate = useNavigate();
    const [atrasosDisponibles, setAtrasosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAtrasos = async () => {
        try {
            const response = await obtenerInfoAtrasosJustificables(); 
            setAtrasosDisponibles(response.data);
        } catch (error) {
            console.error('Error al obtener atrasos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAtrasos();
    }, []);

    const fields = [
        {
            name: 'motivo',
            label: 'Motivo',
            type: 'text',
            fieldType: 'input',
            required: true,
            placeholder: 'Ingrese el motivo del justificativo'
        },
        {
            name: 'file',
            label: 'Documento',
            type: 'file',
            fieldType: 'file',
            required: false,
            placeholder: 'Seleccione un documento'
        },
        {
            name: 'atraso',
            label: 'Atraso',
            fieldType: 'select',
            options: atrasosDisponibles.length > 0 
                ? atrasosDisponibles.map((atraso) => ({
                    value: atraso.ID_atraso, 
                    label: `Fecha: ${atraso.fecha} | Hora: ${atraso.hora} | Materia: ${atraso.materia}` 
                  }))
                : [{ 
                    value: '', 
                    label: 'Ningún atraso cumple con las condiciones para justificar', 
                    disabled: true 
                  }],
            required: true
        }
    ];

    const handleSubmit = async (formData) => {
    try {

        const data = new FormData();
        data.append('motivo', formData.motivo);
        data.append('file', formData.file[0]); 
        data.append('ID_atraso', formData.atraso);
        
        for (let [key, value] of data.entries()) {
          console.log(`${key}:`, value); 
        } 

        await justificarAtraso(data);
        Swal.fire({
            title: '¡Justificativo Creado!',
            text: 'El justificativo se registró correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
        }).then(() => {
            navigate('/homeAlumno'); 
        });
    } catch (error) {
        console.error('Error al registrar justificativo:', error);
        alert('Hubo un problema al registrar el justificativo. Por favor, inténtalo de nuevo.');
    }         
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="alumno-funciones">
            <div className="ingresar-justificativo-container"> {/* Clase adicional */}
                <Form
                    title="Justificar Atraso"
                    fields={fields}
                    buttonText="Registrar Justificativo"
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );
};

export default IngresarJustificativo;