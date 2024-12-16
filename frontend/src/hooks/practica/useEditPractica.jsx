import { useState } from 'react';
import { updatePractica, getPracticas } from '@services/practica.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPractica = (setPracticas) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPractica, setDataPractica] = useState([]);

    const handleClickUpdate = () => {
        if (dataPractica.length > 0) {
            setIsPopupOpen(true);
        }
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
            const updatedPractica = await updatePractica(ID_practica, formattedData);

            showSuccessAlert('¡Actualizado!', 'La práctica ha sido actualizada correctamente.');
            setIsPopupOpen(false);

            setPracticas(prevPracticas => prevPracticas.map(practica => {
                console.log("Práctica actual:", practica);
                if (practica.ID === updatedPractica.ID_practica) {
                    return updatedPractica;
                }
                return practica;
            }));

            setDataPractica([]);
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
        dataPractica,
        setDataPractica
    };
};

export default useEditPractica