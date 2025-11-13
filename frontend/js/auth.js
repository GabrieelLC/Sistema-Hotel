/**
 * auth.js - Sistema de autenticação e gerenciamento de token
 */

// Função para obter o token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Função para obter dados do usuário do localStorage
function getUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Erro ao parsear usuário:', e);
    return null;
  }
}

// Função para fazer logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.replace('login.html');
}

// Função para fazer fetch com autenticação
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  
  if (!options.headers) {
    options.headers = {};
  }
  
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await fetch(url, options);
    
    // Se receber 401 (não autorizado), fazer logout
    if (response.status === 401) {
      logout();
      return response;
    }
    
    return response;
  } catch (error) {
    console.error('Erro ao fazer fetch:', error);
    throw error;
  }
}

// Verificar autenticação ao carregar qualquer página
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop();
  
  // Páginas que NÃO requerem autenticação
  const publicPages = ['login.html', ''];
  
  // Se não há usuário logado e não está em página pública
  if (!user && !publicPages.includes(currentPage)) {
    // Usar setTimeout para garantir que o navegador processe antes
    setTimeout(() => {
      window.location.replace('login.html');
    }, 100);
  }
});
