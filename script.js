document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu");
  const navMenu = document.getElementById("nav-menu");

  if (btnMenu && navMenu) {
    btnMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      btnMenu.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !btnMenu.contains(e.target)) {
        btnMenu.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
});
