// ==========================================================================
// MATCHDEVERDAD — TP3 FRONT END (IFTS 29 · GRUPO 21)
// Pizarra Táctica de Fútbol 5 y Lógica Agéntica Interactiva
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTacticalBoard();
  initDetailsAccessibility();
  initScrollSpy();
});

function initTacticalBoard() {
  // Lista de jugadores de la canchita (Fútbol 5: 10 cupos)
  const roster = [
    { id: 1, name: 'Nico (Arq)', pos: 'Arquero', confirmed: true },
    { id: 2, name: 'Gonza (Def)', pos: 'Defensor', confirmed: true },
    { id: 3, name: 'Mati (Def)', pos: 'Defensor', confirmed: true },
    { id: 4, name: 'Fran (Med)', pos: 'Medio', confirmed: true },
    { id: 5, name: 'Leo (Del)', pos: 'Delantero', confirmed: true },
    { id: 6, name: 'Santi (Arq)', pos: 'Arquero', confirmed: true },
    { id: 7, name: 'Juani (Def)', pos: 'Defensor', confirmed: true },
    { id: 8, name: 'Manu (Med)', pos: 'Medio', confirmed: true },
    { id: 9, name: 'Vacante 1', pos: 'Vacante', confirmed: false },
    { id: 10, name: 'Vacante 2', pos: 'Vacante', confirmed: false }
  ];

  let timeState = '2h'; // '5h' (>3h), '2h' (<3h urgencia), '30m' (caso límite)
  let radarState = true; // true: hay candidatos en zona; false: 0 candidatos

  const slotsContainer = document.getElementById('interactive-slots');
  const quorumDisplay = document.getElementById('sim-quorum-text');
  const timeButtons = document.querySelectorAll('.time-btn');
  const radarToggleBtn = document.getElementById('radar-toggle-btn');

  const beacon = document.getElementById('agent-beacon');
  const outputTitle = document.getElementById('agent-output-title');
  const outputBody = document.getElementById('agent-output-body');
  const candidateBox = document.getElementById('candidate-preview');
  const noCancelBadge = document.getElementById('no-cancel-badge');

  const btnPresetR1 = document.getElementById('sim-preset-r1');
  const btnPresetR2 = document.getElementById('sim-preset-r2');
  const btnPresetEdge1 = document.getElementById('sim-preset-edge1');
  const btnPresetEdge2 = document.getElementById('sim-preset-edge2');

  // Renderizar las 10 camisetas interactivas
  function renderSlots() {
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';

    roster.forEach((player, index) => {
      const slot = document.createElement('div');
      slot.className = `tactical-player-slot ${player.confirmed ? '' : 'slot-empty'}`;
      slot.setAttribute('role', 'button');
      slot.setAttribute('tabindex', '0');
      slot.setAttribute('aria-label', `Jugador ${index + 1}: ${player.confirmed ? player.name : 'Vacante disponible'}`);

      slot.innerHTML = `
        <div class="slot-dorsal">${index + 1}</div>
        <div class="slot-player-name">${player.confirmed ? player.name : '¿FALTA?'}</div>
      `;

      // Clic para dar de baja o confirmar jugador
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

  // Evaluar la lógica del agente
  function evaluateTactics() {
    const confirmedCount = roster.filter(p => p.confirmed).length;
    const missingCount = 10 - confirmedCount;

    if (quorumDisplay) {
      quorumDisplay.innerHTML = `QUÓRUM: <strong>${confirmedCount} / 10</strong> ${missingCount > 0 ? `(FALTAN ${missingCount})` : '· COMPLETO'}`;
    }

    // Resetear beacon
    if (beacon) beacon.className = 'status-beacon';
    if (noCancelBadge) noCancelBadge.style.display = 'none';
    if (candidateBox) candidateBox.style.display = 'none';

    // CASO 1: PARTIDO COMPLETO (10 de 10)
    if (missingCount === 0) {
      if (beacon) beacon.classList.add('beacon-cyan');
      if (outputTitle) outputTitle.textContent = '¡EQUIPO COMPLETO! (10 / 10 CONFIRMADOS)';
      if (outputBody) {
        outputBody.innerHTML = 'Los diez jugadores están confirmados en la planilla. El sistema suspende la búsqueda de candidatos y <strong>bloquea cualquier alerta de urgencia</strong>. El partido está listo para jugarse.';
      }
      return;
    }

    // Faltan jugadores:
    // CASO 2: FRASE 1 (R1) -> Faltan y hay candidatos compatibles en la zona
    if (radarState) {
      if (beacon) beacon.classList.add('status-beacon'); // verde
      if (outputTitle) outputTitle.textContent = `REGLA R1 ACTIVADA: PROPONER CANDIDATOS (${missingCount} VACANTES)`;
      if (outputBody) {
        outputBody.innerHTML = `Faltan <strong>${missingCount} jugador(es)</strong> y el radar detectó postulantes compatibles en un radio de 5 km con disponibilidad horaria. El agente <strong>MatchFinder</strong> propone los mejores perfiles directamente al organizador.`;
      }
      if (candidateBox) {
        candidateBox.style.display = 'flex';
      }
      return;
    }

    // CASO 3: FRASE 2 (R2) -> Faltan, NO hay candidatos y quedan menos de 3 horas
    const isUnderThreeHours = (timeState === '2h' || timeState === '30m');
    if (!radarState && isUnderThreeHours) {
      if (beacon) beacon.classList.add('beacon-amber');
      const timeLabel = timeState === '2h' ? '2 horas' : '30 minutos';
      if (outputTitle) outputTitle.textContent = `REGLA R2 ACTIVADA: ALERTA DE URGENCIA (< 3 HORAS, 0 CANDIDATOS)`;
      if (outputBody) {
        outputBody.innerHTML = `Quedan <strong>${timeLabel}</strong> para el pitazo inicial, faltan <strong>${missingCount} jugador(es)</strong> y no hay candidatos disponibles en la zona. El sistema emite una <strong>ALERTA PRIORITARIA</strong> al capitán con opciones de emergencia (jugar 4 vs 4 o contactar al predio).`;
      }
      if (noCancelBadge) {
        noCancelBadge.style.display = 'inline-block';
      }
      return;
    }

    // CASO 4: Faltan, NO hay candidatos pero quedan más de 3 horas (> 3hs)
    if (beacon) beacon.style.background = '#64748b';
    if (outputTitle) outputTitle.textContent = `BÚSQUEDA PASIVA (5 HORAS RESTANTES · ${missingCount} FALTANTES)`;
    if (outputBody) {
      outputBody.innerHTML = 'Aún restan más de 3 horas para el turno. El sistema no genera alertas de urgencia y mantiene la escucha activa de nuevos usuarios en el barrio.';
    }
  }

  // Controles de Tiempo
  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeState = btn.getAttribute('data-time');
      evaluateTactics();
    });
  });

  // Switch de Radar
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

  // Presets de Evaluación Rápida
  btnPresetR1?.addEventListener('click', () => {
    roster.forEach((p, idx) => { p.confirmed = idx < 8; });
    radarState = true;
    timeState = '5h';
    updateControlsUI();
    renderSlots();
    evaluateTactics();
  });

  btnPresetR2?.addEventListener('click', () => {
    roster.forEach((p, idx) => { p.confirmed = idx < 7; });
    radarState = false;
    timeState = '2h';
    updateControlsUI();
    renderSlots();
    evaluateTactics();
  });

  btnPresetEdge1?.addEventListener('click', () => {
    roster.forEach((p, idx) => { p.confirmed = idx < 9; });
    radarState = true;
    timeState = '2h';
    updateControlsUI();
    renderSlots();
    evaluateTactics();
    const details = document.getElementById('details-edge-r1');
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  btnPresetEdge2?.addEventListener('click', () => {
    roster.forEach((p, idx) => { p.confirmed = idx < 6; });
    radarState = false;
    timeState = '30m';
    updateControlsUI();
    renderSlots();
    evaluateTactics();
    const details = document.getElementById('details-edge-r2');
    if (details) {
      details.open = true;
      details.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  function updateControlsUI() {
    timeButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-time') === timeState);
    });
    if (radarToggleBtn) {
      if (radarState) {
        radarToggleBtn.textContent = 'ACTIVO (Candidatos en 5 km)';
        radarToggleBtn.classList.add('active');
      } else {
        radarToggleBtn.textContent = 'VACÍO (Sin candidatos en zona)';
        radarToggleBtn.classList.remove('active');
      }
    }
  }

  // Inicialización
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
