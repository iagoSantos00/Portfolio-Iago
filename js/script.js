
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

    const espacamento = 12;

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
// ===== FUNDO FLUXO DIGITAL =====

const canvas = document.querySelector("#particulas-bg");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let largura = 0;
  let altura = 0;
  let trilhas = [];
  let animacaoId = null;

  const quantidadeTrilhas = () =>
  Math.min(90, Math.max(35, Math.floor(largura / 22)));

  function criarTrilha(indice) {
    const profundidade = 0.35 + Math.random() * 0.65;

    return {
      x: Math.random() * largura,
      y: Math.random() * altura,
      comprimento: (80 + Math.random() * 220) * profundidade,
      velocidade: (0.06 + Math.random() * 0.12) * profundidade,
      inclinacao: 0.15 + Math.random() * 0.50,
      opacidade: 0.18 + Math.random() * 0.30,
      espessura: 0.7 + profundidade * 0.8,
      fase: Math.random() * Math.PI * 2,
      profundidade,
      indice
    };
  }

  function redimensionarCanvas() {
    const escala = Math.min(window.devicePixelRatio || 1, 1.5);

    largura = window.innerWidth;
    altura = window.innerHeight;

    canvas.width = Math.round(largura * escala);
    canvas.height = Math.round(altura * escala);
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    trilhas = Array.from(
      { length: quantidadeTrilhas() },
      (_, indice) => criarTrilha(indice)
    );

    desenhar(true);
  }

  function desenhar(parado = false) {
    ctx.clearRect(0, 0, largura, altura);

    trilhas.forEach((trilha) => {
      const oscilacao = Math.sin(trilha.fase) * 12;
      const xInicial = trilha.x;
      const yInicial = trilha.y + oscilacao;
      const xFinal = xInicial + trilha.comprimento;
      const yFinal =
        yInicial + trilha.comprimento * trilha.inclinacao;

      // Linha fina que sugere uma trilha digital no espaço.
      const gradiente = ctx.createLinearGradient(
        xInicial,
        yInicial,
        xFinal,
        yFinal
      );

      gradiente.addColorStop(0, "rgba(45, 135, 255, 0)");
      gradiente.addColorStop(
        0.55,
        `rgba(55, 145, 255, ${trilha.opacidade * 0.45})`
      );
      gradiente.addColorStop(
        1,
        `rgba(105, 190, 255, ${trilha.opacidade})`
      );

      ctx.beginPath();
      ctx.moveTo(xInicial, yInicial);
      ctx.lineTo(xFinal, yFinal);
      ctx.strokeStyle = gradiente;
      ctx.lineWidth = trilha.espessura;
      ctx.stroke();

      // Pequeno ponto luminoso viajando pela trilha.
      const progresso = (trilha.fase % (Math.PI * 2)) / (Math.PI * 2);
      const pontoX = xInicial + (xFinal - xInicial) * progresso;
      const pontoY = yInicial + (yFinal - yInicial) * progresso;

      const brilho = ctx.createRadialGradient(
        pontoX, pontoY, 0,
        pontoX, pontoY, 7 * trilha.profundidade
      );

      brilho.addColorStop(0, "rgba(140, 205, 255, 0.8)");
      brilho.addColorStop(1, "rgba(50, 130, 255, 0)");

      ctx.beginPath();
      ctx.arc(
        pontoX,
        pontoY,
        5 * trilha.profundidade,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = brilho;
      ctx.fill();

      if (!parado) {
        trilha.x += trilha.velocidade;
        trilha.fase += 0.025 * trilha.profundidade;

        if (trilha.x > largura + trilha.comprimento) {
          trilha.x = -trilha.comprimento;
          trilha.y = Math.random() * altura;
          trilha.fase = Math.random() * Math.PI * 2;
        }
      }
    });
  }

  function animar() {
    if (document.hidden) {
      animacaoId = null;
      return;
    }

    desenhar();
    animacaoId = requestAnimationFrame(animar);
  }

  function iniciarAnimacao() {
    if (animacaoId !== null || document.hidden) return;

    if (movimentoReduzido.matches) {
      desenhar(true);
      return;
    }

    animacaoId = requestAnimationFrame(animar);
  }

  function pararAnimacao() {
    if (animacaoId !== null) {
      cancelAnimationFrame(animacaoId);
      animacaoId = null;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pararAnimacao();
    } else {
      iniciarAnimacao();
    }
  });

  movimentoReduzido.addEventListener("change", () => {
    pararAnimacao();
    desenhar(true);
    iniciarAnimacao();
  });

  window.addEventListener("resize", redimensionarCanvas);

  redimensionarCanvas();
  iniciarAnimacao();
}}
