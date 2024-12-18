import { useState } from 'react';
import { updatePractica, getPracticas } from '@services/practica.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import { getTimeAgo } from '../../helpers/getTimeAgo';

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
            
            const statusCode = await updatePractica(ID_practica, formattedData);

            if (statusCode === 200) {
                showSuccessAlert('¡Actualizado!', 'La práctica ha sido actualizada correctamente.');
                setIsPopupOpen(false);
            }

            const allPracticas = await getPracticas();
            const formattedPracticas = allPracticas.map(practica => ({
                ID: practica.ID_practica,
                nombre: practica.nombre,
                descripcion: practica.descripcion,
                direccion: practica.direccion,
                fechaPublicacion: getTimeAgo(practica.createdAt),
                cupo: practica.cupo,
                estado: practica.estado,
                nombreEspecialidad: practica.ID_especialidad.nombre,
                ID_especialidad: practica.ID_especialidad.ID_especialidad,
            }));

            setPracticas(formattedPracticas);
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

export default useEditPractica;
