// js/ui.js - Funções de manipulação do DOM e UI

/**
 * Mostrar/esconder telas (auth vs app)
 */
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

/**
 * Trocar aba de autenticação (login vs register)
 */
function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');

  tabs.forEach(t => t.classList.remove('active'));
  forms.forEach(f => f.classList.remove('active'));

  const activeTab = document.querySelector(`[data-tab="${tab}"]`);
  const activeForm = document.getElementById(`${tab}-form`);

  if (activeTab) activeTab.classList.add('active');
  if (activeForm) activeForm.classList.add('active');
}

/**
 * Mostrar notificação (toast)
 */
function showToast(message, type = 'info', duration = CONFIG.TIMEOUTS.TOAST_DURATION) {
  const toast = document.getElementById('toast');
  if (!toast) {
    log('Toast element não encontrado');
    return;
  }

  // Remover classes anteriores
  toast.classList.remove('toast-success', 'toast-warning', 'toast-error', 'toast-info');

  // Adicionar classe de tipo
  if (type !== 'info') {
    toast.classList.add(`toast-${type}`);
  }

  toast.textContent = message;
  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, duration);
}

/**
 * Mostrar modal
 */
function showModal(modalId) {
  const overlay = document.getElementById(`${modalId}-overlay`);
  if (overlay) {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Esconder modal
 */
function hideModal(modalId) {
  const overlay = document.getElementById(`${modalId}-overlay`);
  if (overlay) {
    overlay.classList.remove('visible');
    document.body.style.overflow = 'auto';
  }
}

/**
 * Atualizar informações do usuário na UI
 */
function updateUserInfoInUI(user) {
  if (!user) return;

  // Atualizar avatar
  const avatar = document.querySelector('.user-avatar');
  if (avatar) {
    const initials = user.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    avatar.textContent = initials;
  }

  // Atualizar nome
  const nameEl = document.querySelector('.user-name');
  if (nameEl) nameEl.textContent = user.name;

  // Atualizar role
  const roleEl = document.querySelector('.user-role');
  if (roleEl) {
    const roleLabel = user.role === 'ADMIN' ? 'Administrador' : 'Usuário';
    roleEl.textContent = roleLabel;
  }
}

/**
 * Atualizar navegação ativa
 */
function setActiveNavItem(section) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  const activeItem = document.querySelector(`[data-section="${section}"]`);
  if (activeItem) activeItem.classList.add('active');
}

/**
 * Mostrar/esconder seção
 */
function showSection(section) {
  const sections = document.querySelectorAll('[data-section-content]');
  sections.forEach(s => s.style.display = 'none');

  const activeSection = document.getElementById(`${section}-section`);
  if (activeSection) {
    activeSection.style.display = 'block';
  }

  setActiveNavItem(section);
}

/**
 * Atualizar topbar title
 */
function setTopbarTitle(title) {
  const titleEl = document.querySelector('.topbar-title');
  if (titleEl) titleEl.textContent = title;
}

/**
 * Habilitar/desabilitar botão
 */
function setButtonState(buttonId, disabled = false, loading = false) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.disabled = disabled || loading;

  if (loading) {
    btn.classList.add('loading');
  } else {
    btn.classList.remove('loading');
  }
}

/**
 * Mostrar/esconder elemento
 */
function toggleElement(elementId, show = true) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (show) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

/**
 * Mostrar mensagem de erro em formulário
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.add('form-error');

  const errorEl = document.createElement('div');
  errorEl.className = 'form-error-msg';
  errorEl.textContent = message;

  // Remover erro anterior se existir
  const existingError = field.parentElement.querySelector('.form-error-msg');
  if (existingError) existingError.remove();

  field.parentElement.appendChild(errorEl);
}

/**
 * Limpar erro de formulário
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove('form-error');

  const errorEl = field.parentElement.querySelector('.form-error-msg');
  if (errorEl) errorEl.remove();
}

/**
 * Limpar todos os erros do formulário
 */
function clearFormErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const errorEls = form.querySelectorAll('.form-error-msg');
  errorEls.forEach(el => el.remove());

  const errorFields = form.querySelectorAll('.form-error');
  errorFields.forEach(el => el.classList.remove('form-error'));
}

/**
 * Renderizar loading skeleton
 */
function renderSkeleton(parentId, itemCount = 3) {
  const parent = document.getElementById(parentId);
  if (!parent) return;

  parent.innerHTML = '';

  for (let i = 0; i < itemCount; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-line" style="width: 60%; height: 16px; margin-bottom: 8px;"></div>
      <div class="skeleton-line" style="width: 80%; height: 12px; margin-bottom: 8px;"></div>
      <div class="skeleton-line" style="width: 40%; height: 12px;"></div>
    `;
    parent.appendChild(skeleton);
  }
}

/**
 * Renderizar empty state
 */
function renderEmptyState(parentId, icon = '📭', title = 'Nenhum item', message = '') {
  const parent = document.getElementById(parentId);
  if (!parent) return;

  parent.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">${icon}</div>
      <h3 class="empty-state-title">${title}</h3>
      ${message ? `<p class="empty-state-text">${message}</p>` : ''}
    </div>
  `;
}

/**
 * Renderizar paginação
 */
function renderPagination(containerId, currentPage, totalPages, onPageChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<div class="pagination">';

  // Botão anterior
  html += `
    <button class="pagination-btn" ${currentPage === 0 ? 'disabled' : ''} 
            onclick="pageChange(${currentPage - 1})">←</button>
  `;

  // Números de página
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  if (startPage > 0) {
    html += `<button class="pagination-btn" onclick="pageChange(0)">1</button>`;
    if (startPage > 1) html += `<span>...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
              onclick="pageChange(${i})">${i + 1}</button>
    `;
  }

  if (endPage < totalPages - 1) {
    if (endPage < totalPages - 2) html += `<span>...</span>`;
    html += `<button class="pagination-btn" onclick="pageChange(${totalPages - 1})">${totalPages}</button>`;
  }

  // Botão próximo
  html += `
    <button class="pagination-btn" ${currentPage === totalPages - 1 ? 'disabled' : ''} 
            onclick="pageChange(${currentPage + 1})">→</button>
  `;

  html += '</div>';
  container.innerHTML = html;
}

/**
 * Scroll suave para elemento
 */
function scrollToElement(elementId, smooth = true) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  });
}

/**
 * Fechar modais ao clicar fora
 */
function setupModalBackdropClose() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      const overlay = e.target;
      overlay.classList.remove('visible');
      document.body.style.overflow = 'auto';
    }
  });
}

/**
 * Setup do fechamento de modais via botão X
 */
function setupModalCloseButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close')) {
      const overlay = e.target.closest('.modal-overlay');
      if (overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
      }
    }
  });
}
