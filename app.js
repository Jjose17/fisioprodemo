(() => {
  'use strict';
  const config = window.FISIOPRO_CONFIG;
  const phone = String(config.whatsapp).replace(/\D/g, '');
  const whatsappUrl = message => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Asignar URLs dinámicas de WhatsApp a todos los botones y enlaces
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = whatsappUrl(link.dataset.whatsapp);
  });
  document.querySelectorAll('[data-instagram]').forEach(link => {
    link.href = config.instagram;
  });
  document.querySelectorAll('[data-phone-label]').forEach(label => {
    label.textContent = config.phoneLabel;
  });
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Configuración de Google Maps (si existe URL confirmada en config.js)
  const mapsLink = document.getElementById('google-maps-link');
  const mapsPendingNote = document.getElementById('map-pending-note');
  if (config.googleMapsUrl && mapsLink) {
    mapsLink.href = config.googleMapsUrl;
    mapsLink.style.display = 'inline-block';
    if (mapsPendingNote) mapsPendingNote.style.display = 'none';
  }

  const dialogs = Array.from(document.querySelectorAll('dialog'));
  const returnFocus = new WeakMap();
  const openDialog = dialog => {
    const trigger = document.activeElement;
    returnFocus.set(dialog, trigger?.closest('#menu-dialog') ? document.querySelector('.menu-button') : trigger);
    dialogs.forEach(other => { if (other !== dialog && other.open) other.close(); });
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('[data-close]')?.focus({ preventScroll: true });
  };
  dialogs.forEach(dialog => dialog.addEventListener('close', () => {
    if (document.querySelector('dialog[open]')) return;
    const trigger = returnFocus.get(dialog);
    if (trigger instanceof HTMLElement && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
  }));
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    openDialog(document.getElementById(button.dataset.open));
  }));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  dialogs.forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  document.querySelectorAll('#menu-dialog a').forEach(link => link.addEventListener('click', () => document.getElementById('menu-dialog').close()));

  // --- Modelo Cinemático Articulado (Coordenadas de postura) ---
  const kinematicStates = {
    // 1. Movilidad: apertura armónica y fluida de un arco
    movilidad: {
      j0: [160, 260], j1: [160, 175], j2: [225, 120], j3: [260, 65],
      rangeOpacity: '1', sat: [100, 120, 0]
    },
    // 2. Actividad física y deporte: flexión coordinada con ángulo de impulso
    deporte: {
      j0: [130, 260], j1: [195, 205], j2: [145, 130], j3: [255, 75],
      rangeOpacity: '0.4', sat: [80, 140, 0]
    },
    // 3. Procesos de recuperación: alineación progresiva vertical hacia estabilidad
    recuperacion: {
      j0: [160, 265], j1: [160, 195], j2: [160, 125], j3: [160, 60],
      rangeOpacity: '0.2', sat: [160, 125, 0]
    },
    // 4. Orientación: convergencia hacia un punto focal central
    orientacion: {
      j0: [160, 240], j1: [160, 160], j2: [215, 160], j3: [160, 105],
      rangeOpacity: '0.6', sat: [105, 160, 1]
    }
  };

  const updateKinematics = key => {
    const s = kinematicStates[key] || kinematicStates.movilidad;
    // Actualizar articulaciones (círculos)
    const setNode = (id, coords) => {
      const el = document.getElementById(id);
      if (el) { el.setAttribute('cx', coords[0]); el.setAttribute('cy', coords[1]); }
    };
    setNode('k-j0', s.j0);
    setNode('k-j1', s.j1);
    setNode('k-j2', s.j2);
    setNode('k-j3', s.j3);

    // Actualizar segmentos (líneas que conectan las articulaciones)
    const setSeg = (id, start, end) => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('x1', start[0]); el.setAttribute('y1', start[1]);
        el.setAttribute('x2', end[0]); el.setAttribute('y2', end[1]);
      }
    };
    setSeg('k-seg1', s.j0, s.j1);
    setSeg('k-seg2', s.j1, s.j2);
    setSeg('k-seg3', s.j2, s.j3);

    // Arco y satélite
    const range = document.getElementById('k-range');
    if (range) range.style.opacity = s.rangeOpacity;
    const sat = document.getElementById('k-sat');
    if (sat) {
      sat.setAttribute('cx', s.sat[0]);
      sat.setAttribute('cy', s.sat[1]);
      sat.style.opacity = s.sat[2];
    }
  };

  const areas = {
    movilidad: { title: 'Más libertad en\ntu día a día.', kicker: 'LO COTIDIANO TAMBIÉN IMPORTA', description: 'Si buscas orientación sobre tu movilidad o tus actividades cotidianas, puedes empezar por contarle al equipo qué te gustaría retomar.', tags: ['Vida cotidiana', 'Movimiento'], interest: 'Movilidad y bienestar', art: 'ENCONTRAR TU EQUILIBRIO' },
    deporte: { title: 'Volver a lo que\nte mueve.', kicker: 'TU ACTIVIDAD, TU PUNTO DE PARTIDA', description: 'Si practicas una actividad física, consulta con FISIOPRO qué atención ofrece para acompañar tus objetivos y cómo solicitar una valoración.', tags: ['Actividad física', 'Objetivos personales'], interest: 'Actividad física y deporte', art: 'CADA MOVIMIENTO CUENTA' },
    recuperacion: { title: 'Darle espacio\na tu proceso.', kicker: 'CONVERSAR ANTES DE COMENZAR', description: 'Si estás en un proceso de recuperación, consulta qué servicios están disponibles y qué información necesita el profesional para valorar tu caso.', tags: ['Valoración', 'Atención individual'], interest: 'Procesos de recuperación', art: 'A TU PROPIO RITMO' },
    orientacion: { title: 'El primer paso\nes preguntar.', kicker: 'NO NECESITAS TENER TODAS LAS RESPUESTAS', description: 'Si no sabes qué atención necesitas, está bien. Escribe al equipo para conocer sus servicios y recibir orientación sobre cómo solicitar tu primera cita.', tags: ['Primera visita', 'Orientación'], interest: 'Quiero orientación', art: 'EMPEZAR ES UN MOVIMIENTO' },
  };
  let selectedArea = 'movilidad';
  const tabs = Array.from(document.querySelectorAll('[data-service]'));
  const panel = document.getElementById('service-panel');
  const selectArea = key => {
    const area = areas[key];
    selectedArea = key;
    tabs.forEach(tab => { const active = tab.dataset.service === key; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `tab-${key}`);
    panel.dataset.mode = key;
    document.getElementById('service-kicker').textContent = area.kicker;
    const title = document.getElementById('service-title');
    title.replaceChildren();
    area.title.split('\n').forEach((line, index) => { if (index) title.append(document.createElement('br')); title.append(document.createTextNode(line)); });
    document.getElementById('service-description').textContent = area.description;
    document.querySelector('.art-caption').textContent = area.art;
    document.getElementById('service-tags').replaceChildren(...area.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    
    // Coordinar movimiento articulado
    updateKinematics(key);

    panel.classList.remove('panel-changing');
    requestAnimationFrame(() => panel.classList.add('panel-changing'));
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectArea(tab.dataset.service));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); selectArea(tabs[next].dataset.service); tabs[next].focus();
    });
  });

  const booking = document.getElementById('booking-dialog');
  const form = document.getElementById('booking-form');
  const nextButton = document.getElementById('booking-next');
  const backButton = document.getElementById('booking-back');
  const error = document.getElementById('form-error');
  let step = 0;
  let message = '';
  const showStep = (index, focus = true) => {
    step = index;
    document.querySelectorAll('[data-step]').forEach(section => {
      const isTarget = Number(section.dataset.step) === step;
      section.hidden = !isTarget;
    });

    // Actualizar barra de progreso continua: 33.3% -> 66.6% -> 100%
    const progressFill = document.getElementById('booking-progress-fill');
    if (progressFill) {
      const percentages = ['33.33%', '66.66%', '100%'];
      progressFill.style.width = percentages[step] || '33.33%';
    }

    document.querySelectorAll('[data-progress]').forEach(item => {
      const value = Number(item.dataset.progress);
      if (value === step) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
      item.classList.toggle('complete', value < step);
    });

    backButton.hidden = step === 0;
    nextButton.hidden = step === 2;
    nextButton.textContent = step === 1 ? 'Preparar mi mensaje' : 'Continuar';
    error.textContent = '';

    if (focus) {
      const current = document.querySelector(`[data-step="${step}"] legend`);
      if (current) {
        current.tabIndex = -1;
        current.focus({ preventScroll: true });
      }
      booking.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  const startBooking = interest => {
    form.reset(); message = ''; document.getElementById('copy-status').textContent = '';
    if (interest) Array.from(form.elements.interest).find(input => input.value === interest).checked = true;
    showStep(0, false); openDialog(booking);
  };
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => startBooking()));
  document.getElementById('service-cta').addEventListener('click', () => startBooking(areas[selectedArea].interest));
  form.addEventListener('change', () => { error.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 0) {
      if (!new FormData(form).get('interest')) { error.textContent = 'Selecciona un tema o elige “Quiero orientación” para continuar.'; form.querySelector('input[type=radio]').focus(); return; }
      showStep(1); return;
    }
    if (step === 1) {
      const data = new FormData(form);
      const name = String(data.get('firstName') || '').trim().replace(/\s+/g, ' ');
      message = `Hola, equipo de FISIOPRO.${name ? ` Soy ${name}.` : ''}\n\nMe gustaría consultar sobre: ${data.get('interest')}.\n${data.get('preference')}.\n\n¿Podrían indicarme la disponibilidad, el valor, la ubicación y cómo solicitar mi primera cita?\n\nGracias.`;
      document.getElementById('message-preview').textContent = message;
      document.getElementById('send-whatsapp').href = whatsappUrl(message);
      document.getElementById('copy-status').textContent = '';
      showStep(2);
    }
  });
  backButton.addEventListener('click', () => showStep(Math.max(0, step - 1)));
  booking.addEventListener('close', () => { form.reset(); message = ''; document.getElementById('message-preview').textContent = ''; document.getElementById('send-whatsapp').removeAttribute('href'); });
  const copyBtn = document.getElementById('copy-message');
  copyBtn.addEventListener('click', async () => {
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(message);
      status.textContent = '✓ Mensaje copiado en tu portapapeles. Listo para pegar en WhatsApp.';
      copyBtn.textContent = '¡Copiado!';
      setTimeout(() => { copyBtn.textContent = 'Copiar mensaje'; }, 2200);
    } catch {
      const preview = document.getElementById('message-preview');
      const range = document.createRange(); range.selectNodeContents(preview);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      preview.focus();
      status.textContent = 'Mensaje seleccionado. Usa Copiar o Ctrl+C para pegarlo en WhatsApp.';
    }
  });

  // --- Ruta de Primera Cita (Sincronización fluida con Scroll) ---
  const stepCards = Array.from(document.querySelectorAll('.step-card'));
  const progressBar = document.getElementById('journey-progress-bar');

  if (stepCards.length && progressBar) {
    const updateJourneyOnScroll = () => {
      const windowCenter = window.innerHeight * 0.55;
      let activeIndex = 0;

      stepCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // Si el centro de la tarjeta ya cruzó la línea de visión
        if (rect.top <= windowCenter) {
          activeIndex = index;
        }
      });

      // Actualizar tarjeta activa
      stepCards.forEach((card, index) => {
        card.classList.toggle('is-active', index === activeIndex);
      });

      // Progreso continuo: 0% en etapa 1, 50% en etapa 2, 100% en etapa 3
      const progressPercent = (activeIndex / (stepCards.length - 1)) * 100;
      progressBar.style.height = `${progressPercent}%`;
    };

    window.addEventListener('scroll', updateJourneyOnScroll, { passive: true });
    updateJourneyOnScroll();
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const revealNodes = document.querySelectorAll('.intro-main, .principles article, .section-heading, .service-layout, .visit-heading, .visit-steps article, .team-copy, .faq-heading, .faq-list, .contact h2');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0, rootMargin: '0px 0px -25px 0px' });
    revealNodes.forEach(node => { if (node.getBoundingClientRect().top > innerHeight) { node.classList.add('reveal-pending'); observer.observe(node); } });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { revealNodes.forEach(node => node.classList.add('is-visible')); observer.disconnect(); } });
  }
  // --- Microinteracción de Equilibrio Físico ---
  const heroVisual = document.getElementById('hero-visual');
  const balanceNode = document.getElementById('balance-node');
  
  if (heroVisual && balanceNode) {
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let animId = null;
    const MAX_DISPLACEMENT = 6; // Límite estricto en píxeles

    const updatePhysics = () => {
      // Amortiguación elástica hacia el objetivo (easing continuo 0.12)
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      balanceNode.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;

      // Si está casi en reposo y el objetivo es el centro, detenemos el loop
      const dist = Math.hypot(targetX - currentX, targetY - currentY);
      if (dist > 0.05) {
        animId = requestAnimationFrame(updatePhysics);
      } else {
        animId = null;
        balanceNode.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }
    };

    const startPhysicsLoop = () => {
      if (!animId) {
        animId = requestAnimationFrame(updatePhysics);
      }
    };

    heroVisual.addEventListener('pointermove', event => {
      // Solo en ratón / trackpad y cuando no haya reducción de movimiento
      if (event.pointerType !== 'mouse' || reducedMotion.matches) return;

      const rect = heroVisual.getBoundingClientRect();
      const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;   // De -1 a 1
      const normY = ((event.clientY - rect.top) / rect.height) * 2 - 1;    // De -1 a 1

      // Asignamos destino acotado entre -6px y +6px
      targetX = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, normX * MAX_DISPLACEMENT));
      targetY = Math.max(-MAX_DISPLACEMENT, Math.min(MAX_DISPLACEMENT, normY * MAX_DISPLACEMENT));

      startPhysicsLoop();
    });

    heroVisual.addEventListener('pointerleave', () => {
      // Retorno elástico suave al centro de equilibrio
      targetX = 0;
      targetY = 0;
      startPhysicsLoop();
    });
  }
})();
