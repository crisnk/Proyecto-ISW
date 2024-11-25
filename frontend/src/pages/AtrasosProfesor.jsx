import Table from '@components/Table';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import '@styles/atrasos.css';
import '@styles/modal.css';
import { getAtrasosAlumnos } from '@services/atrasos.service.js';

const AtrasosAlumnos = () => {
    const [atrasos, setAtrasosAlumnos] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [rutSeleccionado, setRutSeleccionado] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAtrasosAlumnos();
                console.log("Respuesta del backend:", response);
                if (response.status === 'Success' && Array.isArray(response.data)) {
                    setAtrasosAlumnos(response.data);
                } else {
                    console.error("La respuesta no es un array:", response);
                    setAtrasosAlumnos([]);
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

    const handleJustificar = () => {
        console.log("Justificar botón presionado");
        console.log("RUT seleccionado:", rutSeleccionado); 
        const modal = document.getElementById("modal-revisar");
        modal.style.display = "flex"; 
    };

    const handleCloseModal = () => {
        const modal = document.getElementById("modal-revisar");
        modal.style.display = "none";
    };

    const handleRowSelect = (rut) => {
        setRutSeleccionado(rut); 
    };

    const columns = [
        { title: "Nombre", field: "nombre", width: 300, responsive: 0 },
        { title: "Rut", field: "rut", width: 200, responsive: 0 },
        { title: "Fecha", field: "fecha", width: 150, responsive: 0 },
        { title: "Hora", field: "hora", width: 150, responsive: 0 },
        { title: "Estado", field: "estado", width: 150, responsive: 0 },
        { title: "Justificativo", field: "estadoJustificativo", width: 200, responsive: 0 }
    ];

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Atrasos del curso {atrasos.length > 0 ? atrasos[0].curso : 'Curso no disponible'}</h1>
                    <div className='filter-actions'>
                        <Search value={filterText} onChange={handleFilterChange} placeholder={'Filtrar estado '} />
                        <button className='revisar-button' onClick={handleJustificar} >
                            Revisar
                        </button>
                    </div>
                </div>
                <Table
                    data={atrasos} 
                    columns={columns} 
                    filter={filterText} 
                    dataToFilter={['fecha', 'hora', 'estado']} 
                    initialSortName={'fecha'} 
                    onRowSelect={handleRowSelect} 
                />
            </div>

            <div className="modal" id="modal-revisar">
                <div className="modal-content">
                    <h2>Revisar Justificativo</h2>
                    <p>Info justificativo</p>
                    <p>------------------</p>
                    <p>------------------</p>
                    <p>¿Deseas aprobar el justificativo?</p>
                    <div className="modal-actions">
                        <button type="submit" className="aceptar-button" onClick={handleCloseModal}>Aceptar</button>
                        <button type="button" className="rechazar-button" onClick={handleCloseModal}>Rechazar</button>
 </div>
                </div>
            </div>
        </div>
    );
};

export default AtrasosAlumnos;