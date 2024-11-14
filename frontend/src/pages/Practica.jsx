import "../styles/practica.css";
import usePractica from "@hooks/practica/useGetPracticas.jsx";

export default function Practica() {
    const practicas = usePractica();
    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Practicas</h1>
                    <div className="filter-actions">
    
                    </div>
                </div>
            </div>
        </div>
    );
}