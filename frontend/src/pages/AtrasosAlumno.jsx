import Table from '@components/Table';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import '@styles/atrasos.css';
import '@styles/modal.css';

import { getAtrasos } from '@services/atrasos.service.js'; // Nueva función de servicio
import { justificarAtraso } from '@services/justificativo.service.js'; // Nueva función de servicio

const Atrasos = () => {
    const [atrasos, setAtrasos] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [selectedAtraso, setSelectedAtraso] = useState(null); // Atraso seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal
    const [motivo, setMotivo] = useState(""); // Motivo de justificación
    const [documento, setArchivo] = useState(null); // Archivo subido

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAtrasos();
                if (response.status === 'Success' && Array.isArray(response.data)) {
                    setAtrasos(response.data);
                } else {
                    console.error("La respuesta no es un array:", response);
                    setAtrasos([]);
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
    
        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const handleJustificar = (atraso) => {
        setSelectedAtraso(atraso); // Selecciona el atraso
        setIsModalOpen(true);     // Abre el modal
    };

    const closeModal = () => {
        setIsModalOpen(false);    // Cierra el modal
        setSelectedAtraso(null);  // Limpia el atraso seleccionado
    };

    const handleFileChange = (e) => {
        setArchivo(e.target.files[0]); // Guarda el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAtraso || !motivo || !documento) {
            alert("Todos los campos son obligatorios.");
            return;
        }
``
        const formData = new FormData();
        formData.append("ID_atraso", selectedAtraso.id); // ID del atraso seleccionado
        formData.append("motivo", motivo); // Motivo ingresado
        formData.append("documento", documento); // Archivo adjunto

        try {
            const response = await justificarAtraso(formData); // Llamada al backend
            if (response.status === 'Success') {
                alert("Atraso justificado correctamente.");
                closeModal();
                // Opcional: Recargar los atrasos
                const updatedAtrasos = await getAtrasos();
                setAtrasos(updatedAtrasos.data);
            } else {
                alert("Error al justificar el atraso.");
            }
        } catch (error) {
            console.error("Error al justificar el atraso:", error);
            alert("Error en el servidor.");
        }
    };

    const columns = [
        { title: "Fecha", field: "fecha", width: 300, responsive: 0 },
        { title: "Hora", field: "hora", width: 250, responsive: 3 },
        { title: "Estado", field: "estado", width: 300, responsive: 2 },
        { title: "Justificativo", field: "estadoJustificativo", width: 200, responsive: 2 }
    ];

    return (
        <div className='alumno-funciones'>
            <div className='main-container'>
                <div className='table-container'>
                    <div className='top-table'>
                        <h1 className='title-table'>Atrasos</h1>
                        <div className='filter-actions'>
                            <Search value={filterText} onChange={handleFilterChange} placeholder={'Filtrar estado'} />
                            <button className='justificar-button' onClick={handleJustificar}>
                                Justificar
                            </button>
                        </div>
                    </div>
                    <Table
                        data={atrasos}
                        columns={columns}
                        filter={filterText}
                        dataToFilter={['fecha', 'hora', 'estado']}
                        initialSortName={'fecha'}
                        onRowClick={handleJustificar} // Añade la función al hacer clic en una fila
                    />
                </div>

                {/* Modal para justificar */}
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Justificar Atraso</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Motivo:
                                    <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
                                </label>
                                <label>
                                    Adjuntar Archivo:
                                    <input type="file" accept=".pdf, .png" onChange={handleFileChange} required />
                                </label>
                                <div className="modal-actions">
                                    <button type="submit">Enviar</button>
                                    <button type="button" onClick={closeModal}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Atrasos;
