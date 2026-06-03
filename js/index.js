document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. COMPONENTE NAVBAR & MENÚ MÓVIL (PREMIUM & ACCESIBLE)
  // ==========================================================================
  const navToggle = document.getElementById('navToggle'); // El ID unificado de tu botón
  const navMenu = document.getElementById('navMenu');     // El ID de tu lista <ul>
  const navLinksList = document.querySelectorAll('.nav-links a');
  const body = document.body;
  const nav = document.getElementById('nav');

  // Función Central para Alternar Menú Móvil
  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Cambiar estados lógicos (Accesibilidad A11y)
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.setAttribute('aria-hidden', isExpanded);
    
    // Transiciones visuales con clases CSS optimizadas
    navMenu.classList.toggle('is-open', !isExpanded);
    body.classList.toggle('nav-lock-scroll', !isExpanded);
  };

  // Función Segura para Cerrar el Menú Móvil
  const closeMenu = () => {
    if (navToggle && navMenu) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
      navMenu.classList.remove('is-open');
      body.classList.remove('nav-lock-scroll');
    }
  };

  // Inicialización de Listeners del Navbar
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleMenu);
    
    // Control de reseteo si el usuario cambia el tamaño o rota la pantalla
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    }, { passive: true });
  }

  // Comportamiento del Navbar al hacer Scroll (Fondo blur dinámico)
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ==========================================================================
  // 2. NAVEGACIÓN Y SMOOTH SCROLL (INTEGRADO CON UX MÓVIL)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        
        // 1. Si estamos en móvil, cerramos primero el menú de forma limpia
        if (window.innerWidth <= 1024) {
          closeMenu();
        }
        
        // 2. Esperamos un breve instante a que inicie el cierre para hacer el scroll suave
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, window.innerWidth <= 1024 ? 150 : 0);
      }
    });
  });

  // ==========================================================================
  // 3. ANIMACIÓN DE CONTADORES / ESTADÍSTICAS
  // ==========================================================================
  let statsTriggered = false;
  
  function animateCounter(el, target, suffix, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(t);
      }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        document.querySelectorAll('.stat-n[data-target]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target), el.dataset.suffix || '');
        });
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.getElementById('stats');
  if (statsEl) statsObs.observe(statsEl);

  // ==========================================================================
  // 4. REVEAL ON SCROLL (EFECTOS DE APARICIÓN)
  // ==========================================================================
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // ==========================================================================
  // 5. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
  // ==========================================================================
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
});