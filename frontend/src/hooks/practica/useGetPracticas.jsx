import { useState, useEffect } from "react";
import { getPracticas } from "@services/practica.service.js";

export default async function usePractica() {
    const [practicas, setPracticas] = useState([]);
    
}