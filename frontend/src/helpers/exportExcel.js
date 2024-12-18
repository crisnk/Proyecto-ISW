import ExcelJS from "exceljs";

export const exportarExcel = (periodo, atrasos, nombreCurso) => {
    const hoy = new Date();
    const fechaInicio =
        periodo === "semanal"
            ? new Date(hoy.setDate(hoy.getDate() - 7))
            : new Date(hoy.setMonth(hoy.getMonth() - 1));

    const atrasosFiltrados = atrasos.filter(
        (atraso) => new Date(atraso.fecha) >= fechaInicio
    );

    if (atrasosFiltrados.length === 0) {
        alert("No hay datos suficientes para exportar el informe.");
        return;
    }

    // Calcular estadísticas generales y resumen por alumno
    const estadisticas = calcularEstadisticasGenerales(atrasosFiltrados);
    const resumenAlumnos = calcularResumenPorAlumno(atrasosFiltrados);

    // Generar y descargar el archivo Excel
    generarExcel(estadisticas, resumenAlumnos, periodo, nombreCurso);
};

const calcularEstadisticasGenerales = (data) => {
    const totalAtrasos = data.length;

    const horas = data.map((atraso) => parseInt(atraso.hora.split(":")[0], 10));
    const horaPromedio = Math.round(horas.reduce((a, b) => a + b, 0) / horas.length);

    // Análisis de días
    const diasFrecuentes = data.reduce((acc, { fecha }) => {
        const dia = new Date(fecha).toLocaleDateString("es-ES", { weekday: "long" });
        acc[dia] = (acc[dia] || 0) + 1;
        return acc;
    }, {});

    const diasOrdenados = Object.entries(diasFrecuentes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);  // Top 5 días

    // Análisis de horas
    const horasFrecuentes = data.reduce((acc, { hora }) => {
        acc[hora] = (acc[hora] || 0) + 1;
        return acc;
    }, {});

    const horasOrdenadas = Object.entries(horasFrecuentes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);  // Top 5 horas

    const diaMasFrecuente = diasOrdenados[0] ? diasOrdenados[0][0] : "No determinado";
    const horaCritica = horasOrdenadas[0] ? horasOrdenadas[0][0] : "No determinada";

    return {
        totalAtrasos,
        horaPromedio,
        diaMasFrecuente,
        horaCritica,
        diasFrecuentes: Object.fromEntries(diasOrdenados),
        horasFrecuentes: Object.fromEntries(horasOrdenadas),
        alumnosUnicos: new Set(data.map((atraso) => atraso.rut)).size,
    };
};

const calcularResumenPorAlumno = (data) => {
    const alumnos = data.reduce((acc, { rut, nombre, hora, fecha }) => {
        if (!acc[rut]) acc[rut] = {
            nombre,
            rut,
            totalAtrasos: 0,
            dias: {},
            horas: {}
        };
        acc[rut].totalAtrasos += 1;

        const dia = new Date(fecha).toLocaleDateString("es-ES", { weekday: "long" });
        acc[rut].dias[dia] = (acc[rut].dias[dia] || 0) + 1;
        acc[rut].horas[hora] = (acc[rut].horas[hora] || 0) + 1;

        return acc;
    }, {});

    return Object.values(alumnos).map((alumno) => ({
        nombre: alumno.nombre,
        rut: alumno.rut,
        totalAtrasos: alumno.totalAtrasos,
        diaMasFrecuente: Object.keys(alumno.dias).reduce((a, b) =>
            alumno.dias[a] > alumno.dias[b] ? a : b
        ),
        horaCritica: Object.keys(alumno.horas).reduce((a, b) =>
            alumno.horas[a] > alumno.horas[b] ? a : b
        ),
    }));
};

const generarExcel = async (estadisticas, resumenAlumnos, periodo, nombreCurso) => {
    const workbook = new ExcelJS.Workbook();

    // Hoja 1: General
    const wsGeneral = workbook.addWorksheet("Estadísticas Generales");
    wsGeneral.columns = [
        { header: "Estadística", key: "estadistica", width: 30 },
        { header: "Valor", key: "valor", width: 20 },
    ];

    wsGeneral.addRows([
        { estadistica: "Total de Atrasos", valor: estadisticas.totalAtrasos },
        { estadistica: "Hora Promedio de Atraso", valor: `${estadisticas.horaPromedio}:00` },
        { estadistica: "Día Más Frecuente", valor: estadisticas.diaMasFrecuente },
        { estadistica: "Hora Crítica", valor: estadisticas.horaCritica },
        { estadistica: "Número de Alumnos con Atrasos", valor: estadisticas.alumnosUnicos },
    ]);

    // Tabla de días frecuentes
    wsGeneral.addRow([]);
    wsGeneral.addRow(["Días con Más Atrasos", "Cantidad"]);
    Object.entries(estadisticas.diasFrecuentes).forEach(([dia, cantidad]) => {
        wsGeneral.addRow([dia, cantidad]);
    });

    // Tabla de horas frecuentes
    wsGeneral.addRow([]);
    wsGeneral.addRow(["Horas con Más Atrasos", "Cantidad"]);
    Object.entries(estadisticas.horasFrecuentes).forEach(([hora, cantidad]) => {
        wsGeneral.addRow([hora, cantidad]);
    });

    // Hoja 2: Resumen por Alumno
    const wsAlumnos = workbook.addWorksheet("Resumen por Alumno");
    wsAlumnos.columns = [
        { header: "Nombre", key: "nombre", width: 30 },
        { header: "RUT", key: "rut", width: 20 },
        { header: "Total de Atrasos", key: "totalAtrasos", width: 20 },
        { header: "Día Más Frecuente", key: "diaMasFrecuente", width: 25 },
        { header: "Hora Crítica", key: "horaCritica", width: 20 },
    ];

    wsAlumnos.addRows(resumenAlumnos);

    // Nombre de archivo dinámico
    const fechaActual = new Date().toISOString().split("T")[0];
    const nombreArchivo = `Atrasos_${nombreCurso}_${periodo}_${fechaActual}.xlsx`;

    // Descargar Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
};
