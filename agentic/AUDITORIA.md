# AUDITORÍA DEL PROYECTO — TP3 Matchdeverdad (Grupo 21)

> Archivo de contexto para IA. Evita reanalizar el proyecto completo.

---

## 1. Stack y Arquitectura

| Elemento | Valor |
|----------|-------|
| **Tipo** | Landing page estática (SPA de una sola página) |
| **Build tool** | Vite 6 (`npm run dev` / `npm run build` / `npm run preview`) |
| **Framework** | Ninguno (HTML/CSS/JS puro, módulos ES) |
| **Tipo de módulo** | `"type": "module"` |
| **Puerto dev** | 3000 |
| **Output build** | `dist/` |
| **Entry point** | `index.html` → `/src/main.js` + `/src/style.css` |

---

## 2. Estructura de Archivos

```
TP3-Matchdeverdad-Grupo21/
├── index.html              # Página única con todas las secciones
├── vite.config.js          # Configuración Vite (root: '.', publicDir: 'public')
├── package.json            # Solo vite como devDependency
├── CONTEXTO.md             # Consigna del TP3 resumida
├── README.md               # Documentación completa del grupo
├── .gitignore
├── public/
│   └── logos/
│       ├── S07.webp        # Logo oficial Matchdeverdad (favicon y marca)
│       └── Matchdeverdad.webp
├── src/
│   ├── main.js             # Lógica JS: reglas proposicionales, flujos, simulador
│   └── style.css           # Estilos (~2121 líneas, estética cancha sintética)
└── agentic/
    └── AUDITORIA.md        # Este archivo
```

---

## 3. Lógica Proposicional (src/main.js)

### Variables
| Variable | Significado |
|----------|-------------|
| `p` | `confirmed < 10` (faltan jugadores) |
| `q` | `hasCandidates` (hay candidatos compatibles zona+horario) |
| `r` | `minutesLeft < 180` (quedan menos de 3 horas) |
| `s` | Sistema propone candidatos al organizador |
| `t` | Sistema alerta al organizador |
| `u` | Sistema cancela el partido automáticamente |

### Reglas
- **R1:** `(p ∧ q) → s` — Si faltan jugadores y hay candidatos, proponer candidatos.
- **R2:** `(p ∧ r ∧ ¬q) → (t ∧ ¬u)` — Si faltan jugadores, <3h y no hay candidatos, alertar sin cancelar.

### Invariante crítica
- `u` es **siempre `false`**. Ninguna regla cancela el partido automáticamente.

### Función principal
`evaluateRules({ confirmed, minutesLeft, hasCandidates })` — retorna `{p, q, r, r1Antecedent, r2Antecedent, s, t, u}`

---

## 4. Secciones de la Landing (index.html)

| ID | Sección | Contenido |
|----|---------|-----------|
| `hero` | Hero | Título, meta chips (IFTS 29, S07-A, bloque), lead |
| `startup` | Startup | Nombre, logo, descripción del problema, origen IFTS 16 |
| `sentencias` | Reglas | Las dos sentencias R1 y R2 |
| `propuesta-1` | Flujo R1 | Diagrama interactivo con pestañas (Completo / SÍ / NO) |
| `propuesta-2` | Flujo R2 | Diagrama interactivo con pestañas (Completo / SÍ / NO) |
| `simulador` | Pizarra del Capitán | Simulador táctico con 10 camisetas, radar de candidatos, botones de tiempo (4h / 2h / 30 min), botón "Invitar con 1 Clic" |
| `equipo` | Equipo | 4 integrantes con roles y aportes |

### Navegación
- Header sticky con menú: Inicio, Startup, Reglas, Flujo R1, Flujo R2, Pizarra, Equipo
- Badge: `IFTS 29 · Grupo 21 · S07-A`
- Scroll spy activo en navbar
- Botón "Volver arriba"

---

## 5. Simulador Táctico ("La Pizarra del Capitán")

- **10 slots de camiseta** (quórum de fútbol 5)
- Estados: confirmado / vacante / candidato
- **Botones de tiempo:** 4h, 2h, 30 min (cambian `minutesLeft`)
- **Radar de candidatos:** toggle activo/inactivo
- **Botón "Invitar con 1 Clic":** suma refuerzo a camiseta vacante
- **Evaluación táctica en vivo:** muestra proposiciones (p, q, r) y resultado de reglas
- **Caso borde:** si faltan <3h pero SÍ hay candidatos, prevalece R1 (incorporación inmediata)
- **Invariante:** nunca se cancela el partido automáticamente

---

## 6. Estilos (src/style.css)

- **Tema:** "Cancha Sintética Nocturna · Pizarra Táctica Profesional"
- **Colores principales:**
  - `--turf-green-1`: `#064024` (fondo cancha)
  - `--turf-neon`: `#22c55e` (verde neón)
  - `--urgency-amber`: `#f59e0b` (ámbar urgencia)
  - `--pitch-night`: `#050b17` (fondo estadio)
- **Tipografías:** Barlow Condensed (títulos), Plus Jakarta Sans (cuerpo), JetBrains Mono (código/mono)
- **Accesibilidad:** `:focus-visible` con outline neón, skip link, ARIA en detalles, `<details>` con `aria-expanded`
- **Responsive:** desktop primero, sin desbordes, revisión únicamente en desktop

---

## 7. Integrantes del Grupo 21

| Integrante | Rol | GitHub | Aporte clave |
|------------|-----|--------|--------------|
| Florencia Guzmán | Front End & Diseño UI/UX | @fguzman3026 | Dirección de arte, paleta, tipografía, diseño camisetas |
| Sonia Raquel Andrada | Lógica Proposicional & Accesibilidad | @Raqu28 | Formalización R1/R2, tabla verdad 8 estados, desplegables `<details>`, accesibilidad teclado |
| Eitel Hugo Belinzoni | Arquitectura & Testing | @Apoteotico | Config Vite, árboles de decisión HTML/CSS, pruebas `npm run build`, responsive |
| Guillermo Alberto Chacon | Coordinación & Simulador Interactivo | @GuiLeCha | Prompts al agente, lógica reactiva main.js, casos borde, despliegue |

---

## 8. Entorno de Desarrollo Agéntico

- **Herramienta:** Google Antigravity (AGY IDE)
- **Modelos:** Gemini 3.8 Flash (High), Gemini 4 Argon (High), Claude Sonnet 5.5 (High)
- **Iteración clave:** El agente inicial generaba cancelación automática en R2 (incorrecto). El grupo corrigió: `u` siempre `false`, diagrama SVG → HTML/CSS interactivo, bug del beacon style inline, tabla de verdad 8 estados documentada.

---

## 9. Enlaces Públicos

- **Repositorio:** https://github.com/GuiLeCha/TP3-Matchdeverdad-Grupo21
- **Landing (Vercel):** https://tp3-matchdeverdad-grupo21.vercel.app/

---

## 10. Comandos Útiles

```bash
npm install      # Instalar dependencias (solo vite)
npm run dev      # Servidor de desarrollo en puerto 3000
npm run build    # Build para producción en dist/
npm run preview  # Vista previa del build
```

---

*Archivo generado para uso de IA como contexto del proyecto. Evita re-leer todos los archivos fuente.*