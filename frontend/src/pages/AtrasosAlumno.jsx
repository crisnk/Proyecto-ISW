import Table from '@components/Table';
import Search from '../components/Search';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '@styles/users.css';
import { getAtrasos } from '@services/atrasos.service.js';

const Atrasos = () => {
    const [atrasos, setAtrasos] = useState([]);
    const [filterText, setFilterText] = useState(''); 
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAtrasos(); // Llama a tu función para obtener datos
                console.log("Respuesta del backend:", response); // Verifica la respuesta
                if (response.status === 'Success' && Array.isArray(response.data)) {
                    setAtrasos(response.data); // Establece el array de atrasos
                } else {
                    console.error("La respuesta no es un array:", response);
                    setAtrasos([]); // Establece un array vacío o maneja el error
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
    
        fetchData(); // Llama a la función aquí
    }, []);
  
    const handleFilterChange = (e) => {
      setFilterText(e.target.value); 
    };
  
    const columns = [
      { title: "Fecha", field: "fecha", width: 300, responsive: 0 },
      { title: "Hora", field: "hora", width: 250, responsive: 3 },
      { title: "Estado", field: "estado", width: 300, responsive: 2 },
      { title: "Justificativo", field: "estado", width: 200, responsive: 2 }
    ];
  
    return (
      <div className='main-container'>
        <Navbar />
        <div className='table-container'>
          <div className='top-table'>
            <h1 className='title-table'>Atrasos</h1>
            <div className='filter-actions'>
              <Search value={filterText} onChange={handleFilterChange} placeholder={'Filtrar por fecha, hora o estado'} />
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
  
  export default Atrasos;