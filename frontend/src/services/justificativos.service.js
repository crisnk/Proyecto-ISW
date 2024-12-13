import axios from './root.service.js';

export async function aprobarJustificativo(ID_atraso, body) {
    try {
        const { data } = await axios.post(`/justificativo/aprobar/${ID_atraso}`, body);
        return data;
    } catch (error) {
        return error.response.data;
    }
}
export async function rechazarJustificativo(ID_atraso, body) {
    try {
        const { data } = await axios.post(`/justificativo/rechazar/${ID_atraso}`, body);
        return data;
    } catch (error) {
        return error.response.data;
    }
}
export async function verJustificativo(ID_atraso) {
    try {
        const { data } = await axios.get(`/justificativo/ver/${ID_atraso}`);
        return data;
    } catch (error) {
        console.error("Error al obtener el justificativo:", error);
        return error.response.data;
    }
}


export async function justificarAtraso(formData) { 
    try { 
      const response = await axios.post('/justificativo/generar', formData, { 
        headers: { 
          'Content-Type': 'multipart/form-data', 
        }, 
      }); 
      return response; 
    } catch (error) { 
      console.error('Error al enviar justificativo:', error); 
      return error.response?.data || 'Error desconocido'; 
    } 
  }