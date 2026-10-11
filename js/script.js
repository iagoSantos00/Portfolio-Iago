const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// ===== MENU MOBILE =====

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const menuAberto = navLinks.classList.toggle("ativo");

    menuToggle.setAttribute(
      "aria-expanded",
      String(menuAberto)
    );

    menuToggle.setAttribute(
      "aria-label",
      menuAberto ? "Fechar menu" : "Abrir menu"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("ativo");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}


// ===== ANO AUTOMÁTICO DO RODAPÉ =====

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ===== BARRA DE PROGRESSO =====

const scrollProgress = document.querySelector(".scroll-progress");

function atualizarProgresso() {
  if (!scrollProgress) return;

  const alturaDocumento =
    document.documentElement.scrollHeight -
    window.innerHeight;

  if (alturaDocumento <= 0) {
    scrollProgress.style.width = "0%";
    return;
  }

  const progresso =
    (window.scrollY / alturaDocumento) * 100;

  scrollProgress.style.width = `${progresso}%`;
}

window.addEventListener("scroll", atualizarProgresso, {
  passive: true
});

window.addEventListener("resize", atualizarProgresso);

atualizarProgresso();


// ===== ANIMAÇÃO DE ENTRADA DAS SEÇÕES =====

const elementosReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observador = new IntersectionObserver(
    (entradas, observer) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observer.unobserve(entrada.target);
        }
      });
    },
    {
      threshold: 0.12
    }
  );

  elementosReveal.forEach((elemento) => {
    observador.observe(elemento);
  });
} else {
  elementosReveal.forEach((elemento) => {
    elemento.classList.add("visivel");
  });
}


// ===== CARDS DE SKILLS COM GIRO 3D =====

document.querySelectorAll(".skill-card-inner").forEach((card) => {
  card.addEventListener("click", () => {
    const virou = card.classList.toggle("is-flipped");

    const titulo = card.querySelector(".skill-card-title");
    const categoria = card.querySelector(
      ".skill-card-front > span"
    );

    card.setAttribute("aria-expanded", String(virou));

    if (virou && titulo) {
      card.setAttribute(
        "aria-label",
        `Voltar para a categoria ${titulo.textContent}`
      );
    } else if (categoria) {
      card.setAttribute(
        "aria-label",
        `Mostrar tecnologias de ${categoria.textContent}`
      );
    }
  });
});


// ===== EFEITO DE LUZ NOS CARDS =====

const cardsComEfeito = document.querySelectorAll(
  ".projeto-card"
);

cardsComEfeito.forEach((card) => {
  card.addEventListener("mousemove", (evento) => {
    const retangulo = card.getBoundingClientRect();

    const x = evento.clientX - retangulo.left;
    const y = evento.clientY - retangulo.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});


// ===== FUNDO ANIMADO DE PARTÍCULAS =====

const canvas = document.querySelector("#particulas-bg");
const contexto = canvas?.getContext("2d");

if (canvas && contexto) {
  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let particulas = [];
  let largura = 0;
  let altura = 0;
  let animacaoId;

  const quantidadeParticulas = 65;
  const distanciaConexao = 120;

  function ajustarCanvas() {
    const escala = Math.min(window.devicePixelRatio || 1, 2);

    largura = window.innerWidth;
    altura = window.innerHeight;

    canvas.width = largura * escala;
    canvas.height = altura * escala;

    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;

    contexto.setTransform(escala, 0, 0, escala, 0, 0);

    criarParticulas();
  }

  function criarParticulas() {
    particulas = [];

    for (let i = 0; i < quantidadeParticulas; i++) {
      particulas.push({
        x: Math.random() * largura,
        y: Math.random() * altura,
        raio: Math.random() * 1.8 + 0.5,
        velocidadeX: (Math.random() - 0.5) * 0.5,
        velocidadeY: (Math.random() - 0.5) * 0.5
      });
    }
  }

  function desenharParticulas() {
    contexto.clearRect(0, 0, largura, altura);

    particulas.forEach((particula) => {
      particula.x += particula.velocidadeX;
      particula.y += particula.velocidadeY;

      if (particula.x < 0 || particula.x > largura) {
        particula.velocidadeX *= -1;
      }

      if (particula.y < 0 || particula.y > altura) {
        particula.velocidadeY *= -1;
      }

      contexto.beginPath();

      contexto.arc(
        particula.x,
        particula.y,
        particula.raio,
        0,
        Math.PI * 2
      );

      contexto.fillStyle = "rgba(88, 166, 255, 0.7)";
      contexto.fill();
    });

    for (let i = 0; i < particulas.length; i++) {
      for (let j = i + 1; j < particulas.length; j++) {
        const primeira = particulas[i];
        const segunda = particulas[j];

        const distancia = Math.hypot(
          primeira.x - segunda.x,
          primeira.y - segunda.y
        );

        if (distancia < distanciaConexao) {
          const opacidade =
            (1 - distancia / distanciaConexao) * 0.2;

          contexto.beginPath();

          contexto.moveTo(primeira.x, primeira.y);
          contexto.lineTo(segunda.x, segunda.y);

          contexto.strokeStyle =
            `rgba(88, 166, 255, ${opacidade})`;

          contexto.lineWidth = 1;
          contexto.stroke();
        }
      }
    }

    if (!movimentoReduzido.matches) {
      animacaoId = requestAnimationFrame(desenharParticulas);
    }
  }

  function iniciarParticulas() {
    cancelAnimationFrame(animacaoId);

    if (movimentoReduzido.matches) {
      contexto.clearRect(0, 0, largura, altura);
      return;
    }

    desenharParticulas();
  }

  ajustarCanvas();
  iniciarParticulas();

  window.addEventListener("resize", () => {
    ajustarCanvas();
    iniciarParticulas();
  });

  movimentoReduzido.addEventListener("change", iniciarParticulas);
}