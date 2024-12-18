import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

let socket;

const SOCKET_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

export const initSocket = () => {
    const token = Cookies.get('jwt-auth');
    if (!socket || socket.disconnected) {
        socket = io(`${SOCKET_URL}`, {
            transports: ['websocket'],
            auth: {
                token: token, 
            },
        });

        socket.on('connect', () => {
            if (socket.recovered) {
                console.log('Socket Recuperado');
            } else {
                console.log('Sesión nueva o no recuperada');
            }
        });

        socket.on('connect_error', (error) => {
            if (socket.connected) {
                console.log("Socket activo y conectado");
            } else {
                console.log("Error al reconectarse:", error.message);
            }
        });        

        socket.on('disconnect', () => {
            console.log('Desconectado de Socket.IO');
        });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('Socket desconectado');
    }
};