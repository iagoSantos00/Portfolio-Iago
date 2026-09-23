const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Menu mobile =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  const menuAberto = navLinks.classList.toggle('ativo');
  menuToggle.setAttribute('aria-expanded', menuAberto);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('ativo');
    menuToggle.setAttribute('aria-expanded', false);
  });
});

// ===== Ano dinâmico no footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Efeito de digitação no Hero =====
const textoDigitado = document.getElementById('typed-text');
const textoCompleto = 'Desenvolvedor Java Back-end';

if (prefersReducedMotion) {
  textoDigitado.textContent = textoCompleto;
} else {
  let indice = 0;
  function digitar() {
    if (indice < textoCompleto.length) {
      textoDigitado.textContent += textoCompleto.charAt(indice);
      indice++;
      setTimeout(digitar, 70);
    }
  }
  digitar();
}

// ===== Fade-in ao rolar a página =====
if (!prefersReducedMotion) {
  const elementosReveal = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementosReveal.forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visivel'));
}

// ===== Barra de progresso de scroll =====
const barraProgresso = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  const scrollAtual = window.scrollY;
  const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
  const progresso = (scrollAtual / alturaTotal) * 100;
  barraProgresso.style.width = progresso + '%';
});

// ===== Tilt 3D + glow nos cards (projetos e skills) =====
if (!prefersReducedMotion) {
  const cards = document.querySelectorAll('.projeto-card, .skills-categoria');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centroX = rect.width / 2;
      const centroY = rect.height / 2;

      const rotateX = ((y - centroY) / centroY) * -6;
      const rotateY = ((x - centroX) / centroX) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ===== Fundo de partículas / nós de rede =====
const canvas = document.getElementById('particulas-bg');
const ctx = canvas.getContext('2d');
let particulas = [];
let animacaoId;

function redimensionarCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function criarParticulas() {
  const quantidade = Math.floor((canvas.width * canvas.height) / 15000);
  particulas = [];
  for (let i = 0; i < quantidade; i++) {
    particulas.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8
    });
  }
}

const DISTANCIA_MAXIMA = 140;

function desenharFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Atualiza posição e desenha cada partícula
  particulas.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x <= 0 || p.x >= canvas.width) p.vx *= -1;
    if (p.y <= 0 || p.y >= canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(88, 166, 255, 0.6)';
    ctx.fill();
  });

  // Desenha linhas entre partículas próximas
  for (let i = 0; i < particulas.length; i++) {
    for (let j = i + 1; j < particulas.length; j++) {
      const dx = particulas[i].x - particulas[j].x;
      const dy = particulas[i].y - particulas[j].y;
      const distancia = Math.sqrt(dx * dx + dy * dy);

      if (distancia < DISTANCIA_MAXIMA) {
        const opacidade = 1 - distancia / DISTANCIA_MAXIMA;
        ctx.beginPath();
        ctx.moveTo(particulas[i].x, particulas[i].y);
        ctx.lineTo(particulas[j].x, particulas[j].y);
        ctx.strokeStyle = `rgba(88, 166, 255, ${opacidade * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  animacaoId = requestAnimationFrame(desenharFrame);
}

if (canvas) {
  redimensionarCanvas();
  criarParticulas();

  if (!prefersReducedMotion) {
    desenharFrame();
  } else {
    // Desenha só um frame estático, sem animar
    desenharFrame();
    cancelAnimationFrame(animacaoId);
  }

  window.addEventListener('resize', () => {
    redimensionarCanvas();
    criarParticulas();
  });
}