import { useState } from 'react';
import { createPractica } from '@services/practica.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useCreatePractica = (setPracticas) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (newPracticaData) => {
        try {
            setIsLoading(true);
            const formattedData = {
                nombre: newPracticaData.nombre,
                descripcion: newPracticaData.descripcion,
                direccion: newPracticaData.direccion,
                cupo: Number(newPracticaData.cupo),
                estado: newPracticaData.estado,
                ID_especialidad: Number(newPracticaData.ID_especialidad),
            };
            
            const newPractica = await createPractica(formattedData);

            showSuccessAlert('¡Registrado!', 'La práctica ha sido registrada correctamente.');

            setPracticas(prevPracticas => [...prevPracticas, newPractica]);
        } catch (error) {
            console.error('Error al crear la práctica:', error);
            showErrorAlert('Error', 'Ocurrió un error al crear la práctica.');
        } finally {
            setIsLoading(false);
        }
    };

    return { handleCreate, isLoading };
};

export default useCreatePractica;
