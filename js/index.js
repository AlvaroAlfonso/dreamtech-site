document.addEventListener('DOMContentLoaded', () => {
  
  // Counter animation
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

  // Reveal on scroll
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  // FAQ Accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Nav scroll behavior
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile Menu Toggle (Asegurando estabilidad)
  const navMobile = document.getElementById('navMobile');
  const navLinks = document.querySelector('.nav-links');
  if (navMobile && navLinks) {
    navMobile.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navMobile.classList.toggle('open');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const body = document.body;

  // Función Central para Alternar Menú
  const toggleMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Cambiar estados lógicos (A11y)
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.setAttribute('aria-hidden', isExpanded);
    
    // Alternar clases CSS para transiciones visuales
    navMenu.classList.toggle('is-open', !isExpanded);
    body.classList.toggle('nav-lock-scroll', !isExpanded);
  };

  // Función Segura para Cerrar el Menú
  const closeMenu = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    navMenu.classList.remove('is-open');
    body.classList.remove('nav-lock-scroll');
  };

  // Listeners de Eventos
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleMenu);
    
    // Cerrar el menú automáticamente al hacer clic en un enlace (In-page navigation UX)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Solo ejecuta el cierre si el menú móvil está activo actualmente
        if (window.innerWidth <= 1024) {
          closeMenu();
        }
      });
    });

    // Control de reseteo por si el usuario rota o cambia el tamaño de pantalla de móvil a PC
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeMenu();
      }
    }, { passive: true });
  }
});