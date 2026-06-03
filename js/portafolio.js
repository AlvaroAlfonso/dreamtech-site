/**
 * Dreamtech Portfolio Controller
 * Manejo de UI, Navbar Responsivo, Observadores de Intersección y Contadores Animados en POO.
 */
class PortfolioManager {
  constructor() {
    this.statsTriggered = false;
    this.init();
  }

  /**
   * Inicializa los módulos controladores de la interfaz
   */
  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initNavbarController();
      this.initStatsObserver();
      this.initProjectsObserver();
    });
  }

  /**
   * Controlador del Navbar Móvil y Gestión de Estados Interactivos
   */
  initNavbarController() {
    const toggleBtn = document.getElementById('navToggle');
    const menuLinks = document.getElementById('navMenu');
    const body = document.body;

    if (!toggleBtn || !menuLinks) return;

    // Función unificada para alternar el estado del menú
    const toggleMenu = () => {
      const isOpen = menuLinks.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active');
      body.classList.toggle('menu-is-open');
      
      // Actualización de atributos dinámicos de accesibilidad (A11Y)
      toggleBtn.setAttribute('aria-expanded', isOpen);
    };

    // Evento de apertura/cierre al presionar el botón hamburguesa
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Cerrar el menú automáticamente al hacer clic en cualquier enlace interno
    const navItems = menuLinks.querySelectorAll('a:not(.nav-btn)');
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        if (menuLinks.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });

    // Cerrar de forma segura si el usuario hace clic fuera del área del menú
    document.addEventListener('click', (e) => {
      if (menuLinks.classList.contains('is-open') && !menuLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  /**
   * Genera el efecto incremental de los números estadísticos en el Hero
   * @param {HTMLElement} el - Elemento del DOM a animar
   * @param {number} target - Número final de llegada
   * @param {string} suffix - Símbolo final (+ , %)
   * @param {number} duration - Duración en milisegundos
   */
  animateCounter(el, target, suffix, duration = 1800) {
    let start = 0;
    const stepsPerSecond = 60;
    const totalSteps = (duration / 1000) * stepsPerSecond;
    const stepIncrement = target / totalSteps;
    
    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(start) + suffix;
    }, 1000 / stepsPerSecond);
  }

  /**
   * Configura el IntersectionObserver para activar los contadores cuando sean visibles
   */
  initStatsObserver() {
    const statsContainer = document.getElementById('stats');
    if (!statsContainer) return;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.statsTriggered) {
          this.statsTriggered = true;
          
          const counters = document.querySelectorAll('.stat-num[data-target]');
          counters.forEach((counterEl) => {
            const target = parseInt(counterEl.dataset.target, 10);
            const suffix = counterEl.dataset.suffix || '';
            this.animateCounter(counterEl, target, suffix);
          });
          
          // Desconectar una vez activado para optimizar memoria
          statsObserver.unobserve(statsContainer);
        }
      });
    }, { threshold: 0.4 });

    statsObserver.observe(statsContainer);
  }

  /**
   * Configura el IntersectionObserver para revelar las tarjetas de proyectos dinámicamente al hacer scroll
   */
  initProjectsObserver() {
    const projectCards = document.querySelectorAll('.pcard');
    if (projectCards.length === 0) return;

    const cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar una vez que el elemento es visible
          cardsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    projectCards.forEach((card) => cardsObserver.observe(card));
  }
}

// Instanciación única del controlador global para el Portafolio
const dreamtechPortfolio = new PortfolioManager();