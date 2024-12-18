export const motivoValidation = {
    required: true,
    minLength: 10,
    maxLength: 200,
    pattern: /^(?:[A-Za-zÀ-ÖØ-öø-ÿ]+|\d+)(?:\s(?:[A-Za-zÀ-ÖØ-öø-ÿ]+|\d+))*$/,
    errorMessage: {
        required: "El motivo es obligatorio.",
        minLength: "El motivo debe tener al menos 10 caracteres.",
        maxLength: "El motivo debe tener como máximo 200 caracteres.",
        pattern: "El motivo solo puede contener letras o números separados por espacios.",
    }
};
