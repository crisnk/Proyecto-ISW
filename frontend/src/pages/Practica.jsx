import "../styles/practica.css";
import Table from '@components/Table';
import usePractica from "@hooks/practica/useGetPracticas.jsx";

export default function Practica() {
    const { practicas, fetchPracticas, setPracticas } = usePractica();

    const columns = [
        { title: "Nombre", field: "nombre", width: 350, responsive: 0 },
        { title: "Descripción", field: "descripcion", width: 300, responsive: 3 },
        { title: "Dirección", field: "direccion", width: 150, responsive: 2 },
        { title: "Publicado el:", field: "fechaPubilacion", width: 200, responsive: 2 },
        { title: "Cupo:", field: "cupo", width: 200, responsive: 2 }
    ];

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Practicas</h1>
                    <div className="filter-actions">
                    </div>
                </div>
                <Table
                    data={practicas}
                    columns={columns}

                />
            </div>
        </div>
    );
}