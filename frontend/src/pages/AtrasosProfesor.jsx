import Table from '@components/Table';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import '@styles/atrasos.css';
import { getAtrasosAlumnos } from '@services/atrasos.service.js';

const AtrasosAlumnos = () => {
    const [atrasos, setAtrasosAlumnos] = useState([]);
    const [filterText, setFilterText] = useState(''); 

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
    };

    const columns = [
        { title: "Nombre", field: "nombre", width: 300, responsive: 1 },
        { title: "Rut", field: "rut", width: 150, responsive: 0 },
        { title: "Curso", field: "curso", width: 150, responsive: 0 },
        { title: "Fecha", field: "fecha", width: 150, responsive: 0 },
        { title: "Hora", field: "hora", width: 100, responsive: 3 },
        { title: "Estado", field: "estado", width: 150, responsive: 2 },
        { title: "Justificativo", field: "estadoJustificativo", width: 200, responsive: 2 }
    ];

    return (
        <div className='main-container'>
            <div className='table-container'>
                <div className='top-table'>
                    <h1 className='title-table'>Atrasos Alumnos</h1>
                    <div className='filter-actions'>
                        <Search value={filterText} onChange={handleFilterChange} placeholder={'Filtrar estado '} />
                        <button className='revisar-button' onClick={handleJustificar}>
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
                />
            </div>
        </div>
    );
};
export default AtrasosAlumnos;