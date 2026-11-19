// ==========================================================================
// MATCHDEVERDAD — TP3 FRONT END (IFTS 29 · GRUPO 21)
// Diagramas de flujo interactivos y Pizarra del Capitán (La Cantera F5)
//
// Variables proposicionales del simulador (sorteo S07-A):
//   p = faltan jugadores            (confirmados < 10)
//   q = hay candidatos compatibles  (con la zona y el horario)
//   r = quedan menos de tres horas  (minutos restantes < 180, estricto)
//   s = el sistema propone candidatos al organizador
//   t = el sistema alerta al organizador
//   u = el sistema cancela el partido automáticamente
//
//   R1: (p ∧ q) → s
//   R2: (p ∧ r ∧ ¬q) → (t ∧ ¬u)
// ==========================================================================

const TEAM_SIZE = 10;
const URGENCY_LIMIT_MIN = 180;
const ESCALATION_MIN = 45;

document.addEventListener('DOMContentLoaded', () => {
  initFlowTree('flow-1');
  initFlowTree('flow-2');
  initTacticalBoard();
  initDetailsAccessibility();
  initScrollSpy();
  initScrollToTop();
});

/* ==========================================================================
   LÓGICA PROPOSICIONAL (pura, sin DOM): fácil de verificar con la tabla de verdad
   ========================================================================== */
export function evaluateRules({ confirmed, minutesLeft, hasCandidates }) {
  const p = confirmed < TEAM_SIZE;
  const q = Boolean(hasCandidates);
  const r = minutesLeft < URGENCY_LIMIT_MIN;

  const r1Antecedent = p && q;
  const r2Antecedent = p && r && !q;

  return {
    p, q, r,
    r1Antecedent,
    r2Antecedent,
    s: r1Antecedent,          // R1 obliga a proponer
    t: r2Antecedent,          // R2 obliga a alertar
    u: false                  // R2 prohíbe cancelar: ninguna regla cancela
  };
}

/* ==========================================================================
   DIAGRAMAS INTERACTIVOS (árbol HTML/CSS): Ver Flujo Completo · Camino SÍ · Camino NO
   ========================================================================== */
function initFlowTree(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const buttons = container.querySelectorAll('.flow-tab-btn');
  const tree = container.querySelector('.flow-tree');
  if (!tree) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      tree.setAttribute('data-view', btn.getAttribute('data-mode')); // all | yes | no
    });
  });
}

/* ==========================================================================
   SIMULADOR TÁCTICO: "LA PIZARRA DEL CAPITÁN"
   ========================================================================== */
