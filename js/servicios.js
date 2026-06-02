document.addEventListener('DOMContentLoaded', () => {
  
  // 1. ANIMACIONES DE ENTRADA EFICIENTES (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    root: null, // Usa el viewport global
    threshold: 0.08, // Se activa al mostrar el 8% del elemento
    restoreOnScroll: false
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Libera memoria GPU tras animar
      }
    });
  }, revealOptions);

  revealElements.forEach(element => revealObserver.observe(element));

  // 2. DETECCIÓN ACTIVA DE SCROLL PARA LAS PESTAÑAS (Badges)
  const sections = ['web', 'marketplace', 'gmb', 'whatsapp', 'ia', 'mobile'];
  const badgeLinks = document.querySelectorAll('.hero-badges .badge');
  
  let isScrolling = false;

  const checkActiveSection = () => {
    let currentSectionId = '';
    const scrollBuffer = 240; // Pixels de tolerancia superior

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const topPosition = el.getBoundingClientRect().top;
        if (topPosition < scrollBuffer) {
          currentSectionId = id;
        }
      }
    });

    badgeLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSectionId}`);
    });
  };

  // Throttle optimizado para el evento Scroll en smartphones
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        checkActiveSection();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true }); // passive indica que no bloqueará el renderizado táctil

  // 3. CAPA DE ANALÍTICA INTEGRADA (DataLayer para Google Tag Manager)
  const trackableElements = document.querySelectorAll('[data-analytics]');

  trackableElements.forEach(element => {
    element.addEventListener('click', function() {
      const action = this.getAttribute('data-analytics');
      const service = this.getAttribute('data-service') || 'general';
      const targetUrl = this.getAttribute('href');

      // Envío semántico estructurado al DataLayer de GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'cta_click',
        'cta_category': 'servicios_page',
        'cta_action': action,
        'cta_label': service,
        'target_url': targetUrl
      });
    });
  });
});