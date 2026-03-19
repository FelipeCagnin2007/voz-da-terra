document.addEventListener("DOMContentLoaded", () => {
  // 1. CONTROLE DO MENU HAMBÚRGUER
  const btnMenu = document.getElementById("btn-menu");
  const navMenu = document.getElementById("nav-menu");

  if (btnMenu && navMenu) {
    btnMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      btnMenu.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !btnMenu.contains(e.target)) {
        btnMenu.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }

  // 2. LÓGICA DO CONTADOR (NÚMEROS CRESCENDO)
  const countUp = (el) => {
    const rawTarget = el.getAttribute("data-count");
    const target = parseFloat(rawTarget);
    const isFloat = rawTarget.includes(".");
    let current = 0;
    const duration = 2000; // 2 segundos
    const frameDuration = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameDuration);
    const increment = target / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current += increment;

      if (frame === totalFrames) {
        clearInterval(timer);
        el.innerText = isFloat
          ? target.toFixed(1) + "t"
          : target.toLocaleString();
      } else {
        el.innerText = isFloat
          ? current.toFixed(1) + "t"
          : Math.floor(current).toLocaleString();
      }
    }, frameDuration);
  };

  // 3. INTERSECTION OBSERVER (GATILHO DAS ANIMAÇÕES)
  const observerOptions = { threshold: 0.3 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Mostra o card (fade in + slide up)
        if (entry.target.classList.contains("stat-card")) {
          entry.target.classList.add("show");
        }

        // Dispara o contador numérico
        if (entry.target.classList.contains("stat-value")) {
          countUp(entry.target);
        }

        // Expande as barras do gráfico
        if (entry.target.classList.contains("bar-fill")) {
          entry.target.style.width = entry.target.getAttribute("data-width");
        }

        observer.unobserve(entry.target); // Garante que anime apenas uma vez
      }
    });
  }, observerOptions);

  // Seleciona todos os elementos que precisam ser observados
  document
    .querySelectorAll(".stat-card, .stat-value, .bar-fill")
    .forEach((el) => {
      observer.observe(el);
    });
});
