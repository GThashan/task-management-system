import Swal from "sweetalert2";

const swalTheme = {
  confirmButtonColor: "#9333ea",
  cancelButtonColor: "#6b7280",
  reverseButtons: true,
};

export async function confirmDeleteTask(title: string): Promise<boolean> {
  const result = await Swal.fire({
    title: "Delete task?",
    html: `Are you sure you want to delete <strong>${title}</strong>? This cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    ...swalTheme,
  });

  return result.isConfirmed;
}

export function showLoading(message = "Please wait...") {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => Swal.showLoading(),
  });
}

export function closeAlert() {
  Swal.close();
}
