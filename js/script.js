// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const menuAberto = navLinks.classList.toggle('ativo');
  menuToggle.setAttribute('aria-expanded', menuAberto);
});

// Fecha o menu ao clicar em um link (útil no mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('ativo');
    menuToggle.setAttribute('aria-expanded', false);
  });
});

// Ano dinâmico no footer
document.getElementById('year').textContent = new Date().getFullYear();