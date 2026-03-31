/**
 * Components.js - Shared UI components for Voz da Terra
 * Centraliza a lógica de renderização e comportamento de componentes globais.
 */

const Components = {
  /**
   * Renders the sidebar into a placeholder element.
   * @param {string} relativePath - Path to the root directory (e.g., "" for index.html, "../" for pages/xxx.html)
   */
  renderSidebar(relativePath = "") {
    const placeholder = document.getElementById("sidebar-placeholder");
    if (!placeholder) return;

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const activeUser = JSON.parse(
      sessionStorage.getItem("vozDaTerra_active_user")
    );

    let authSection = "";
    if (activeUser) {
      authSection = `
        <div class="user-profile-menu">
          <div class="user-info">
            <span class="user-name">Olá, ${activeUser.nome.split(" ")[0]}</span>
            <span class="user-role">${activeUser.role}</span>
          </div>
          <a href="#" class="logout-link">Sair da Conta</a>
        </div>
      `;
    } else {
      authSection = `
        <div class="auth-menu">
          <a href="${relativePath}pages/login.html" class="login-link">Acessar Conta</a>
        </div>
      `;
    }

    let authSectionButtons = "";
    if (activeUser) {
      authSectionButtons = `
      <li>
        <a href="${relativePath}pages/criar-artigo.html" class="btn-create">+ Artigo</a>
      </li>
      <li>
        <a href="${relativePath}pages/criar-projeto.html" class="btn-create">+ Projeto</a>
      </li>
      `;
    }

    const html = `
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="logo">
            <img src="${relativePath}logo.png" alt="logo" />
            <div>VOZ DA<br />TERRA</div>
          </div>
          <button class="hamburger" id="btn-menu">
            <span></span><span></span><span></span>
          </button>
          <nav class="nav-menu" id="nav-menu">
            <ul>
              <li><a href="${relativePath}index.html" class="${
      currentPage === "index.html" ? "active" : ""
    }">Página Inicial</a></li>
              <li><a href="${relativePath}pages/projetos.html" class="${
      currentPage === "projetos.html" ? "active" : ""
    }">Projetos Ecológicos</a></li>
              <li><a href="${relativePath}pages/dados.html" class="${
      currentPage === "dados.html" ? "active" : ""
    }">Pesquisa e Dados</a></li>
    <li><a href="${relativePath}pages/gemini.html" class="${
      currentPage === "gemini.html" ? "active" : ""
    }">EcologIA</a></li>
              ${authSectionButtons}
              <li>
                <a href="${relativePath}aplicativo.apk" class="btn-app">Baixar APP</a>
              </li>
            </ul>
            <div class="sidebar-auth-mobile">
              ${authSection}
            </div>
          </nav>
        </div>
        <div class="sidebar-bottom desktop-only">
          ${authSection}
        </div>
      </aside>
    `;

    placeholder.innerHTML = html;

    // Hamburger Menu Logic
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

    // Logout Logic
    document.querySelectorAll(".logout-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("vozDaTerra_active_user");
        window.location.reload();
      });
    });
  },
};

/**
 * ============================================================================
 * SearchComponent - Componente de busca reativo com Debounce integrado.
 * ============================================================================
 * Design Pattern: Observer/Callback.
 * O componente não sabe o que está sendo filtrado. Ele apenas captura a
 * intenção do usuário, otimiza as chamadas (debounce) e delega a ação.
 */
class SearchComponent {
  /**
   * @param {string} containerId - O ID da div onde o input será injetado.
   * @param {string} placeholderText - O texto de dica (placeholder) do input.
   * @param {Function} onSearchCallback - Função executada quando o usuário digita. Recebe o texto como parâmetro.
   */
  constructor(containerId, placeholderText, onSearchCallback) {
    this.container = document.getElementById(containerId);
    this.placeholderText = placeholderText;
    this.onSearchCallback = onSearchCallback;
    this.timeoutId = null;

    if (this.container) {
      this.render();
      this.attachEvents();
    } else {
      console.warn(
        `SearchComponent: Não foi possível montar. Container '#${containerId}' não encontrado no DOM.`
      );
    }
  }

  render() {
    // Injeção de string template. Em um contexto com Vue.js, isso seria o bloco <template>.
    this.container.innerHTML = `
      <div class="search-box" style="margin-bottom: 30px;">
        <input 
          type="text" 
          class="generic-search-input"
          placeholder="${this.placeholderText}" 
          style="width: 100%; max-width: 500px; padding: 12px 20px; border: 1px solid #ccc; border-radius: 8px; font-size: 1rem;"
        />
      </div>
    `;
  }

  attachEvents() {
    const input = this.container.querySelector(".generic-search-input");
    if (!input) return;

    input.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      // Implementação de Debounce para mitigar concorrência pesada na thread principal
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.onSearchCallback(searchTerm);
      }, 300); // 300ms é o "sweet spot" ideal entre reatividade e economia de CPU
    });
  }
}

// Initialize sidebar if placeholder exists
document.addEventListener("DOMContentLoaded", () => {
  const isInsidePages = window.location.pathname.includes("/pages/");
  Components.renderSidebar(isInsidePages ? "../" : "");
});
