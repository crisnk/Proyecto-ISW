"use strict";

const connectedUsers = {}; 

export const addUser = (rut, socketId) => {
  connectedUsers[rut] = socketId;
  console.log(`RUT ${rut} está asociado con el socket ID: ${socketId}`);
};

export const removeUser = (socketId) => {
  for (const rut in connectedUsers) {
    if (connectedUsers[rut] === socketId) {
      delete connectedUsers[rut];
      console.log(`Desconectado y removido: RUT ${rut}`);
      break;
    }
  }
};

export const getUserSocketId = (rut) => connectedUsers[rut];

export { connectedUsers };