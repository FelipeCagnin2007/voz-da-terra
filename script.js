// URL da API do Google Apps Script
const API_URL =
  "https://script.google.com/macros/s/AKfycbzjBknz-60Rcbq-d2qxRFehxnXIl17o1u0xWOQam__pusWjSnCk1yLQD1VoTcH_vo93/exec";

// 1. SERVICE LAYER - Gestão de Dados
const DataService = {
  async request(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    try {
      const response = await fetch(`${API_URL}?${queryString}`);
      if (!response.ok) throw new Error("Erro na rede");
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      return [];
    }
  },
};

// 2. INTERFACE E ANIMAÇÕES
document.addEventListener("DOMContentLoaded", () => {

  // Lógica do Contador (para a página de dados)
  const countUp = (el) => {
    const rawTarget = el.getAttribute("data-count");
    const target = parseFloat(rawTarget);
    if (isNaN(target)) return;

    const isFloat = rawTarget.includes(".");
    let current = 0;
    const duration = 2000;
    const totalFrames = 120;
    const increment = target / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current += increment;

      if (frame >= totalFrames) {
        clearInterval(timer);
        el.innerText = isFloat
          ? target.toFixed(1) + "t"
          : target.toLocaleString();
      } else {
        el.innerText = isFloat
          ? current.toFixed(1) + "t"
          : Math.floor(current).toLocaleString();
      }
    }, 1000 / 60);
  };

  // Intersection Observer para disparar animações
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("stat-card"))
            entry.target.classList.add("show");
          if (entry.target.classList.contains("stat-value"))
            countUp(entry.target);
          if (entry.target.classList.contains("bar-fill")) {
            entry.target.style.width = entry.target.getAttribute("data-width");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document
    .querySelectorAll(".stat-card, .stat-value, .bar-fill")
    .forEach((el) => observer.observe(el));
});
