import { useState } from 'react';
import { updatePractica } from '@services/practica.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useEditPractica = (setPracticas) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [dataPractica, setDataPractica] = useState([]);

    const handleClickUpdate = () => {
        if (dataPractica.length > 0) {
            setIsPopupOpen(true);
        }
    };

    const handleUpdate = async (updatedPracticaData) => {
        if (updatedPracticaData) {
            try {
                const updatedPractica = await updatePractica(updatedPracticaData);
                showSuccessAlert('¡Actualizado!', 'La práctica ha sido actualizada correctamente.');
                setIsPopupOpen(false);
                
                setPracticas(prevPracticas => prevPracticas.map(practica => {
                    console.log("Práctica actual:", practica);
                    if (practica.ID_practica === updatedPractica.ID_practica) {
                        return updatedPractica;
                    }
                    return practica;
                }));

                setDataPractica([]);
            } catch (error) {
                console.error('Error al actualizar la práctica:', error);
                showErrorAlert('Cancelado', 'Ocurrió un error al actualizar la práctica.');
            }
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