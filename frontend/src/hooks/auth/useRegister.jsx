import { useState, useEffect } from 'react';

const useRegister = () => {
    const [errorEmail, setErrorEmail] = useState('');
    const [errorRut, setErrorRut] = useState('');
    const [errorCurso, setErrorCurso] = useState(''); 
    const [inputData, setInputData] = useState({ email: '', rut: '', curso: '' });

    useEffect(() => {
        if (inputData.email) setErrorEmail('');
        if (inputData.rut) setErrorRut('');
        if (inputData.curso) setErrorCurso(''); 
    }, [inputData.email, inputData.rut, inputData.curso]);

    const errorData = (dataMessage) => {
        if (dataMessage.dataInfo === 'email') {
            setErrorEmail(dataMessage.message);
        } else if (dataMessage.dataInfo === 'rut') {
            setErrorRut(dataMessage.message);
        } else if (dataMessage.dataInfo === 'curso') { 
            setErrorCurso(dataMessage.message);
        }
    };

    const handleInputChange = (field, value) => {
        setInputData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return {
        errorEmail,
        errorRut,
        errorCurso, // Exporta el error del curso
        inputData,
        errorData,
        handleInputChange,
    };
};

export default useRegister;
