import { useState } from 'react';
import { updatePractica, getPracticas } from '@services/practica.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPractica = (fetchPracticas) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleClickUpdate = () => {
        setIsPopupOpen(true);
    };

    async function handleUpdate(updatedPracticaData) {
        if (!updatedPracticaData) return;
        try {
            const ID_practica = Number(updatedPracticaData.ID_practica);
            const formattedData = {
                nombre: updatedPracticaData.nombre,
                descripcion: updatedPracticaData.descripcion,
                direccion: updatedPracticaData.direccion,
                cupo: Number(updatedPracticaData.cupo),
                estado: updatedPracticaData.estado,
                ID_especialidad: Number(updatedPracticaData.ID_especialidad),
            }
            
            const statusCode = await updatePractica(ID_practica, formattedData);
            console.log(statusCode);
            if (statusCode === 200) {
                showSuccessAlert('¡Actualizado!', 'La práctica ha sido actualizada correctamente.');
                setIsPopupOpen(false);
            }

            fetchPracticas();
        } catch (error) {
            console.error('Error al actualizar la práctica:', error);
            showErrorAlert('Cancelado', 'Ocurrió un error al actualizar la práctica.');
        }
    };

    return {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
    };
};

export default useEditPractica;
