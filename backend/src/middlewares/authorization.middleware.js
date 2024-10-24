import { handleErrorClient } from "../handlers/responseHandlers.js";

export function isRole(role) {
  return (req, res, next) => {
    // Verificamos si el usuario tiene el rol necesario
    if (req.user.rol === role) {
      // Si el rol coincide, continua al siguiente middleware
      next();
    } else {
      // Si no tiene el rol adecuado, enviamos un error 403 (Prohibido)
      return handleErrorClient(
        res,
        403,
        "Error al acceder al recurso",
        "El usuario no tiene el rol necesario para realizar esta acción."
      );
    }
  };
}
