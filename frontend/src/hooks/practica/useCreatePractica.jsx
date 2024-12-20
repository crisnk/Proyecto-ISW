import { createPractica } from '@services/practica.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const useCreatePractica = (fetchPracticas) => {
    const handleCreate = async (newPracticaData) => {
        try {
            const formattedData = {
                nombre: newPracticaData.nombre,
                descripcion: newPracticaData.descripcion,
                direccion: newPracticaData.direccion,
                cupo: Number(newPracticaData.cupo),
                estado: newPracticaData.estado,
                ID_especialidad: Number(newPracticaData.ID_especialidad),
            };
            
            const response = await createPractica(formattedData);

            if (response.status === 201) {
                showSuccessAlert('¡Registrado!', 'La práctica ha sido registrada correctamente.');
                fetchPracticas();
            } else {
                showErrorAlert('Error', response.details);
            }

        } catch (error) {
            console.error('Error al crear la práctica:', error);
            showErrorAlert('Error', 'Ocurrió un error al crear la práctica.');
        }
    };

    return { handleCreate };
};

export default useCreatePractica;
