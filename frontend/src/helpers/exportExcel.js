import ExcelJS from "exceljs";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es"
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("es");
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

    // Cálculo de la hora promedio
    const horas = data.map((atraso) => parseInt(atraso.hora.split(":")[0], 10));
    const horaPromedio = Math.round(horas.reduce((a, b) => a + b, 0) / horas.length);

    // Análisis de días usando dayjs y filtrando días vacíos
    const diasFrecuentes = data.reduce((acc, { fecha }) => {
        const dia = dayjs(fecha, "DD-MM-YYYY").tz("America/Santiago").locale("es").format("dddd");
        acc[dia] = (acc[dia] || 0) + 1;
        return acc;
    }, {});

    const diasOrdenados = Object.entries(diasFrecuentes)
        .filter(([_, valor]) => valor > 0) // Filtra días con valor > 0
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 días

    const diaMasFrecuente = diasOrdenados[0] ? diasOrdenados[0][0] : "No determinado";

    // Análisis de horas críticas
    const horasFrecuentes = data.reduce((acc, { hora }) => {
        acc[hora] = (acc[hora] || 0) + 1; // Incrementar la frecuencia de cada hora
        return acc;
    }, {});

    const horasOrdenadas = Object.entries(horasFrecuentes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5 horas críticas

    const horaCritica = horasOrdenadas[0] ? horasOrdenadas[0][0] : "No determinada";

    return {
        totalAtrasos,
        horaPromedio,
        diaMasFrecuente,
        diasFrecuentes: Object.fromEntries(diasOrdenados),
        horasFrecuentes: Object.fromEntries(horasOrdenadas), // Horas críticas
        horaCritica,
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

        // Obtener el día correctamente formateado en español y con la zona horaria
        const dia = dayjs(fecha, "DD-MM-YYYY").tz("America/Santiago").format("dddd");
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

const generarGraficoComoBase64 = (datos, etiquetas, titulo) => {
    // Filtrar valores y etiquetas con datos > 0
    const datosFiltrados = datos.filter(valor => valor > 0);
    const etiquetasFiltradas = etiquetas.filter((_, index) => datos[index] > 0);

    // Crear un canvas virtual
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");

    // Generar el gráfico circular (pie)
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: etiquetasFiltradas,
            datasets: [
                {
                    label: titulo,
                    data: datosFiltrados,
                    backgroundColor: ["#FF6384", "#FFCD56", "#36A2EB", "#4BC0C0", "#9966FF"],
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true, position: "bottom" },
                title: { display: true, text: titulo, font: { size: 16 } },
                datalabels: {
                    color: "#fff",
                    formatter: (value) => `${value}%`,
                    font: { weight: "bold", size: 14 },
                },
            },
        },
        plugins: [ChartDataLabels],
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            const base64 = canvas.toDataURL("image/png");
            resolve(base64);
        }, 500);
    });
};

const generarGraficoLineasComoBase64 = (datos, etiquetas, titulo) => {
    // Crear un canvas virtual
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");

    // Ordenar las etiquetas (horas) en orden ascendente
    const orden = etiquetas.map((hora, i) => ({ hora, valor: datos[i] }))
                           .sort((a, b) => a.hora.localeCompare(b.hora));

    const etiquetasOrdenadas = orden.map(item => item.hora);
    const datosOrdenados = orden.map(item => item.valor);

    // Generar el gráfico de líneas
    new Chart(ctx, {
        type: "line",
        data: {
            labels: etiquetasOrdenadas, // Horas ordenadas (X)
            datasets: [
                {
                    label: titulo,
                    data: datosOrdenados, // Frecuencia de atrasos (Y)
                    borderColor: "#FF6384",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: "#FF6384",
                },
            ],
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: titulo, font: { size: 16 } },
            },
            scales: {
                x: {
                    title: { display: true, text: "Horas Críticas" },
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Frecuencia" },
                    ticks: {
                        stepSize: 1, // Solo números enteros
                        precision: 0, // Evita decimales
                    },
                },
            },
        },
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            const base64 = canvas.toDataURL("image/png");
            resolve(base64);
        }, 500);
    });
};



const agregarImagenAlExcel = (workbook, worksheet, imageData, position) => {
    const imageId = workbook.addImage({
        base64: imageData,
        extension: "png",
    });
    worksheet.addImage(imageId, position); // Por ejemplo: "B10:F20"
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

    // Generar gráfico de días frecuentes
    const graficoBase64 = await generarGraficoComoBase64(
        Object.values(estadisticas.diasFrecuentes),
        Object.keys(estadisticas.diasFrecuentes),
        "Días con Más Atrasos"
    );
    const imagenLimpia = graficoBase64.replace(/^data:image\/\w+;base64,/, "");

    // Agregar el gráfico al Excel
    agregarImagenAlExcel(workbook, wsGeneral, imagenLimpia , "A10:F35");

   // Generar gráfico de horas críticas
const horasCriticasDatos = Object.values(estadisticas.horasFrecuentes);
const horasCriticasEtiquetas = Object.keys(estadisticas.horasFrecuentes);

if (horasCriticasDatos.length > 0) {
    const graficoLineasBase64 = await generarGraficoLineasComoBase64(
        horasCriticasDatos,
        horasCriticasEtiquetas,
        "Horas Críticas Más Frecuentes"
    );

    // Agregar el gráfico al Excel en otra posición
    agregarImagenAlExcel(workbook, wsGeneral, graficoLineasBase64, "H10:Q35");
}
 
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

    // Descargar Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Atrasos_${nombreCurso}_${periodo}_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
};

