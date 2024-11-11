import axios from './root.service.js';
import { formatUserData } from '@helpers/formatData.js';

export async function getUsers() {
    try {
        const { data } = await axios.get('/user/getusers');
        const formattedData = data.data.map(formatUserData);
        return formattedData;
    } catch (error) {
        return error.response.data;
    }
}
export async function getUser(rut) {
    try {
        const response = await axios.get(`/user/getuser/?rut=${rut}`);
        return response.data.data;
    } catch (error) {
        return error.response ? error.response.data : error.message;
    }
}

export async function updateUser(data, rut) {
    try {
        const response = await axios.patch(`/user/update/?rut=${rut}`, data);
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}

export async function deleteUser(rut) {
    try {
        const response = await axios.delete(`/user/delete/?rut=${rut}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
}