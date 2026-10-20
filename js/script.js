
// ==============================
// MENU MOBILE
// ==============================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const aberto = navLinks.classList.toggle("ativo");

    menuToggle.setAttribute("aria-expanded", String(aberto));
    menuToggle.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );
  });

 
navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const destino = document.querySelector(
      link.getAttribute("href")
    );

    if (!destino) return;

    event.preventDefault();

    navLinks.classList.remove("ativo");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");

    const alturaCabecalho =
      document.querySelector(".header")?.getBoundingClientRect().height || 0;

  
 const espacamento =
  link.getAttribute("href") === "#contato" ? -65 :
  link.getAttribute("href") === "#experiencia" ? -50 : 12;
  

    const posicao =
      destino.getBoundingClientRect().top +
      window.scrollY -
      alturaCabecalho -
      espacamento;

    window.scrollTo({
      top: Math.max(0, posicao),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth"
    });

    const hash = link.getAttribute("href");

    if (window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }
  });
});


// ==============================
// ANO AUTOMÁTICO NO RODAPÉ
// ==============================

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ==============================
// ANIMAÇÕES AO ROLAR A PÁGINA
// ==============================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visivel");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  // Alternativa para navegadores sem IntersectionObserver.
  revealElements.forEach((element) => {
    element.classList.add("visivel");
  });
}

// ==============================
// BARRA DE PROGRESSO DA PÁGINA
// ==============================

const progressBar = document.querySelector(".scroll-progress");

function atualizarProgresso() {
  if (!progressBar) return;

  const alturaRolavel =
    document.documentElement.scrollHeight - window.innerHeight;

  const progresso =
    alturaRolavel > 0
      ? (window.scrollY / alturaRolavel) * 100
      : 0;

  progressBar.style.width =
    `${Math.min(100, Math.max(0, progresso))}%`;
}

window.addEventListener("scroll", atualizarProgresso, {
  passive: true
});

window.addEventListener("resize", atualizarProgresso);

atualizarProgresso();

// ==============================
// EFEITO NOS CARDS DE PROJETOS
// ==============================

const projectCards = document.querySelectorAll(".projeto-card");

const movimentoReduzido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const suportaHover = window.matchMedia("(hover: hover)").matches;

if (!movimentoReduzido && suportaHover) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centroX = rect.width / 2;
      const centroY = rect.height / 2;

      const rotateY = ((x - centroX) / centroX) * 3;
      const rotateX = ((centroY - y) / centroY) * 3;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) ` +
        `rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// ==============================
// CARDS INTERATIVOS DE SKILLS
// ==============================

document.querySelectorAll(".skill-card-inner").forEach((card) => {
  card.addEventListener("click", () => {
    const flipped = card.classList.toggle("is-flipped");

    card.setAttribute("aria-expanded", String(flipped));

    const categoria =
      card.querySelector(".skill-card-title")?.textContent ||
      card.querySelector(".skill-card-front > span")?.textContent ||
      "categoria";

    card.setAttribute(
      "aria-label",
      flipped
        ? `Voltar para a frente de ${categoria}`
        : `Mostrar tecnologias de ${categoria}`
    );
  });
});

// ==============================
// FUNDO ANIMADO DE PARTÍCULAS
// ==============================

const canvas = document.getElementById("particulas-bg");
const context = canvas ? canvas.getContext("2d") : null;

let particles = [];
let animationFrameId;

function configurarCanvas() {
  if (!canvas || !context) return;

  const largura = window.innerWidth;
  const altura = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = largura * dpr;
  canvas.height = altura * dpr;

  canvas.style.width = `${largura}px`;
  canvas.style.height = `${altura}px`;

  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Menos partículas em telas menores para reduzir o uso de recursos.
  const quantidade = Math.min(
    70,
    Math.floor((largura * altura) / 18000)
  );

  particles = Array.from({ length: quantidade }, () => ({
    x: Math.random() * largura,
    y: Math.random() * altura,
    radius: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  }));
}

function desenharParticulas() {
  if (
    !canvas ||
    !context ||
    movimentoReduzido ||
    document.hidden
  ) {
    return;
  }

  const largura = window.innerWidth;
  const altura = window.innerHeight;

  context.clearRect(0, 0, largura, altura);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > largura) {
      particle.vx *= -1;
    }

    if (particle.y < 0 || particle.y > altura) {
      particle.vy *= -1;
    }

    // Desenha cada partícula.
    context.beginPath();
    context.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );

    context.fillStyle = "rgba(88, 166, 255, 0.55)";
    context.fill();

    // Liga partículas próximas.
    for (let i = index + 1; i < particles.length; i++) {
      const other = particles[i];

      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 105) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);

        context.strokeStyle =
          `rgba(88, 166, 255, ${0.13 * (1 - distance / 105)})`;

        context.lineWidth = 1;
        context.stroke();
      }
    }
  });

  animationFrameId = window.requestAnimationFrame(desenharParticulas);
}

function iniciarParticulas() {
  if (!canvas || !context || movimentoReduzido) return;

  window.cancelAnimationFrame(animationFrameId);
  configurarCanvas();

  if (!document.hidden) {
    desenharParticulas();
  }
}

if (canvas && context && !movimentoReduzido) {
  iniciarParticulas();

  window.addEventListener("resize", iniciarParticulas);

  document.addEventListener("visibilitychange", () => {
    window.cancelAnimationFrame(animationFrameId);

    if (!document.hidden) {
      desenharParticulas();
    }
  });
} else if (canvas) {
  canvas.style.display = "none";
}
}