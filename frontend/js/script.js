document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login realizado com sucesso!');
        console.log(data);
      } else {
        alert(data.message || 'Erro ao realizar login');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao conectar ao servidor');
    }
  });
});