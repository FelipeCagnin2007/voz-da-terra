/**
 * Components.js - Shared UI components for Voz da Terra
 */

const Components = {
  /**
   * Renders the sidebar into a placeholder element.
   * @param {string} relativePath - Path to the root directory (e.g., "" for index.html, "../" for pages/xxx.html)
   */
  renderSidebar(relativePath = "") {
    const placeholder = document.getElementById("sidebar-placeholder");
    if (!placeholder) return;

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const activeUser = JSON.parse(sessionStorage.getItem("vozDaTerra_active_user"));

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
    } else {
      authSectionButtons = `
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
              <li><a href="${relativePath}index.html" class="${currentPage === "index.html" ? "active" : ""}">Página Inicial</a></li>
              <li><a href="${relativePath}pages/projetos.html" class="${currentPage === "projetos.html" ? "active" : ""}">Projetos Ecológicos</a></li>
              <li><a href="${relativePath}pages/dados.html" class="${currentPage === "dados.html" ? "active" : ""}">Pesquisa e Dados</a></li>
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
  }
};

// Initialize sidebar if placeholder exists
document.addEventListener("DOMContentLoaded", () => {
  const isInsidePages = window.location.pathname.includes("/pages/");
  Components.renderSidebar(isInsidePages ? "../" : "");
});