function initTacticalBoard() {
  const slotsContainer = document.getElementById('interactive-slots');
  if (!slotsContainer) return;

  const initialRoster = () => [
    { name: 'Nico', pos: 'Arq', confirmed: true },
    { name: 'Gonza', pos: 'Def', confirmed: true },
    { name: 'Fran', pos: 'Med', confirmed: true },
    { name: 'Leo', pos: 'Del', confirmed: true },
    { name: 'Santi', pos: 'Arq', confirmed: true },
    { name: 'Mati', pos: 'Def', confirmed: true },
    { name: 'Juani', pos: 'Med', confirmed: true },
    { name: 'Manu', pos: 'Del', confirmed: true },
    { name: 'Vacante', pos: '', confirmed: false },
    { name: 'Vacante', pos: '', confirmed: false }
  ];

  let roster = initialRoster();
  let minutesLeft = 120;
  let hasCandidates = true;

  const $ = id => document.getElementById(id);
  const quorumDisplay = $('sim-quorum-text');
  const ledConfirmed = $('led-confirmed');
  const ledMissing = $('led-missing');
  const ledTime = $('led-time');
  const timeButtons = document.querySelectorAll('.time-btn');
  const radarToggleBtn = $('radar-toggle-btn');
  const resetBtn = $('sim-reset-btn');

  const beacon = $('agent-beacon');
  const panel = $('agent-panel');
  const outputTitle = $('agent-output-title');
  const outputBody = $('agent-output-body');
  const candidateBox = $('candidate-preview');
  const r2AlertBanner = $('r2-alert-banner');
  const inviteBtn = $('invite-btn');
  const inviteFeedback = $('invite-feedback');
  const formulaBar = $('agent-logic-formula');
  const candName = $('candidate-name');
  const candMeta = $('candidate-meta');
  const candAvatar = $('candidate-avatar');

  // Candidatos compatibles que propone el radar (R1)
  const invitePool = [
    { short: 'Facundo', name: 'Facundo "El Rayo" M.', meta: 'A 1,8 km · 4,9★ puntualidad · Delantero libre' },
    { short: 'Lucas', name: 'Lucas "Muro" B.', meta: 'A 2,4 km · 4,8★ puntualidad · Defensor libre' },
    { short: 'Tomás', name: 'Tomás "Manos" R.', meta: 'A 3,1 km · 4,7★ puntualidad · Arquero libre' },
    { short: 'Bruno', name: 'Bruno "Pulmón" S.', meta: 'A 4,0 km · 4,9★ puntualidad · Medio libre' }
  ];
  let inviteIndex = 0;

  function paintCandidate() {
    const cand = invitePool[inviteIndex % invitePool.length];
    if (candName) candName.textContent = cand.name;
    if (candMeta) candMeta.textContent = cand.meta;
    if (candAvatar) candAvatar.textContent = cand.short.charAt(0);
  }

  const pad = n => String(n).padStart(2, '0');
  const formatClock = mins => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
  const humanTime = mins => {
    if (mins >= 60 && mins % 60 === 0) return `${mins / 60} ${mins === 60 ? 'hora' : 'horas'}`;
    return `${mins} minutos`;
  };

  /* ---------- Camisetas ---------- */
  function renderSlots() {
    slotsContainer.innerHTML = '';

    roster.forEach((player, index) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = `tactical-player-slot ${player.confirmed ? '' : 'slot-empty'}`;
      slot.setAttribute('aria-pressed', String(player.confirmed));
      slot.setAttribute(
        'aria-label',
        player.confirmed
          ? `Camiseta ${index + 1}: ${player.name} confirmado. Tocá para simular una baja.`
          : `Camiseta ${index + 1}: vacante. Tocá para confirmar un jugador.`
      );

      slot.innerHTML = `
        <span class="shirt" aria-hidden="true"><span class="slot-dorsal">${player.confirmed ? index + 1 : '?'}</span></span>
        <span class="slot-player-name">${player.confirmed ? player.name : 'Falta'}</span>
      `;

      slot.addEventListener('click', () => {
        player.confirmed = !player.confirmed;
        if (player.confirmed && player.name === 'Vacante') player.name = `Refuerzo`;
        if (!player.confirmed && player.name === 'Refuerzo') player.name = 'Vacante';
        hideInviteFeedback();
        renderSlots();
        evaluateTactics();
        const again = slotsContainer.children[index];
        if (again) again.focus();
      });

      slotsContainer.appendChild(slot);
    });
  }

  /* ---------- Valuación proposicional ---------- */
  function setChip(id, value) {
    const chip = $(id);
    if (!chip) return;
    chip.dataset.state = String(value);
    const mark = chip.querySelector('i');
    if (mark) mark.textContent = value ? 'V' : 'F';
  }

  function setRule(id, antecedent, trueText, falseText) {
    const el = $(id);
    if (!el) return;
    el.dataset.active = String(antecedent);
    const state = el.querySelector('.prop-rule-state');
    if (state) state.textContent = antecedent ? trueText : falseText;
  }

  /* ---------- Salida del agente ---------- */
  function setBeacon(kind) {
    if (beacon) beacon.className = `status-beacon beacon-${kind}`;
    if (panel) panel.dataset.tone = kind;
  }

  const plural = n => (n > 1 ? 'es' : '');

  function evaluateTactics() {
    const confirmedCount = roster.filter(pl => pl.confirmed).length;
    const missingCount = TEAM_SIZE - confirmedCount;
    const v = evaluateRules({ confirmed: confirmedCount, minutesLeft, hasCandidates });
    const tag = bool => (bool ? 'V' : 'F');

    // Marcador LED y texto accesible
    if (ledConfirmed) ledConfirmed.textContent = `${pad(confirmedCount)}/${TEAM_SIZE}`;
    if (ledMissing) ledMissing.textContent = pad(missingCount);
    if (ledTime) {
      ledTime.textContent = formatClock(minutesLeft);
      ledTime.classList.toggle('led-amber', v.r);
      ledTime.classList.toggle('led-green', !v.r);
    }
    if (quorumDisplay) {
      quorumDisplay.textContent = `Quórum: ${confirmedCount} de ${TEAM_SIZE} confirmados${missingCount ? `, faltan ${missingCount}` : ', equipo completo'}`;
    }

    // Variables y reglas
    setChip('prop-p', v.p);
    setChip('prop-q', v.q);
    setChip('prop-r', v.r);
    setRule('prop-r1', v.r1Antecedent,
      'Antecedente: V · s = V (propone)',
      'Antecedente: F · implicación verdadera por vacuidad');
    setRule('prop-r2', v.r2Antecedent,
      'Antecedente: V · t = V, u = F (alerta sin cancelar)',
      'Antecedente: F · implicación verdadera por vacuidad');

    // Cápsula de evaluación lógica en vivo
    if (formulaBar) {
      const verdict = v.r2Antecedent
        ? `R2: (p ∧ r ∧ ¬q) → (t ∧ ¬u) [ACTIVA]`
        : v.r1Antecedent
          ? `R1: (p ∧ q) → s [ACTIVA]`
          : `R1 y R2: antecedente F [SIN ACCIÓN]`;
      formulaBar.textContent =
        `p = ${tag(v.p)} (${confirmedCount}/${TEAM_SIZE}) · q = ${tag(v.q)} (${v.q ? '≤ 5 km' : '0 postulantes'}) · r = ${tag(v.r)} (${formatClock(minutesLeft)} h) ⟹ ${verdict}`;
    }

    // Reset visual
    if (r2AlertBanner) r2AlertBanner.hidden = true;
    if (candidateBox) candidateBox.style.display = 'none';
    paintCandidate();

    // ESTADO 1 · Quórum completo (¬p)
    if (!v.p) {
      setBeacon('cyan');
      outputTitle.textContent = '¡Equipo completo! (10/10 · ¬p)';
      outputBody.innerHTML = 'Como <strong>p = F</strong>, los antecedentes de R1 y R2 son falsos (implicaciones verdaderas por vacuidad): <strong>¬s ∧ ¬t ∧ ¬u</strong>. No se proponen candidatos, no se alerta y el partido se juega normalmente.';
      return;
    }

    // ESTADOS 2A / 2B · R1: (p ∧ q) → s
    if (v.r1Antecedent) {
      setBeacon('green');
      outputTitle.textContent = 'Regla R1 activada: proponer candidatos (p ∧ q → s)';
      const lead = `Faltan <strong>${missingCount} jugador${plural(missingCount)}</strong> (p = V) y el radar encontró candidatos compatibles con la zona y el horario (q = V).`;
      outputBody.innerHTML = v.r
        ? `${lead} Quedan menos de 3 horas (r = V), pero como <strong>q = V</strong> el antecedente de R2 (¬q) es falso: <strong>prevalece R1</strong>. El agente propone postulantes de incorporación inmediata, listos para salir a cancha en menos de 3 h, sin disparar alerta de escasez.`
        : `${lead} Todavía hay margen holgado (r = F): el agente <strong>propone</strong> esos candidatos al organizador (s = V) con tiempo para que elija con calma.`;
      if (candidateBox) candidateBox.style.display = 'flex';
      return;
    }

    // ESTADOS 4A / 4B · R2: (p ∧ r ∧ ¬q) → (t ∧ ¬u)
    if (v.r2Antecedent) {
      setBeacon('amber');
      if (minutesLeft < ESCALATION_MIN) {
        outputTitle.textContent = 'Regla R2 + escalamiento humano (30 min restantes)';
        outputBody.innerHTML = `Quedan <strong>${humanTime(minutesLeft)}</strong> (r = V), faltan <strong>${missingCount} jugador${plural(missingCount)}</strong> y no hay candidatos (q = F): se emite la <strong>alerta prioritaria</strong> (t = V) sin cancelar (u = F). Al cruzar el umbral de <strong>45 minutos</strong> se envía además una notificación espejo al subcapitán y un aviso de cortesía a la recepción del club.`;
      } else {
        outputTitle.textContent = 'Regla R2 activada: alerta prioritaria (p ∧ r ∧ ¬q → t ∧ ¬u)';
        outputBody.innerHTML = `Quedan <strong>${humanTime(minutesLeft)}</strong> (r = V), faltan <strong>${missingCount} jugador${plural(missingCount)}</strong> (p = V) y no hay candidatos compatibles (q = F). El sistema <strong>alerta al organizador</strong> (t = V) con opciones tácticas: jugar 4 vs 4, dividir costos o pedir un comodín al predio. <strong>No cancela</strong> el partido (u = F).`;
      }
      if (r2AlertBanner) r2AlertBanner.hidden = false;
      return;
    }

    // ESTADO 3 · Monitoreo pasivo (p ∧ ¬q ∧ ¬r)
    setBeacon('slate');
    outputTitle.textContent = 'Monitoreo pasivo sin urgencia (p ∧ ¬q ∧ ¬r)';
    const edge = minutesLeft === URGENCY_LIMIT_MIN
      ? 'Con <strong>3 horas exactas</strong> no se cumple «menos de tres horas» (r = F).'
      : `Quedan <strong>${humanTime(minutesLeft)}</strong>, más de tres horas (r = F).`;
    outputBody.innerHTML = `${edge} Faltan ${missingCount} jugador${plural(missingCount)} y no hay candidatos (q = F), pero con <strong>r = F</strong> R2 está inactiva: no se alarma al capitán (s = F, t = F, ¬u). Protocolo de caso límite de R1: ampliar el radar a 10 km o generar un enlace/QR para invitar conocidos.`;
  }

  /* ---------- Controles ---------- */
  function hideInviteFeedback() {
    if (inviteFeedback) inviteFeedback.hidden = true;
  }

  timeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      timeButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      minutesLeft = Number(btn.getAttribute('data-minutes'));
      evaluateTactics();
    });
  });

  function paintRadar() {
    if (!radarToggleBtn) return;
    radarToggleBtn.classList.toggle('active', hasCandidates);
    radarToggleBtn.setAttribute('aria-pressed', String(hasCandidates));
    radarToggleBtn.textContent = hasCandidates ? 'q = V · Hay candidatos' : 'q = F · Sin candidatos';
  }

  radarToggleBtn?.addEventListener('click', () => {
    hasCandidates = !hasCandidates;
    hideInviteFeedback();
    paintRadar();
    evaluateTactics();
  });

  inviteBtn?.addEventListener('click', () => {
    const vacancyIndex = roster.findIndex(pl => !pl.confirmed);
    if (vacancyIndex === -1) return;

    const cand = invitePool[inviteIndex % invitePool.length];
    roster[vacancyIndex].confirmed = true;
    roster[vacancyIndex].name = cand.short;
    inviteIndex += 1;

    renderSlots();
    evaluateTactics();

    if (inviteFeedback) {
      const left = TEAM_SIZE - roster.filter(pl => pl.confirmed).length;
      inviteFeedback.textContent = left === 0
        ? `${cand.short} aceptó y ocupó la camiseta ${vacancyIndex + 1}. ¡Quórum completo: 10/10!`
        : `${cand.short} aceptó y ocupó la camiseta ${vacancyIndex + 1}. Todavía faltan ${left}.`;
      inviteFeedback.hidden = false;
    }
  });

  resetBtn?.addEventListener('click', () => {
    roster = initialRoster();
    minutesLeft = 120;
    hasCandidates = true;
    timeButtons.forEach(b => {
      const on = Number(b.getAttribute('data-minutes')) === minutesLeft;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    inviteIndex = 0;
    hideInviteFeedback();
    paintRadar();
    renderSlots();
    evaluateTactics();
  });

  timeButtons.forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));
  paintRadar();
  renderSlots();
  evaluateTactics();
}

/* ==========================================================================
   ACCESIBILIDAD DE <details>
   ========================================================================== */
function initDetailsAccessibility() {
  const detailsList = document.querySelectorAll('details.solution-details');

  detailsList.forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;

    summary.setAttribute('aria-expanded', details.hasAttribute('open') ? 'true' : 'false');

    details.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    });
  });
}

/* ==========================================================================
   SCROLL SPY DEL NAVBAR
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function update() {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      if (scrollPos >= top && scrollPos < top + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

/* ==========================================================================
   BOTÓN VOLVER ARRIBA (Scroll to Top)
   ========================================================================== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  const SHOW_THRESHOLD = 400; // px de scroll antes de mostrar el botón

  function toggleVisibility() {
    if (window.scrollY > SHOW_THRESHOLD) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  // Mostrar/ocultar al hacer scroll (con throttle simple mediante requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        toggleVisibility();
        ticking = false;
      });
    }
  }, { passive: true });

  // Scroll suave al hacer clic
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Estado inicial
  toggleVisibility();
}
