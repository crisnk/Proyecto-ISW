import "../styles/practica.css";
import { useCallback, useState, useEffect } from "react";
import Search from "../components/Search";
import useGetPostulaciones from "../hooks/practica/useGetPostulaciones";
import { deleteDataAlert } from "../helpers/sweetAlert";
import { showErrorAlert, showSuccessAlert, showWarningAlert } from "../helpers/sweetAlert";
import { cancelarPostulacion, updatePostulacion } from "../services/practica.service";
import getColumns from "../helpers/columnHelper";
import TablaAlumnos from "../components/TablaAlumnos";

export default function Postulaciones() {
    const { postulaciones, fetchPostulaciones } = useGetPostulaciones();
    const [filterPostulacion, setFilterPostulacion] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [columns, setColumns] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("usuario"));
        const role = user.rol;
        setUserRole(role);
        setColumns(getColumns(role, 'Postulaciones'));
    }, []);

    const handlePostulacionFilterChange = (e) => {
        setFilterPostulacion(e.target.value);
    };

    const handleCancelarPostulacionClick = async () => {
        const { ID_postulacion } = selectedRow;
        try {
            const result = await deleteDataAlert();

            if (result.isConfirmed) {
                const response = await cancelarPostulacion(ID_postulacion);

                if (response.status === 200) {
                    fetchPostulaciones();
                } else {
                    showErrorAlert('Error', response.details.message);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handlePostulacionAction(estado) {
        const { ID_postulacion, rut } = selectedRow;
        const data = { ID_postulacion, rut, estado };

        if (estado === 'Rechazado') {
            const result = await showWarningAlert('Precaución', '¿Estás seguro de rechazar esta postulación?');
            if (result.isConfirmed) {
                try {
                    const response = await updatePostulacion(data);
                    if (response.status === 200) {
                        showSuccessAlert('Alumno aceptado exitosamente');
                        fetchPostulaciones();
                    } else {
                        showErrorAlert('Error', response.details.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            try {
                const response = await updatePostulacion(data);
                if (response.status === 200) {
                    showSuccessAlert('Alumno aceptado exitosamente');
                    fetchPostulaciones();
                } else {
                    showErrorAlert('Error', response.details.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleAccept = () => handlePostulacionAction("Aceptado");
    const handleReject = () => handlePostulacionAction("Rechazado");

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">
                        {userRole === 'alumno' ? "Mis postulaciones" : "Revisar postulaciones"}
                    </h1>
                    <div className="filter-actions">
                        <Search value={filterPostulacion} onChange={handlePostulacionFilterChange} placeholder={'Buscar'} />
                        {userRole === 'alumno' ? (
                            <button className="postulacion-cancelar-button practica-button" onClick={handleCancelarPostulacionClick} disabled={selectedRow === null}>
                                Cancelar postulación
                            </button>
                        ) : (
                            <>
                                <button className="practica-button" onClick={handleAccept} disabled={selectedRow === null}>
                                    Aceptar
                                </button>
                                <button className="practica-button" onClick={handleReject} disabled={selectedRow === null}>
                                    Rechazar
                                </button>
                            </>
                        )}

                    </div>
                </div>
                <TablaAlumnos
                    data={postulaciones}
                    columns={columns}
                    onRowSelect={(row) => { setSelectedRow(row); }}
                />
            </div>
        </div>
    );

}