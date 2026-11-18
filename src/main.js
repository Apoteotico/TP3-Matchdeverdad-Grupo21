// ==========================================================================
// MATCHDEVERDAD — TP3 FRONT END (IFTS 29 · GRUPO 21)
// Controlador del Árbol de Flujo Táctico y Pizarra de Fútbol 5
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initFlowTree('flow-1');
  initFlowTree('flow-2');
  initTacticalBoard();
  initDetailsAccessibility();
  initScrollSpy();
});

/* ==========================================================================
   SISTEMA DE DIAGRAMAS INTERACTIVOS (HTML/CSS TREE)
   ========================================================================== */
function initFlowTree(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll('.flow-tab-btn');
  const tree = container.querySelector('.flow-tree');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode'); // 'all' | 'yes' | 'no'
      tree.setAttribute('data-view', mode);
    });
  });
}

/* ==========================================================================
   SIMULADOR TÁCTICO: "LA PIZARRA DEL CAPITÁN"
   ========================================================================== */
function initTacticalBoard() {
  const roster = [
    { id: 1, name: 'Nico (Arq)', confirmed: true },
    { id: 2, name: 'Gonza (Def)', confirmed: true },
    { id: 3, name: 'Mati (Def)', confirmed: true },
    { id: 4, name: 'Fran (Med)', confirmed: true },
    { id: 5, name: 'Leo (Del)', confirmed: true },
    { id: 6, name: 'Santi (Arq)', confirmed: true },
    { id: 7, name: 'Juani (Def)', confirmed: true },
    { id: 8, name: 'Manu (Med)', confirmed: true },
    { id: 9, name: 'Vacante 1', confirmed: false },
    { id: 10, name: 'Vacante 2', confirmed: false }
  ];

  let timeState = '2h';
  let radarState = true;

  const slotsContainer = document.getElementById('interactive-slots');
  const quorumDisplay = document.getElementById('sim-quorum-text');
  const timeButtons = document.querySelectorAll('.time-btn');
  const radarToggleBtn = document.getElementById('radar-toggle-btn');

  const beacon = document.getElementById('agent-beacon');
  const outputTitle = document.getElementById('agent-output-title');
  const outputBody = document.getElementById('agent-output-body');
  const candidateBox = document.getElementById('candidate-preview');
  const r2AlertBanner = document.getElementById('r2-alert-banner');

  function renderSlots() {
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';

    roster.forEach((player, index) => {
      const slot = document.createElement('div');
      slot.className = `tactical-player-slot ${player.confirmed ? '' : 'slot-empty'}`;
      slot.setAttribute('role', 'button');
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('aria-label', `Camiseta ${index + 1}: ${player.confirmed ? player.name : 'Vacante'}`);

      slot.innerHTML = `
        <div class="slot-dorsal">${index + 1}</div>
        <div class="slot-player-name">${player.confirmed ? player.name : '¿FALTA?'}</div>
      `;

      slot.addEventListener('click', () => {
        player.confirmed = !player.confirmed;
        if (player.confirmed && player.name.startsWith('Vacante')) {
          player.name = `Refuerzo #${index + 1}`;
        }
        renderSlots();
        evaluateTactics();
      });

      slot.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          slot.click();
        }
      });

      slotsContainer.appendChild(slot);
    });
  }

  function evaluateTactics() {
    const confirmedCount = roster.filter(p => p.confirmed).length;
    const missingCount = 10 - confirmedCount;

    if (quorumDisplay) {
      quorumDisplay.innerHTML = `QUÓRUM: <strong>${confirmedCount} / 10</strong> ${missingCount > 0 ? `(FALTAN ${missingCount})` : '· COMPLETO'}`;
    }

    if (beacon) beacon.className = 'status-beacon';
    if (r2AlertBanner) r2AlertBanner.style.display = 'none';
    if (candidateBox) candidateBox.style.display = 'none';

    // CASO 1: 10 de 10
    if (missingCount === 0) {
      if (beacon) beacon.classList.add('beacon-cyan');
      if (outputTitle) outputTitle.textContent = '¡EQUIPO COMPLETO! (10 / 10 CONFIRMADOS)';
      if (outputBody) {
        outputBody.innerHTML = 'Los diez jugadores están confirmados en planilla. La búsqueda y las alertas de urgencia quedan desactivadas. El partido se juega normalmente.';
      }
      return;
    }

    // CASO 2: R1 -> Faltan y hay candidatos
    if (radarState) {
      if (beacon) beacon.classList.add('status-beacon');
      if (outputTitle) outputTitle.textContent = `REGLA R1 ACTIVADA: PROPONER CANDIDATOS (${missingCount} FALTANTES)`;
      if (outputBody) {
        outputBody.innerHTML = `Faltan <strong>${missingCount} jugador(es)</strong> y el radar encontró postulantes en un radio &le; 5 km disponibles en el horario. El agente propone a los mejores perfiles directamente al capitán.`;
      }
      if (candidateBox) candidateBox.style.display = 'flex';
      return;
    }

    // CASO 3: R2 -> Faltan, NO hay candidatos y quedan menos de 3 horas
    const isUnderThreeHours = (timeState === '2h' || timeState === '30m');
    if (!radarState && isUnderThreeHours) {
      if (beacon) beacon.classList.add('beacon-amber');
      const timeLabel = timeState === '2h' ? '2 horas' : '30 minutos';
      if (outputTitle) outputTitle.textContent = `REGLA R2 ACTIVADA: ALERTA DE URGENCIA (< 3 HORAS)`;
      if (outputBody) {
        outputBody.innerHTML = `Restan <strong>${timeLabel}</strong> para el pitazo inicial, faltan <strong>${missingCount} jugador(es)</strong> y no hay candidatos disponibles en la zona. El sistema emite una <strong>ALERTA PRIORITARIA</strong> al capitán con opciones de emergencia (jugar 4 vs 4 o contactar al predio).`;
      }
      if (r2AlertBanner) r2AlertBanner.style.display = 'flex';
      return;
    }

    // CASO 4: Faltan pero quedan más de 3 horas
    if (beacon) beacon.style.background = '#64748b';
    if (outputTitle) outputTitle.textContent = `BÚSQUEDA PASIVA (4 HORAS RESTANTES · ${missingCount} FALTANTES)`;
    if (outputBody) {
      outputBody.innerHTML = 'Quedan más de 3 horas para el turno. El sistema no emite alertas de urgencia y mantiene activo el radar pasivo.';
    }
  }

  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeState = btn.getAttribute('data-time');
      evaluateTactics();
    });
  });

  radarToggleBtn?.addEventListener('click', () => {
    radarState = !radarState;
    if (radarState) {
      radarToggleBtn.textContent = 'ACTIVO (Candidatos en 5 km)';
      radarToggleBtn.classList.add('active');
    } else {
      radarToggleBtn.textContent = 'VACÍO (Sin candidatos en zona)';
      radarToggleBtn.classList.remove('active');
    }
    evaluateTactics();
  });

  renderSlots();
  evaluateTactics();
}

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

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

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
