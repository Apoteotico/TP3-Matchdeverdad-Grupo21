// ==========================================================================
// MATCHDEVERDAD — TP3 FRONT END (IFTS 29 · GRUPO 21)
// Controlador de Diagramas Interactivos SVG y Pizarra Táctica de Fútbol 5
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initDiagramR1();
  initDiagramR2();
  initTacticalBoard();
  initDetailsAccessibility();
  initScrollSpy();
});

/* ==========================================================================
   DIAGRAMA 1 INTERACTIVO (FRASE 1 · R1)
   ========================================================================== */
function initDiagramR1() {
  const svg = document.getElementById('svg-diagram-r1');
  const btnStandard = document.getElementById('r1-mode-standard');
  const btnEdge = document.getElementById('r1-mode-edge');
  const btnStepPrev = document.getElementById('r1-step-prev');
  const btnStepNext = document.getElementById('r1-step-next');

  const inspectorTag = document.getElementById('r1-inspector-tag');
  const inspectorTitle = document.getElementById('r1-inspector-title');
  const inspectorInputs = document.getElementById('r1-inspector-inputs');
  const inspectorLogic = document.getElementById('r1-inspector-logic');
  const inspectorRationale = document.getElementById('r1-inspector-rationale');

  if (!svg) return;

  const nodes = [
    {
      id: 'r1-n1',
      tag: 'Paso 01 · Inicio del Evento',
      title: 'Quórum Abierto en Cancha',
      inputs: 'Planilla del partido con recuento de confirmados y horario fijado.',
      logic: 'Comprueba periódicamente el estado de confirmaciones vs el quórum reglamentario de 10 jugadores.',
      rationale: 'Punto de partida del sistema: monitoriza la convocatoria antes del pitazo inicial.'
    },
    {
      id: 'r1-n2',
      tag: 'Paso 02 · Evaluación 1',
      title: '¿Faltan Jugadores? (< 10)',
      inputs: 'Recuento de jugadores con confirmación afirmativa en la app.',
      logic: 'Condición: Confirmados < 10. Si es NO (10/10), el partido se marca completo y no busca más.',
      rationale: 'Evita sobreinvitaciones o duplicación de postulantes cuando la cancha ya tiene sus 10 cupos.'
    },
    {
      id: 'r1-n3',
      tag: 'Paso 03 · Evaluación 2',
      title: '¿Candidatos Compatibles en Zona y Horario?',
      inputs: 'Coordenadas GPS del predio deportivo (&le; 5 km) y franja horaria coincidente (&plusmn; 15 min).',
      logic: 'Condición: Padrón de jugadores cercanos activos > 0. Ordena por índice de puntualidad y reputación.',
      rationale: 'Filtra únicamente a quienes realmente puedan llegar a la cancha en tiempo y forma.'
    },
    {
      id: 'r1-n4',
      tag: 'Paso 04 · Acción Agéntica R1',
      title: 'Proponer Candidatos al Organizador',
      inputs: 'Top 3 postulantes compatibles seleccionados por el algoritmo.',
      logic: 'Genera tarjetas de sugerencia con foto, distancia y posición, con botón de invitar en 1 clic.',
      rationale: 'Cumple taxativamente la FRASE 1 (R1). El sistema propone; el capitán toma la decisión final.'
    },
    {
      id: 'r1-n5',
      tag: 'Caso Límite · Intervención Humana',
      title: 'Descarte o Sin Postulantes en 5 km',
      inputs: 'Rechazo explícito del organizador o radio de 5 km agotado.',
      logic: 'Bifurcación de contingencia: abre radar a 10 km o emite link temporal para WhatsApp de amigos externos.',
      rationale: 'Criterio Propone (Supera): el sistema no se traba ante la excepción; escala con soporte humano.'
    }
  ];

  let currentStep = 0;
  let activeMode = 'standard'; // 'standard' | 'edge'

  function updateInspector(nodeData) {
    if (!nodeData) return;
    inspectorTag.textContent = nodeData.tag;
    inspectorTitle.textContent = nodeData.title;
    inspectorInputs.textContent = nodeData.inputs;
    inspectorLogic.textContent = nodeData.logic;
    inspectorRationale.textContent = nodeData.rationale;
  }

  function applyMode(mode) {
    activeMode = mode;
    btnStandard.classList.toggle('active', mode === 'standard');
    btnEdge.classList.toggle('active', mode === 'edge');

    const allNodes = svg.querySelectorAll('.flow-node');
    const allPaths = svg.querySelectorAll('path.flow-path');

    allNodes.forEach(n => {
      n.classList.remove('node-active', 'node-edge-active');
    });
    allPaths.forEach(p => {
      p.classList.remove('path-active', 'path-edge-active');
    });

    if (mode === 'standard') {
      // Nodos estándar: n1, n2, n3, n4
      ['r1-n1', 'r1-n2', 'r1-n3', 'r1-n4'].forEach(id => {
        svg.querySelector(`#${id}`)?.classList.add('node-active');
      });
      svg.querySelectorAll('.r1-path-standard').forEach(p => p.classList.add('path-active'));
      updateInspector(nodes[3]); // mostrar la acción final
    } else {
      // Modo excepción: n1, n2, n3, n5
      ['r1-n1', 'r1-n2', 'r1-n3', 'r1-n5'].forEach(id => {
        svg.querySelector(`#${id}`)?.classList.add('node-edge-active');
      });
      svg.querySelectorAll('.r1-path-edge').forEach(p => p.classList.add('path-edge-active'));
      updateInspector(nodes[4]); // mostrar caso límite
    }
  }

  // Click en nodos del SVG
  nodes.forEach(nodeData => {
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      el.addEventListener('click', () => {
        svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
        el.classList.add(nodeData.id === 'r1-n5' ? 'node-edge-active' : 'node-active');
        updateInspector(nodeData);
      });
    }
  });

  btnStandard?.addEventListener('click', () => applyMode('standard'));
  btnEdge?.addEventListener('click', () => applyMode('edge'));

  btnStepNext?.addEventListener('click', () => {
    currentStep = (currentStep + 1) % nodes.length;
    const nodeData = nodes[currentStep];
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
      el.classList.add(nodeData.id === 'r1-n5' ? 'node-edge-active' : 'node-active');
      updateInspector(nodeData);
    }
  });

  btnStepPrev?.addEventListener('click', () => {
    currentStep = (currentStep - 1 + nodes.length) % nodes.length;
    const nodeData = nodes[currentStep];
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
      el.classList.add(nodeData.id === 'r1-n5' ? 'node-edge-active' : 'node-active');
      updateInspector(nodeData);
    }
  });

  // Inicialización
  applyMode('standard');
}

