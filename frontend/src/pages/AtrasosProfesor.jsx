import { useState, useEffect } from 'react';
import '@styles/atrasos.css';
import '@styles/modal.css';
import '@styles/styles.css';
import { getAtrasosAlumnos } from '@services/atrasos.service.js';
import { verJustificativo, aprobarJustificativo, rechazarJustificativo } from '@services/justificativos.service.js';
import TablaAlumnos from '../components/TablaAlumnos';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert';
import Swal from "sweetalert2";
import { motivoValidation } from '@helpers/validations';
import { exportarExcel } from '@helpers/exportExcel';


const AtrasosAlumnos = () => {
    const [atrasos, setAtrasos] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [justificativoData, setJustificativoData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [filterEstado, setFilterEstado] = useState('');
    const [filterFechaInicio, setFilterFechaInicio] = useState('');
    const [filterFechaFin, setFilterFechaFin] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const handleClickOutside = (event) => {
            const tableElement = document.querySelector('.tablaAlumnos-table');
            if (tableElement && !tableElement.contains(event.target)) {
                setSelectedRow(null); // Desmarca la fila seleccionada
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
            const cumpleFecha = (filterFechaInicio && filterFechaFin)
                ? new Date(atraso.fecha) >= new Date(filterFechaInicio) &&
                new Date(atraso.fecha) <= new Date(filterFechaFin)
                : true;
            const cumpleEstado = filterEstado ? atraso.estadoJustificativo === filterEstado : true;
            const cumpleBusqueda = searchQuery
                ? (atraso.nombre.toLowerCase().includes(searchQuery) || atraso.rut.toLowerCase().includes(searchQuery))
                : true;
            return cumpleFecha && cumpleEstado && cumpleBusqueda;
        });
    };

    const handleExportarExcel = (periodo) => {
        if (!periodo) return; // Validar que se seleccionó un período
        exportarExcel(periodo, atrasos, "1ro Medio A"); // Llama a la función exportarExcel con los datos necesarios
    };

    const handleJustificar = async () => {
        if (!selectedRow) {
            console.log('No hay fila seleccionada');
            return;
        }
        try {
            const data = await verJustificativo(selectedRow.ID_atraso);
            if (!data || !data.data) {
                showErrorAlert("Error", "No se encontró un justificativo para este atraso.");
                return;
            }
            const { motivo, documento, estado } = data.data;
            await Swal.fire({
                title: 'Revisar Justificativo',
                html: `
                    <p><strong>Motivo:</strong> ${motivo || "No especificado"}</p>
                    <p><strong>Documento:</strong> ${documento
                        ? `<a href="${documento}" target="_blank" rel="noopener noreferrer">Ver documento</a>`
                        : "No disponible"
                    }</p>
                    <p><strong>Estado:</strong> ${estado || "No especificado"}</p>
                `,
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cerrar',
                denyButtonText: 'Rechazar',
                showDenyButton: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-secondary',
                    denyButton: 'btn btn-danger',
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Justificativo aceptado");
                    handleAprobar();
                } else if (result.isDenied) {
                    console.log("Justificativo rechazado");
                    handleRechazar();
                }
            });
        } catch (error) {
            console.error('Error al obtener el justificativo:', error);
            showErrorAlert("Error", "Hubo un problema al intentar obtener el justificativo.");
        }
    };
    const handleAprobar = async () => {
        if (!selectedRow) {
            showErrorAlert("Error", "Debe seleccionar una fila antes de aprobar un justificativo.");
            return;
        }
        const confirmResult = await Swal.fire({
            title: "Confirmar Aprobación",
            text: "¿Está seguro de aprobar este justificativo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, aprobar",
            cancelButtonText: "Cancelar",
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary',
            },
        });
        if (!confirmResult.isConfirmed) return;

        try {
            const email = atrasos.find((atraso) => atraso.ID_atraso === selectedRow.ID_atraso)?.email || null;
            if (!email) {
                showErrorAlert("Error", "No se pudo obtener el email del alumno. Por favor, inténtelo de nuevo.");
                return;
            }
            const response = await aprobarJustificativo(selectedRow.ID_atraso, { email: email });
            if (response.status === 'Success') {
                showSuccessAlert('Justificativo aprobado con éxito.');
                setAtrasos(atrasos.filter(atraso => atraso.ID_atraso !== selectedRow.ID_atraso)); // Actualizar lista
                setJustificativoData(null);
                setSelectedRow(null);
                setModalOpen(false);
            } else {
                showErrorAlert("Error", response.message || "No se pudo aprobar el justificativo.");
            }
        } catch (error) {
            console.error("Error al aprobar el justificativo:", error);
            showErrorAlert("Error", "Ocurrió un problema al intentar aprobar el justificativo.");
        }
    };

    const validateMotivo = (motivo) => {
        const { required, minLength, maxLength, pattern, errorMessage } = motivoValidation;

        if (required && !motivo) return errorMessage.required;
        if (motivo.length < minLength) return errorMessage.minLength;
        if (motivo.length > maxLength) return errorMessage.maxLength;
        if (!pattern.test(motivo)) return errorMessage.pattern;

        return null;
    };


    const handleRechazar = async () => {
        try {
            const { value: motivo } = await Swal.fire({
                title: "Motivo de rechazo",
                input: "textarea",
                inputPlaceholder: "Ingrese el motivo del rechazo aquí...",
                inputAttributes: {
                    "aria-label": "Motivo de rechazo"
                },
                showCancelButton: true,
                confirmButtonText: "Enviar",
                cancelButtonText: "Cancelar",
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-secondary',
                },
            });

            if (!motivo) {
                showErrorAlert("Cancelado", "Debe ingresar un motivo para rechazar el justificativo.");
                return;
            }

            const validationError = validateMotivo(motivo);
            if (validationError) {
                showErrorAlert("Error", validationError);
                return;
            }

            const confirmResult = await Swal.fire({
                title: "Confirmar Rechazo",
                text: "¿Está seguro de rechazar este justificativo?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, rechazar",
                cancelButtonText: "Cancelar",
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary',
                },
            });

            if (!confirmResult.isConfirmed) return;

            const email = atrasos.find((atraso) => atraso.ID_atraso === selectedRow.ID_atraso)?.email || null;
            if (!email) {
                showErrorAlert("Error", "No se pudo obtener el email del alumno. Por favor, intenta de nuevo.");
                return;
            }

            const response = await rechazarJustificativo(selectedRow.ID_atraso, {
                email: email,
                motivo: motivo,
            });

            if (response.status === "Success") {
                Swal.fire("Éxito", "Justificativo rechazado con éxito.", "success");
                setAtrasos(atrasos.filter(atraso => atraso.ID_atraso !== selectedRow.ID_atraso));
                setSelectedRow(null);
                setModalOpen(false);
            } else {
                showErrorAlert("Error", response.message || "Error en la respuesta del servidor.");
            }
        } catch (error) {
            showErrorAlert("Error", error.message || "Error al rechazar el justificativo.");
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
        <div className='profesor-funciones'>
            <div className="main-container">
                <div className="top-table">
                    <h1 className="title-table-curso">
                        Atrasos del curso {atrasos.length > 0 ? atrasos[0].curso : 'Curso no disponible'}
                    </h1>
                </div>
                <div className="filters">
                    <label>
                        Exportar Excel:
                        <select
                            onChange={(e) => handleExportarExcel(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Seleccione
                            </option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                        </select>
                    </label>
                    <label>
                        Fecha desde:
                        <input
                            type="date"
                            value={filterFechaInicio}
                            onChange={(e) => setFilterFechaInicio(e.target.value)}
                        />
                    </label>
                    <label>
                        Fecha hasta:
                        <input
                            type="date"
                            value={filterFechaFin}
                            onChange={(e) => setFilterFechaFin(e.target.value)}
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
                    <label>
                        Buscar:
                        <input
                            type="text"
                            placeholder="Nombre o RUT"
                            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        />
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
                    data={filtrarAtrasos()}
                    columns={columns}
                    onRowSelect={(row) => { setSelectedRow(row); }}
                />
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Revisar Justificativo</h2>
                            {justificativoData && justificativoData.data ? (
                                <>
                                    <p>
                                        <strong>Motivo:</strong> {justificativoData.data.motivo}
                                    </p>
                                    <p>
                                        <strong>Documento:</strong>{' '}
                                        {justificativoData.data.documento ? (
                                            <a
                                                href={justificativoData.data.documento}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Ver documento
                                            </a>
                                        ) : (
                                            "No disponible"
                                        )}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong> {justificativoData.data.estado || "No especificado"}
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
        </div>
    );
};
export default AtrasosAlumnos;