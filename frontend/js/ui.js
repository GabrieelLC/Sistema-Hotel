/**
 * ui.js - Componentes reutilizáveis de UI (sidebar, notificações, dialogs)
 */

// ===== SETUP DO SIDEBAR =====
function setupSidebar() {
  const user = getUser();
  const sidebarUserName = document.getElementById('sidebarUserName');
  const sidebarUserRole = document.getElementById('sidebarUserRole');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  const usuariosMenuBtn = document.getElementById('usuariosMenuBtn');

  if (sidebarUserName && user) {
    sidebarUserName.textContent = user.nome || user.usuario || '—';
  }
  if (sidebarUserRole && user) {
    sidebarUserRole.textContent = user.nivel_acesso || 'padrão';
  }

  // Mostrar menu de usuários apenas para admins e gerentes
  if (usuariosMenuBtn && user && (user.nivel_acesso === 'admin' || user.nivel_acesso === 'gerente')) {
    usuariosMenuBtn.style.display = 'flex';
  }

  // Configurar logout com confirmação
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showConfirmDialog(
        'Deseja realmente sair?',
        'Você será redirecionado para a tela de login.',
        () => {
          logout();
        }
      );
    });
  }

  // Marcar item ativo no menu
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('href') === currentPage || (currentPage === '' && btn.getAttribute('href') === 'index.html')) {
      btn.classList.add('active');
    }
  });
}

// ===== SISTEMA DE NOTIFICAÇÕES (TOAST) =====
function showNotification(message, type = 'info', duration = 4000) {
  // Criar container se não existir
  let container = document.getElementById('notificationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notificationContainer';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
    document.body.appendChild(container);
  }

  // Criar toast
  const toast = document.createElement('div');
  const colors = {
    success: { bg: '#e6ffed', border: '#9ae6b4', text: '#22543d' },
    danger: { bg: '#fed7d7', border: '#fc8181', text: '#742a2a' },
    warning: { bg: '#fef5e7', border: '#f8d7a1', text: '#7d6608' },
    info: { bg: '#bee3f8', border: '#90cdf4', text: '#2c5282' },
  };

  const color = colors[type] || colors.info;
  toast.style.cssText = `
    background-color: ${color.bg};
    border: 1px solid ${color.border};
    color: ${color.text};
    padding: 1rem 1.25rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;

  container.appendChild(toast);

  // Remover após duração
  if (duration > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return toast;
}

// ===== DIÁLOGO DE CONFIRMAÇÃO =====
function showConfirmDialog(title, message, onConfirm, onCancel) {
  // Criar backdrop
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  // Criar modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    animation: modalSlideIn 0.3s ease-out;
  `;

  modal.innerHTML = `
    <h2 style="color: #1a202c; margin-bottom: 0.5rem; font-size: 1.25rem;">${title}</h2>
    <p style="color: #4a5568; margin-bottom: 2rem;">${message}</p>
    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background-color: #e2e8f0;
        color: #4a5568;
        font-weight: 600;
        transition: background-color 0.2s;
      ">Cancelar</button>
      <button id="confirmBtn" style="
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        background-color: #e53e3e;
        color: white;
        font-weight: 600;
        transition: background-color 0.2s;
      ">Confirmar</button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Event listeners
  const confirmBtn = modal.querySelector('#confirmBtn');
  const cancelBtn = modal.querySelector('#cancelBtn');

  const close = () => {
    backdrop.style.animation = 'modalSlideOut 0.3s ease-out';
    setTimeout(() => backdrop.remove(), 300);
  };

  confirmBtn.addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });

  cancelBtn.addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('mouseenter', function () {
    this.style.backgroundColor = '#c53030';
  });
  confirmBtn.addEventListener('mouseleave', function () {
    this.style.backgroundColor = '#e53e3e';
  });

  cancelBtn.addEventListener('mouseenter', function () {
    this.style.backgroundColor = '#cbd5e0';
  });
  cancelBtn.addEventListener('mouseleave', function () {
    this.style.backgroundColor = '#e2e8f0';
  });
}

// ===== INJETAR ESTILOS GLOBAIS =====
function injectGlobalStyles() {
  const existingStyle = document.getElementById('uiGlobalStyles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'uiGlobalStyles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }

    @keyframes modalSlideIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes modalSlideOut {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.9);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===== INICIALIZAR TUDO =====
document.addEventListener('DOMContentLoaded', () => {
  injectGlobalStyles();
  setupSidebar();
  // Nota: updateDateTime() é definido em cada página individual se necessário
});
