import "../styles/practica.css";
import Search from '../components/Search';
import PopupPractica from '../components/PopupPractica';
import PopupCreatePractica from '../components/PopupCreatePractica';
import { useState, useEffect } from 'react';
import useEditPractica from "@hooks/practica/useEditPractica";
import useGetPracticas from "@hooks/practica/useGetPracticas.jsx";
import useCreatePractica from "@hooks/practica/useCreatePractica";
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import { postularPractica } from '../services/practica.service.js';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import TablaAlumnos from "../components/TablaAlumnos.jsx";
import getColumns from "../helpers/columnHelper";

export default function Practica() {
    const { practicas, fetchPracticas, setPracticas } = useGetPracticas();
    const [filterPractica, setFilterPractica] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [columns, setColumns] = useState([]);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPractica,
        setDataPractica
    } = useEditPractica(useGetPracticas);

    const { handleCreate } = useCreatePractica(setPracticas, fetchPracticas);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const role = user.rol;
        setUserRole(role);
        setColumns(getColumns(role, 'Practica'));
    }, []);

    const canEditPracticas = userRole === 'EDP' || userRole === 'administrador';
    const isAlumno = userRole === 'alumno';

    const handlePracticaFilterChange = (e) => {
        setFilterPractica(e.target.value);
    };

    const handleCreateClick = () => {
        setIsCreatePopupOpen(true);
    };

    const handlePostularClick = async () => {
        const ID_practica = selectedRow.ID;
        try {
            const response = await postularPractica(ID_practica);
            if (response.status === 201) {
                fetchPracticas();
                showSuccessAlert('Postulación enviada')
            } else {
                showErrorAlert('Error', response.message)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="main-container">
            <div className="practica-table-container">
                <div className="practica-top-table">
                    <div className="practica-title-container">
                        <h1 className="practica-title-table">Prácticas</h1>
                    </div>
                    <div className="practica-filter-actions">
                        <Search value={filterPractica} onChange={handlePracticaFilterChange} placeholder={'Buscar'} />
                        {canEditPracticas && (
                            <>
                                <button className="edit-button" onClick={handleClickUpdate} disabled={selectedRow === null}>
                                    {selectedRow === null ? (
                                        <img src={UpdateIconDisable} alt="edit-disabled" />
                                    ) : (
                                        <img src={UpdateIcon} alt="edit" />
                                    )}
                                </button>
                                <button className="practica-button button-margin-right" onClick={handleCreateClick}>
                                    Registrar nueva práctica
                                </button>
                            </>
                        )}
                        {isAlumno && (
                            <>
                                <button className="practica-button " onClick={handlePostularClick}>
                                    Postular a práctica
                                </button>
                            </>
                        )}

                    </div>
                </div>
                <TablaAlumnos
                    data={practicas}
                    columns={columns}
                    onRowSelect={(row) => { setSelectedRow(row); }}
                />
            </div>

            <PopupPractica show={isPopupOpen} setShow={setIsPopupOpen} data={dataPractica} action={handleUpdate} />
            <PopupCreatePractica show={isCreatePopupOpen} setShow={setIsCreatePopupOpen} action={handleCreate} />
        </div>
    );
}
