// ==========================================================================
// MATCHDEVERDAD — TP3 FRONT END (IFTS 29 · GRUPO 21)
// Lógica Interactiva del Simulador de Decisiones Agénticas y Accesibilidad
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSimulator();
  initDetailsAccessibility();
  initScrollSpy();
});

/**
 * Simulador Interactivo de Decisiones Lógicas (Nivel Propone)
 */
function initSimulator() {
  const slider = document.getElementById('sim-players');
  const sliderValue = document.getElementById('sim-players-val');
  const candidatesCheck = document.getElementById('sim-candidates');
  const hoursCheck = document.getElementById('sim-hours');

  const light = document.getElementById('status-light');
  const title = document.getElementById('result-title');
  const desc = document.getElementById('result-desc');
  const actionBadge = document.getElementById('result-action-badge');

  const btnPresetR1 = document.getElementById('btn-preset-r1');
  const btnPresetR2 = document.getElementById('btn-preset-r2');
  const btnPresetEdge1 = document.getElementById('btn-preset-edge1');
  const btnPresetEdge2 = document.getElementById('btn-preset-edge2');

  if (!slider || !candidatesCheck || !hoursCheck) return;

  function evaluateLogic() {
    const confirmed = parseInt(slider.value, 10);
    const missing = 10 - confirmed;
    const hasCandidates = candidatesCheck.checked;
    const under3h = hoursCheck.checked;

    sliderValue.textContent = `${confirmed}/10`;

    // Resetear clases de luz
    light.className = 'status-indicator-light';

    if (confirmed >= 10) {
      // Estado: Cupo Completo
      light.classList.add('light-complete-active');
      title.textContent = 'Partido Completo (10/10 Jugadores)';
      desc.textContent = 'No faltan jugadores. El sistema suspende la búsqueda de candidatos y bloquea las alertas.';
      actionBadge.textContent = 'ESTADO ESTABLE · SIN ACCIÓN REQUERIDA';
      actionBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      actionBadge.style.color = '#38bdf8';
      highlightSvgPath(null);
      return;
    }

    // Faltan jugadores (missing > 0)
    if (hasCandidates) {
      // FRASE 1 (R1)
      light.classList.add('light-r1-active');
      title.textContent = `Regla R1 Activada: Proponer Candidatos (${missing} faltantes)`;
      desc.textContent = `Se detectaron ${missing} vacante(s) y existen jugadores compatibles con la zona geográfica y el horario del partido. El agente envía las fichas de recomendación al organizador.`;
      actionBadge.textContent = 'ACCIÓN: PROPONER CANDIDATOS AL ORGANIZADOR';
      actionBadge.style.background = 'rgba(34, 197, 94, 0.2)';
      actionBadge.style.color = '#22c55e';
      highlightSvgPath('r1');
    } else if (under3h && !hasCandidates) {
      // FRASE 2 (R2)
      light.classList.add('light-r2-active');
      title.textContent = `Regla R2 Activada: ALERTA DE URGENCIA (< 3 horas, 0 candidatos)`;
      desc.textContent = `Quedan menos de 3 horas para el inicio, faltan ${missing} jugador(es) y la búsqueda no arrojó candidatos compatibles. El sistema emite ALERTA PRIORITARIA al organizador SIN cancelar el partido automáticamente.`;
      actionBadge.textContent = 'ACCIÓN: ALERTA PRIORITARIA (NO CANCELA)';
      actionBadge.style.background = 'rgba(245, 158, 11, 0.2)';
      actionBadge.style.color = '#f59e0b';
      highlightSvgPath('r2');
    } else {
      // Faltan jugadores pero quedan más de 3 horas y aún no hay candidatos
      light.style.background = '#64748b';
      title.textContent = `Búsqueda Pasiva en Curso (${missing} faltantes, > 3 horas)`;
      desc.textContent = 'Aún hay tiempo operativo antes del umbral de urgencia. El agente mantiene activos los filtros de radar para nuevos usuarios conectados en la zona.';
      actionBadge.textContent = 'ESTADO: MONITOREO ACTIVO';
      actionBadge.style.background = 'rgba(100, 116, 139, 0.2)';
      actionBadge.style.color = '#94a3b8';
      highlightSvgPath(null);
    }
  }

  // Event Listeners
  slider.addEventListener('input', evaluateLogic);
  candidatesCheck.addEventListener('change', evaluateLogic);
  hoursCheck.addEventListener('change', evaluateLogic);

  // Presets
  btnPresetR1?.addEventListener('click', () => {
    slider.value = 8;
    candidatesCheck.checked = true;
    hoursCheck.checked = false;
    evaluateLogic();
  });

  btnPresetR2?.addEventListener('click', () => {
    slider.value = 7;
    candidatesCheck.checked = false;
    hoursCheck.checked = true;
    evaluateLogic();
  });

  btnPresetEdge1?.addEventListener('click', () => {
    slider.value = 9;
    candidatesCheck.checked = true;
    hoursCheck.checked = false;
    evaluateLogic();
    // Abrir caso límite en UI
    const details = document.getElementById('details-edge-r1');
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  btnPresetEdge2?.addEventListener('click', () => {
    slider.value = 6;
    candidatesCheck.checked = false;
    hoursCheck.checked = true;
    evaluateLogic();
    // Abrir caso límite en UI
    const details = document.getElementById('details-edge-r2');
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Evaluación inicial
  evaluateLogic();
}

/**
 * Resaltado interactivo de nodos SVG según la regla activa
 */
function highlightSvgPath(rule) {
  const r1Nodes = document.querySelectorAll('.svg-r1-active-target');
  const r2Nodes = document.querySelectorAll('.svg-r2-active-target');

  r1Nodes.forEach(el => {
    if (rule === 'r1') {
      el.style.filter = 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))';
      el.style.stroke = '#22c55e';
    } else {
      el.style.filter = 'none';
      el.style.stroke = '#2e4573';
    }
  });

  r2Nodes.forEach(el => {
    if (rule === 'r2') {
      el.style.filter = 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.9))';
      el.style.stroke = '#f59e0b';
    } else {
      el.style.filter = 'none';
      el.style.stroke = '#2e4573';
    }
  });
}

/**
 * Accesibilidad y sincronización para elementos <details>
 */
function initDetailsAccessibility() {
  const detailsList = document.querySelectorAll('details.solution-details');

  detailsList.forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.setAttribute('role', 'button');
    summary.setAttribute('aria-expanded', details.hasAttribute('open') ? 'true' : 'false');

    details.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    });

    summary.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        details.open = !details.open;
      }
    });
  });
}

/**
 * Resaltado dinámico del menú en scroll
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
