import "../styles/practica.css";
import Table from '@components/Table';
import Search from '../components/Search';
import PopupPractica from '../components/PopupPractica';
import { useCallback, useState } from 'react';
import useEditPractica from "@hooks/practica/useEditPractica";
import usePractica from "@hooks/practica/useGetPracticas.jsx";
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import '@styles/users.css';

export default function Practica() {
    const { practicas, fetchPracticas, setPracticas } = usePractica();
    const [filterPractica, setFilterPractica] = useState('');

    const {
        handleClickUpdate,
        handleUpdate,
        isPopupOpen,
        setIsPopupOpen,
        dataPractica,
        setDataPractica
    } = useEditPractica(setPracticas);

    const columns = [
        { title: "Nombre", field: "nombre", width: 350, responsive: 0 },
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

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Practicas</h1>
                    <div className="filter-actions">
                        <Search value={filterPractica} onChange={handlePracticaFilterChange} placeholder={'Filtrar por nombre'}/>
                        <button onClick={handleClickUpdate} disabled={dataPractica.length === 0}>
                            {dataPractica.length === 0 ? (
                                <img src={UpdateIconDisable} alt="edit-disabled" />
                            ) : (
                                <img src={UpdateIcon} alt="edit" />
                            )}
                        </button>
                    </div>
                </div>
                <Table
                    data={practicas}
                    columns={columns}
                    filter={filterPractica}
                    dataToFilter={'nombre'}
                    initialSortName={'fechaPublicacion'}
                    onSelectionChange={handleSelectionChange}
                />
            </div>
            <PopupPractica show={isPopupOpen} setShow={setIsPopupOpen} data={dataPractica} action={handleUpdate} />
        </div>
    );
}