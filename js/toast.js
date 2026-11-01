export function showToast(message) {
  const toast = document.getElementById('toast');

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
