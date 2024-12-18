import moment from "moment-timezone";

export function getTimeAgo(date) {
    const now = moment(); // Fecha y hora actual
    const publishedDate = moment(date); // Fecha de publicación

    // Diferencias en tiempo:
    const secondsAgo = now.diff(publishedDate, 'seconds');
    const minutesAgo = now.diff(publishedDate, 'minutes');
    const hoursAgo = now.diff(publishedDate, 'hours');
    const daysAgo = now.diff(publishedDate, 'days');

    // Si fue publicado hace menos de 1 minuto
    if (secondsAgo < 60) {
        return `${secondsAgo} segundo${secondsAgo === 1 ? '' : 's'}`;
    }
    // Si fue publicado hace menos de 1 hora
    else if (minutesAgo < 60) {
        return `${minutesAgo} minuto${minutesAgo === 1 ? '' : 's'}`;
    }
    // Si fue publicado hace menos de 1 dia
    else if (hoursAgo < 24) {
        return `${hoursAgo} hora${hoursAgo === 1 ? '' : 's'}`;
    }
    // Si fue publicado hace más de 1 dia
    else {
        return `${daysAgo} día${daysAgo === 1 ? '' : 's'}`;
    }
}