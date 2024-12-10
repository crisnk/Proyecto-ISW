import "../styles/practica.css";
import Table from '@components/Table';
import Search from '../components/Search';
import PopupPractica from '../components/PopupPractica';
import PopupCreatePractica from '../components/PopupCreatePractica';
import { useCallback, useState, useEffect } from 'react';
import useEditPractica from "@hooks/practica/useEditPractica";
import usePractica from "@hooks/practica/useGetPracticas.jsx";
import useCreatePractica from "@hooks/practica/useCreatePractica";
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';

export default function Practica() {
    const { practicas, fetchPracticas, setPracticas } = usePractica();
    const [filterPractica, setFilterPractica] = useState('');
    const [userRole, setUserRole] = useState(null);

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPractica,
        setDataPractica
    } = useEditPractica(setPracticas);

    const { handleCreate } = useCreatePractica(setPracticas);
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
        const role = user.rol;
        setUserRole(role);
    }, []);

    const isAllowed = userRole === 'EDP' || userRole === 'administrador';
    const searchStyle = userRole && !['EDP', 'administrador'].includes(userRole) ? { marginRight: '70px' } : {};

    const columns = [
        { title: "Nombre", field: "nombre", width: 450, responsive: 0 },
        { title: "Descripción", field: "descripcion", width: 300, responsive: 3 },
        { title: "Especialidad", field: "nombreEspecialidad", width: 200, responsive: 2 },
        { title: "Dirección", field: "direccion", width: 200, responsive: 2 },
        { title: "Publicado hace", field: "fechaPublicacion", width: 150, responsive: 2 },
        { title: "Cupo", field: "cupo", width: 80, responsive: 2 },
        { title: "Estado", field: "estado", width: 100, responsive: 2 },
    ];

    const handlePracticaFilterChange = (e) => {
        setFilterPractica(e.target.value);
    };

    const handleSelectionChange = useCallback((selectedPracticas) => {
        setDataPractica(selectedPracticas);
    }, [setDataPractica]);

    const handleCreateClick = () => {
        setIsCreatePopupOpen(true);
    };

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Prácticas</h1>
                    <div className="filter-actions">
                        <Search value={filterPractica} onChange={handlePracticaFilterChange} placeholder={'Buscar'} style={searchStyle} />
                        {isAllowed && (
                            <>
                                <button className="practica-edit-button" onClick={handleClickUpdate} disabled={dataPractica.length === 0}>
                                    {dataPractica.length === 0 ? (
                                        <img src={UpdateIconDisable} alt="edit-disabled" />
                                    ) : (
                                        <img src={UpdateIcon} alt="edit" />
                                    )}
                                </button>
                                <button className="practica-register-button" onClick={handleCreateClick}>
                                    Registrar nueva práctica
                                </button>
                            </>
                        )}

                    </div>
                </div>
                <Table
                    data={practicas}
                    columns={columns}
                    filter={filterPractica}
                    initialSortName={'fechaPublicacion'}
                    onSelectionChange={handleSelectionChange}
                />
            </div>

            <PopupPractica show={isPopupOpen} setShow={setIsPopupOpen} data={dataPractica} action={handleUpdate} />
            <PopupCreatePractica show={isCreatePopupOpen} setShow={setIsCreatePopupOpen} action={handleCreate} />
        </div>
    );
}
