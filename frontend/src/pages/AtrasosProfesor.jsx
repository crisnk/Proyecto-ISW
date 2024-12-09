import { useState, useEffect } from 'react';
import '@styles/atrasos.css';
import '@styles/modal.css';
import { getAtrasosAlumnos } from '@services/atrasos.service.js';
import { verJustificativo, aprobarJustificativo, rechazarJustificativo } from '@services/justificativos.service.js';
import TablaAlumnos from '../components/TablaAlumnos';

const AtrasosAlumnos = () => {
    const [atrasos, setAtrasos] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [justificativoData, setJustificativoData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [filterFecha, setFilterFecha] = useState(''); // Filtro por fecha
    const [filterEstado, setFilterEstado] = useState(''); // Filtro por estado

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAtrasosAlumnos();
                if (response.status === 'Success' && Array.isArray(response.data)) {
                    setAtrasos(response.data);
                } else {
                    setAtrasos([]);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const filtrarAtrasos = () => {
        return atrasos.filter((atraso) => {
            const cumpleFecha = filterFecha ? atraso.fecha === filterFecha : true;
            const cumpleEstado = filterEstado ? atraso.estadoJustificativo === filterEstado : true;
            return cumpleFecha && cumpleEstado;
        });
    };

    const handleJustificar = async () => {
        if (!selectedRow) {
            console.log('No hay fila seleccionada');
            return;
        }
    
        try {
            const data = await verJustificativo(selectedRow.ID_atraso);
            setJustificativoData(data);
            setModalOpen(true); 
        } catch (error) {
            console.error('Error al obtener el justificativo:', error);
        }
    };

    const handleAprobar = async () => {
        if (!selectedRow) return;
    
        try {
            const email = atrasos.find((atraso) => atraso.ID_atraso === selectedRow.ID_atraso)?.email || null;
            console.log(email);
            const response = await aprobarJustificativo(selectedRow.ID_atraso, {
                email: email, 
            });
    
            if (response.status === 'Success') {
                alert('Justificativo aprobado con éxito.');
                setJustificativoData(null);
                setModalOpen(false);
            } else {
                console.error('Error en la respuesta del servidor:', response);
            }
        } catch (error) {
            console.error('Error al aprobar el justificativo:', error);
        }
    };

    const handleRechazar = async () => {
        if (!selectedRow) return;
    
        try {
            const motivo = prompt("Ingrese el motivo del rechazo:");
            if (!motivo) {
                alert("Debe ingresar un motivo para rechazar el justificativo.");
                return;
            }
    
            const email = atrasos.find((atraso) => atraso.ID_atraso === selectedRow.ID_atraso)?.email || null;
    
            if (!email) {
                console.error("El email del alumno no fue encontrado en los datos originales.");
                alert("No se pudo obtener el email del alumno. Por favor, intenta de nuevo.");
                return;
            }
    
            const response = await rechazarJustificativo(selectedRow.ID_atraso, {
                email: email,
                motivo: motivo,
            });
    
            if (response.status === 'Success') {
                alert('Justificativo rechazado con éxito.');
                setJustificativoData(null);
                setModalOpen(false); 
            } else {
                console.error('Error en la respuesta del servidor:', response);
            }
        } catch (error) {
            console.error('Error al rechazar el justificativo:', error);
        }
    };

    const columns = [
        { title: 'Nombre', field: 'nombre' },
        { title: 'RUT', field: 'rut' },
        { title: 'Fecha', field: 'fecha' },
        { title: 'Hora', field: 'hora' },
        { title: 'Estado', field: 'estado' },
        { title: 'Justificativo', field: 'estadoJustificativo' },
    ];

    return (
        <div className="main-container">
            <div className="top-table">
                <h1 className="title-table-curso">
                    Atrasos del curso {atrasos.length > 0 ? atrasos[0].curso : 'Curso no disponible'}
                </h1>
            </div>

            <div className="filters">
                <label>
                    Fecha:
                    <input
                        type="date"
                        value={filterFecha}
                        onChange={(e) => setFilterFecha(e.target.value)}
                    />
                </label>
                <label>
                    Estado:
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="rechazado">Rechazado</option>
                        <option value="No Justificado">No Justificado</option>
                    </select>
                </label>
                <button
                    className="revisar-button2"
                    onClick={handleJustificar}
                    disabled={!selectedRow}
                >
                    Revisar
                </button>
            </div>

            <TablaAlumnos
                data={filtrarAtrasos()} // Aplicar filtros a los datos
                columns={columns}
                onRowSelect={(row) => { setSelectedRow(row); }}
            />

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Revisar Justificativo</h2>
                        {justificativoData ? (
                            <>
                                <p>
                                    <strong>Motivo:</strong> {justificativoData.data.motivo}
                                </p>
                                <p>
                                    <strong>Documento:</strong>{' '}
                                    <a
                                        href={justificativoData.data.documento}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver documento
                                    </a>
                                </p>
                                <p>
                                    <strong>Estado:</strong> {justificativoData.data.estado}
                                </p>
                            </>
                        ) : (
                            <p>Cargando información del justificativo...</p>
                        )}
                        <div className="modal-actions">
                            <button className="aceptar-button" onClick={handleAprobar}>
                                Aceptar
                            </button>
                            <button className="rechazar-button" onClick={handleRechazar}>
                                Rechazar
                            </button>
                            <button className="cerrar-button" onClick={() => setModalOpen(false)}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AtrasosAlumnos;