/* ==========================================================================
   DIAGRAMA 2 INTERACTIVO (FRASE 2 · R2)
   ========================================================================== */
function initDiagramR2() {
  const svg = document.getElementById('svg-diagram-r2');
  const btnStandard = document.getElementById('r2-mode-standard');
  const btnEdge = document.getElementById('r2-mode-edge');
  const btnStepPrev = document.getElementById('r2-step-prev');
  const btnStepNext = document.getElementById('r2-step-next');

  const inspectorTag = document.getElementById('r2-inspector-tag');
  const inspectorTitle = document.getElementById('r2-inspector-title');
  const inspectorInputs = document.getElementById('r2-inspector-inputs');
  const inspectorLogic = document.getElementById('r2-inspector-logic');
  const inspectorRationale = document.getElementById('r2-inspector-rationale');

  if (!svg) return;

  const nodes = [
    {
      id: 'r2-n1',
      tag: 'Paso 01 · Temporizador del Partido',
      title: 'Monitoreo de Cuenta Regresiva',
      inputs: 'Hora de inicio del partido pactada en la cancha vs reloj de tiempo real.',
      logic: 'Calcula constantemente el tiempo restante en minutos hasta el inicio del turno.',
      rationale: 'El control temporal es la variable desencadenante del estado de urgencia operativa.'
    },
    {
      id: 'r2-n2',
      tag: 'Paso 02 · Evaluación 1',
      title: '¿Faltan Jugadores?',
      inputs: 'Padrón de confirmaciones activas en la app.',
      logic: 'Condición: Confirmados < 10. Si el equipo está completo (10/10), finaliza el monitoreo sin alerta.',
      rationale: 'Si no hay vacantes, el tiempo no constituye una amenaza para el partido.'
    },
    {
      id: 'r2-n3',
      tag: 'Paso 03 · Evaluación 2',
      title: '¿Quedan Menos de 3 Horas? (< 180 min)',
      inputs: 'Minutos restantes para el turno de la cancha.',
      logic: 'Condición: TiempoRestante < 180 min. Si es NO (> 3hs), permanece en búsqueda ordinaria pasiva.',
      rationale: 'Establece la frontera crítica de urgencia definida taxativamente en la FRASE 2.'
    },
    {
      id: 'r2-n4',
      tag: 'Paso 04 · Evaluación 3',
      title: '¿Hay Candidatos Compatibles?',
      inputs: 'Resultado de la consulta al radar barrial de jugadores libres.',
      logic: 'Condición: Candidatos == 0. Si hubiera candidatos, derivaría a la Regla R1.',
      rationale: 'La conjunción de las 3 condiciones desencadena el protocolo de contingencia.'
    },
    {
      id: 'r2-n5',
      tag: 'Paso 05 · Acción Agéntica R2',
      title: 'Alerta al Organizador · NO CANCELA',
      inputs: 'Dispositivo del capitán (notificación Push / WhatsApp).',
      logic: 'Emite alerta urgente con 3 alternativas tácticas: jugar 4 vs 4, ampliar radar o dividir costo. RESERVA FIRME.',
      rationale: 'Cumple la restricción esencial de R2: jamás cancela de manera autónoma, salvando la seña del grupo.'
    },
    {
      id: 'r2-n6',
      tag: 'Caso Límite · Intervención Humana',
      title: 'Sin Respuesta del Capitán a 45 min',
      inputs: 'Alerta sin confirmación de lectura en los últimos 45 minutos antes del turno.',
      logic: 'Escalamiento automático: aviso espejo al subcapitán y mensaje a la administración del predio.',
      rationale: 'Criterio Propone: resuelve el caso límite cuando el organizador no responde (viaje, sin batería).'
    }
  ];

  let currentStep = 0;

  function updateInspector(nodeData) {
    if (!nodeData) return;
    inspectorTag.textContent = nodeData.tag;
    inspectorTitle.textContent = nodeData.title;
    inspectorInputs.textContent = nodeData.inputs;
    inspectorLogic.textContent = nodeData.logic;
    inspectorRationale.textContent = nodeData.rationale;
  }

  function applyMode(mode) {
    btnStandard.classList.toggle('active', mode === 'standard');
    btnEdge.classList.toggle('active', mode === 'edge');

    const allNodes = svg.querySelectorAll('.flow-node');
    const allPaths = svg.querySelectorAll('path.flow-path');

    allNodes.forEach(n => {
      n.classList.remove('node-active', 'node-edge-active');
    });
    allPaths.forEach(p => {
      p.classList.remove('path-active', 'path-edge-active');
    });

    if (mode === 'standard') {
      ['r2-n1', 'r2-n2', 'r2-n3', 'r2-n4', 'r2-n5'].forEach(id => {
        svg.querySelector(`#${id}`)?.classList.add('node-edge-active');
      });
      svg.querySelectorAll('.r2-path-standard').forEach(p => p.classList.add('path-edge-active'));
      updateInspector(nodes[4]); // Acción R2
    } else {
      ['r2-n1', 'r2-n2', 'r2-n3', 'r2-n4', 'r2-n5', 'r2-n6'].forEach(id => {
        svg.querySelector(`#${id}`)?.classList.add('node-edge-active');
      });
      svg.querySelectorAll('.r2-path-edge').forEach(p => p.classList.add('path-edge-active'));
      updateInspector(nodes[5]); // Caso límite 45 min
    }
  }

  nodes.forEach(nodeData => {
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      el.addEventListener('click', () => {
        svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
        el.classList.add('node-edge-active');
        updateInspector(nodeData);
      });
    }
  });

  btnStandard?.addEventListener('click', () => applyMode('standard'));
  btnEdge?.addEventListener('click', () => applyMode('edge'));

  btnStepNext?.addEventListener('click', () => {
    currentStep = (currentStep + 1) % nodes.length;
    const nodeData = nodes[currentStep];
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
      el.classList.add('node-edge-active');
      updateInspector(nodeData);
    }
  });

  btnStepPrev?.addEventListener('click', () => {
    currentStep = (currentStep - 1 + nodes.length) % nodes.length;
    const nodeData = nodes[currentStep];
    const el = svg.querySelector(`#${nodeData.id}`);
    if (el) {
      svg.querySelectorAll('.flow-node').forEach(n => n.classList.remove('node-active', 'node-edge-active'));
      el.classList.add('node-edge-active');
      updateInspector(nodeData);
    }
  });

  applyMode('standard');
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
  const noCancelBadge = document.getElementById('no-cancel-badge');

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
    if (noCancelBadge) noCancelBadge.style.display = 'none';
    if (candidateBox) candidateBox.style.display = 'none';

    // CASO 1: 10 de 10
    if (missingCount === 0) {
      if (beacon) beacon.classList.add('beacon-cyan');
      if (outputTitle) outputTitle.textContent = '¡EQUIPO COMPLETO! (10 / 10 CONFIRMADOS)';
      if (outputBody) {
        outputBody.innerHTML = 'Los diez jugadores están en planilla. La búsqueda y las alertas de urgencia quedan desactivadas. El partido se juega normalmente.';
      }
      return;
    }

    // CASO 2: R1 -> Faltan y hay candidatos
    if (radarState) {
      if (beacon) beacon.classList.add('status-beacon');
      if (outputTitle) outputTitle.textContent = `REGLA R1 ACTIVADA: PROPONER CANDIDATOS (${missingCount} FALTANTES)`;
      if (outputBody) {
        outputBody.innerHTML = `Faltan <strong>${missingCount} jugador(es)</strong> y el radar encontró postulantes en &le; 5 km disponibles en el horario. El agente propone a los mejores candidatos directamente al capitán.`;
      }
      if (candidateBox) candidateBox.style.display = 'flex';
      return;
    }

    // CASO 3: R2 -> Faltan, NO hay candidatos y quedan menos de 3 horas
    const isUnderThreeHours = (timeState === '2h' || timeState === '30m');
    if (!radarState && isUnderThreeHours) {
      if (beacon) beacon.classList.add('beacon-amber');
      const timeLabel = timeState === '2h' ? '2 horas' : '30 minutos';
      if (outputTitle) outputTitle.textContent = `REGLA R2 ACTIVADA: ALERTA DE URGENCIA (< 3 HORAS, 0 CANDIDATOS)`;
      if (outputBody) {
        outputBody.innerHTML = `Restan <strong>${timeLabel}</strong> para el partido, faltan <strong>${missingCount} jugador(es)</strong> y no hay candidatos disponibles. El sistema emite una <strong>ALERTA PRIORITARIA</strong> con alternativas (jugar 4 vs 4 o contactar al predio).`;
      }
      if (noCancelBadge) noCancelBadge.style.display = 'inline-block';
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
