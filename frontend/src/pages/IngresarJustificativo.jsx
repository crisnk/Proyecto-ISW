import { useEffect, useState } from 'react';
import Form from '../components/Form'; // Importa tu Form
import { obtenerInfoAtrasosJustificables } from '@services/atrasos.service.js';
import { justificarAtraso } from '@services/justificativo.service.js';

const IngresarJustificativo = () => {
    const [atrasosDisponibles, setAtrasosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener atrasos disponibles
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
            name: 'documento',
            label: 'Documento',
            type: 'file',
            fieldType: 'input',
            required: true,
            placeholder: 'Seleccione un documento'
        },
        {
            name: 'atraso',
            label: 'Atraso',
            fieldType: 'select',
            options: atrasosDisponibles.map((atraso, index) => ({
                value: `${atraso.fecha} ${atraso.hora}`, 
                label: `Fecha: ${atraso.fecha} | Hora: ${atraso.hora} | Materia: ${atraso.materia}` 
            })),
            required: true
        }
    ];

    const handleSubmit = async (formData) => {
    try {

        const data = new FormData();
        data.append('motivo', formData.motivo);
        data.append('documento', formData.documento); // `formData.documento` debe ser un archivo
        data.append('ID_atraso', formData.atraso);
        console.log('Dataa:', data);
        // Llamar al servicio para justificar el atraso
        const response = await justificarAtraso(data);  
    } catch (error) {
        console.error('Error al registrar justificativo:', error);
        alert('Hubo un problema al registrar el justificativo. Por favor, inténtalo de nuevo.');
    }         
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className='alumno-funciones'>
            <div>
                <h1>Registrar Justificativo</h1>
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