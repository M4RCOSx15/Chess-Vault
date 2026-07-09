// js/ui.js - Manipulação de DOM (versão mínima)

function showScreen(screen) {
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');

  if (screen === 'auth') {
    authScreen.classList.remove('hidden');
    appScreen.classList.remove('visible');
  } else if (screen === 'app') {
    authScreen.classList.add('hidden');
    appScreen.classList.add('visible');
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

  const activeTab = document.querySelector(`[data-tab="${tab}"]`);
  const activeForm = document.getElementById(`${tab}-form`);

  if (activeTab) activeTab.classList.add('active');
  if (activeForm) activeForm.classList.add('active');
}

function showToast(message, type = 'info', duration = CONFIG.TIMEOUTS.TOAST_DURATION) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.remove('toast-success', 'toast-error', 'toast-info');
  if (type !== 'info') toast.classList.add(`toast-${type}`);

  toast.textContent = message;
  toast.classList.add('visible');

  setTimeout(() => toast.classList.remove('visible'), duration);
}
