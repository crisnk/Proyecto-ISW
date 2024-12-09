import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";

export async function extraerRut(req){
    const token = req.cookies.jwt;
  
    if (!token) {
      return handleErrorClient(res, 401, "No se ha proporcionado un token de autenticación");
    }
  
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
  
    const { rut } = decoded;
    if (!rut) {
      return handleErrorClient(res, 401, "Token inválido o RUN no presente en el token");
    }   
    return rut;
  }