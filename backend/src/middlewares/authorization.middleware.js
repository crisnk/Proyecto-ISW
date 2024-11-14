"use strict";
import {
    handleErrorClient,
    handleErrorServer,
} from "../handlers/responseHandlers.js";

export const isAuthorized = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const { rol } = req.user;
            
            if (!allowedRoles.includes(rol)) {
                return handleErrorClient(
                    res,
                    403,
                    "Error al acceder al recurso",
                    `Se requiere uno de los siguientes roles: ${allowedRoles.join(", ")} para realizar esta acción.`
                );
            }

            next();
        } catch (error) {
            handleErrorServer(res, 500, error.message);
        }
    };
};

export default isAuthorized;