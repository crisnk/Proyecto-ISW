import Swal from 'sweetalert2';

export async function deleteDataAlert() {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  })
}

export async function showWarningAlert(titleMessage, message) {
  return Swal.fire({
    title: titleMessage,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar'
  }
  );
};

export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'success'
  );
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'error'
  );
};