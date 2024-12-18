import "../styles/practica.css";
import { useCallback, useState } from "react";
import Table from "@components/Table";
import Search from "../components/Search";
import useGetPostulaciones from "../hooks/practica/useGetPostulaciones";
import { deleteDataAlert } from "../helpers/sweetAlert";
import { showErrorAlert } from "../helpers/sweetAlert";
import { cancelarPostulacion } from "../services/practica.service";

export default function Postulaciones() {
    const { postulaciones, fetchPostulaciones } = useGetPostulaciones();
    const [filterPostulacion, setFilterPostulacion] = useState('');
    const [dataPostulacion, setDataPostulacion] = useState('');

    const columns = [
        { title: "Nombre", field: "nombre", width: 200, responsive: 0 },
        { title: "Descripción", field: "descripcion", width: 250, responsive: 3 },
        { title: "Especialidad", field: "nombreEspecialidad", width: 200, responsive: 2 },
        { title: "Dirección", field: "direccion", width: 200, responsive: 2 },
        { title: "Publicado hace", field: "publicadoHace", width: 150, responsive: 2 },
        { title: "Cupo", field: "cupo", width: 80, responsive: 2 },
        { title: "Estado", field: "estadoPostulacion", width: 100, responsive: 2 },
    ];

    const handleSelectionChange = useCallback((selectedPostulaciones) => {
        setDataPostulacion(selectedPostulaciones);
    }, [setDataPostulacion]);

    const handlePostulacionFilterChange = (e) => {
        setFilterPostulacion(e.target.value);
    };

    const handleCancelarPostulacionClick = async () => {
        const ID_postulacion = dataPostulacion[0].ID_postulacion;
        try {
            const result = await deleteDataAlert();

            if (result.isConfirmed) {
                const response = await cancelarPostulacion(ID_postulacion);

                if (response.status === 200) {
                    fetchPostulaciones();
                } else {
                    showErrorAlert('Error', response.message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table practica-title-table">Mis postulaciones</h1>
                    <div className="filter-actions">
                        <Search value={filterPostulacion} onChange={handlePostulacionFilterChange} placeholder={'Buscar'} />
                        <button className="postulacion-cancelar-button practica-button" onClick={handleCancelarPostulacionClick} disabled={dataPostulacion.length === 0}>
                            Cancelar postulación
                        </button>
                    </div>
                </div>
                <Table
                    data={postulaciones}
                    columns={columns}
                    filter={filterPostulacion}
                    initialSortName={'publicadoHace'}
                    onSelectionChange={handleSelectionChange}
                />
            </div>
        </div>
    );

}