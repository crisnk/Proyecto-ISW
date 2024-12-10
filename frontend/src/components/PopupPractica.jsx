import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import QuestionIcon from '@assets/QuestionCircleIcon.svg';

export default function Popup({ show, setShow, data, action }) {
    const practicaData = data[0];

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
                                label: "Estado",
                                name: "estado",
                                defaultValue: practicaData.estado || "activo",
                                placeholder: "activo/inactivo",
                                fieldType: "select",
                                options: [
                                    { value: 'activo', label: 'activo' },
                                    { value: 'inactivo', label: 'inactivo' },
                                ],
                                required: true,
                            },
                            {   
                                label: "Especialidad",
                                name: "ID_especialidad",
                                defaultValue: practicaData.ID_especialidad || "",
                                placeholder: "Especialidad",
                                fieldType: "select",
                                options: [
                                    { value: '1', label: 'Mecánica Automotriz' },
                                    { value: '2', label: 'Mecánica Industrial' },
                                    { value: '3', label: 'Electricidad' },
                                    { value: '4', label: 'Electrónica' },
                                    { value: '5', label: 'Telecomunicación' },
                                ],
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
