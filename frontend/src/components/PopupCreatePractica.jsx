import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupCreatePractica({ show, setShow, action}) {
    const handleSubmit = (formData) => {
        action(formData);
        setShow(false);
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title="Registrar nueva práctica"
                            fields={[
                                {
                                    label: "Nombre de la práctica",
                                    name: "nombre",
                                    placeholder: 'Nombre de la práctica',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                    minLength: 3,
                                    maxLength: 255,
                                },
                                {
                                    label: "Descripción",
                                    name: "descripcion",
                                    placeholder: 'Descripción detallada de la práctica',
                                    fieldType: 'textarea',
                                    required: true,
                                    minLength: 10,
                                    maxLength: 255,
                                },
                                {
                                    label: "Dirección",
                                    name: "direccion",
                                    placeholder: 'Dirección o ubicación de la práctica',
                                    fieldType: 'input',
                                    type: "text",
                                    required: true,
                                    minLength: 5,
                                    maxLength: 255,
                                },
                                {
                                    label: "Cupo",
                                    name: "cupo",
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
                            buttonText="Crear práctica"
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
