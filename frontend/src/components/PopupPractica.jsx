// PopupPractica.jsx
import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const practicaData = data[0];
    const convertToDate = (fechaString) => {
        // Separar la fecha y la hora
        const [datePart, timePart] = fechaString.split(', ');

        const [day, month, year] = datePart.split('/');
    
        const date = new Date(`${year}-${month}-${day}T${timePart}`);
        
        return date.toISOString().slice(0, 16);
    };

    const handleSubmit = (formData) => {
        action(formData);
    };

    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <Form
                        title="Editar práctica"
                            fields={[
                            {
                                label: "",
                                name: "ID_practica",
                                defaultValue: practicaData.ID || "",
                                fieldType: 'input',
                                type: "hidden",
                            },
                            {
                                label: "Nombre de la práctica",
                                name: "nombre",
                                defaultValue: practicaData.nombre || "",
                                placeholder: 'Nombre de la práctica',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 3,
                                maxLength: 100,
                            },
                            {
                                label: "Descripción",
                                name: "descripcion",
                                defaultValue: practicaData.descripcion || "",
                                placeholder: 'Descripción detallada de la práctica',
                                fieldType: 'textarea',
                                required: true,
                                minLength: 5,
                                maxLength: 500,
                            },
                            {
                                label: "Dirección",
                                name: "direccion",
                                defaultValue: practicaData.direccion || "",
                                placeholder: 'Dirección o ubicación de la práctica',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 5,
                                maxLength: 200,
                            },
                            {
                                label: "Cupo",
                                name: "cupo",
                                defaultValue: practicaData.cupo || "",
                                placeholder: 'Número de personas en el cupo',
                                fieldType: 'input',
                                type: "number",
                                required: true,
                                min: 1,
                                max: 100,
                                },
                            {
                                
                            },
                            {
                                label: "Fecha de publicación",
                                name: "fechaPublicacion",
                                defaultValue: convertToDate(practicaData.fechaPublicacion) || "",
                                placeholder: 'Fecha de publicación',
                                fieldType: 'input',
                                type: "datetime-local",
                                required: true,
                            },
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Editar práctica"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
