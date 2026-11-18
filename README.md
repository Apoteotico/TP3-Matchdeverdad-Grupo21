# Matchdeverdad — Dos sentencias, dos soluciones | IFTS 29
## Práctica Formativa TP3 · Desarrollo de Sistemas Web / Front End (2026 - 2do Cuatrimestre)

Landing page institucional y técnica desarrollada para la presentación de dos propuestas de automatización agéntica para la startup **Matchdeverdad**, abordando el bloque asignado de **Candidatos y urgencia** (Sentencias **FRASE 1 · R1** y **FRASE 2 · R2**).

---

## 1. Datos del Proyecto y Asignación Académica

- **Institución:** Instituto de Formación Técnica Superior Nº 29 (IFTS 29).
- **Carrera:** Tecnicatura Superior en Desarrollo de Software.
- **Asignatura:** Desarrollo de Sistemas Web / Front End.
- **Instancia Evaluativa:** Trabajo Práctico Nº 3 (TP3) – *Dos sentencias, dos soluciones*.
- **Comisión y Grupo:** Grupo 21.
- **Asignación Docente Oficial:** Sorteo `S07-A` · Grupo 21.
- **Startup Asignada:** Matchdeverdad.
- **Rubro:** Deportes y organización de partidos.
- **Bloque Asignado:** Candidatos y urgencia.
- **Objetivo de la Startup:** Organizador de fútbol 5 que ayuda a reunir diez jugadores confirmados.
- **Logo Oficial:** Asignado e incorporado en formato WebP nativo (`public/logos/S07.webp`).

---

## 2. Integrantes del Grupo y Aportes Concretos

| Integrante | Rol Principal | Aportes Concretos y Tareas Realizadas |
| :--- | :--- | :--- |
| **Florencia Guzmán** | Front End & Diseño UI/UX | Dirección del prompt estético deportivo (*"Tactical Pitch"*), definición de contraste de paleta (verde césped `#10b981`, alertas ámbar `#f59e0b`), maquetación de tarjetas y microinteracciones de cancha. |
| **Sonia Raquel Andrada** | Lógica de Flujos & Accesibilidad | Desarme analítico de las sentencias R1 y R2 de Matchdeverdad, estructuración semántica de los desplegables `<details>` y validación de navegación accesible por teclado (roles ARIA, focus ring). |
| **Eitel Hugo Belinzoni** | Arquitectura & Testing | Configuración del entorno de empaquetado en Vite, verificación de compilación sin errores (`npm run build`), testing responsive en desktop y trazado vectorial de los diagramas SVG con marcadores. |
| **Guillermo Alberto Chacon** | Coordinación & UX Interactiva | Coordinación general de las directivas al agente de IA, diseño del simulador interactivo de decisiones lógicas en tiempo real y redacción de los casos límite de contingencia con intervención humana. |

### Evidencia de Colaboración y Revisión entre Integrantes (Rúbrica - Nivel Propone)
- **Revisión 1 (Chacon & Guzmán — Sentencia R2):** Al analizar la primera generación de código del agente para la Frase 2 (*urgencia con menos de 3 horas y sin candidatos*), el agente había incluido una rama que cancelaba automáticamente el partido en la base de datos para "liberar al usuario". Florencia observó inmediatamente que esta lógica contradecía de forma directa la consigna oficial del sorteo docente (*"sin cancelar el partido automáticamente"*). Guillermo aportó que en el fútbol amateur cancelar sin confirmación del capitán provoca la pérdida económica de la seña pagada a la cancha. Tras este intercambio grupal, se instruyó al agente para reescribir el flujo: la acción se reformuló como una **Alerta Prioritaria Multi-Canal (Push/WhatsApp)** con derivación a intervención humana, manteniendo el turno asegurado.
- **Revisión 2 (Andrada & Belinzoni — Sentencia R1):** Al examinar la Frase 1 (*búsqueda de candidatos compatibles*), Sonia planteó la necesidad de definir qué constituye "compatibilidad" más allá de un booleano abstracto. Eitel propuso incorporar una doble cota: geográfica (radio inicial &le; 5 km) y horaria (margen de llegada &plusmn; 15 min). Además, se añadió un caso de borde donde, si el organizador rechaza a los postulantes recomendados, el agente no se detiene, sino que ofrece ampliar el radio de cobertura a 10 km o generar un link temporal de invitación compartible.

---

## 3. Sobre la Startup Matchdeverdad

### Contexto y Origen Académico
Las condiciones de funcionamiento de Matchdeverdad fueron formuladas originalmente mediante lógica proposicional por estudiantes del **IFTS 16** en la materia *Lógica Computacional*. 

En esta instancia formativa de articulación interinstitucional, el **Grupo 21** del **IFTS 29** toma dicha producción para modelar una solución de arquitectura agéntica comprensible, visual y respaldada por una landing page funcional y accesible.

### Descripción del Servicio y Problemática que Resuelve
En la organización de partidos de fútbol 5, la falta de confirmación de los diez jugadores necesarios es una causa habitual de partidos suspendidos a último momento, tensiones entre conocidos y penalizaciones económicas por parte de los complejos deportivos. 

**Matchdeverdad** actúa como un asistente inteligente que monitorea el quórum del partido, conecta con una base comunitaria de jugadores cercanos según su posición y horario, y gestiona la cuenta regresiva sin tomar decisiones destructivas.

---

## 4. Análisis y Desglose de las Sentencias Asignadas

### 4.1. FRASE 1 · REGLA R1 (Candidatos Compatibles)
> **Sentencia Original:** *«Si faltan jugadores y hay candidatos compatibles con la zona y el horario, el sistema propone esos candidatos al organizador.»*

* **Datos de Entrada:**
  - Recuento de jugadores confirmados ($n < 10$).
  - Ubicación de la cancha (coordenadas GPS del predio).
  - Horario pactado de inicio del turno.
  - Registro de jugadores activos con radio de desplazamiento compatible (&le; 5 km) y disponibilidad horaria coincidente.
* **Condición Lógica:**
  $$\text{FaltanJugadores} \land \text{HayCandidatosCompatibles}$$
* **Acción Agéntica Propuesta:**
  El agente *MatchFinder* filtra el padrón de la zona, rankea a los postulantes según su índice de puntualidad y reputación de juego limpio, y despliega en la interfaz del organizador un carrusel de recomendaciones con fichas individuales y botón de invitación directa en 1 clic.
* **Resultado:** El organizador dispone de sustitutos inmediatos sin recurrir a grupos informales externos.
* **Caso Límite & Intervención Humana (Nivel Propone):**
  * *Escenario:* El organizador descarta a todos los candidatos sugeridos o los perfiles cercanos presentan antecedentes de ausentismo.
  * *Resolución:* El sistema abre la opción de extender el radio a 10 km y habilita al organizador a emitir un enlace de pase libre temporal para amigos externos fuera de la plataforma.

---

### 4.2. FRASE 2 · REGLA R2 (Urgencia &lt; 3 horas sin Candidatos)
> **Sentencia Original:** *«Si faltan jugadores, quedan menos de tres horas y no hay candidatos compatibles, el sistema alerta al organizador sin cancelar el partido automáticamente.»*

* **Datos de Entrada:**
  - Recuento de jugadores confirmados ($n < 10$).
  - Reloj del servidor: `TiempoRestante < 180 min` (menos de tres horas).
  - Consulta de candidatos compatibles arrojando resultado vacío ($0$ postulantes en la zona).
* **Condición Lógica Compuesta:**
  $$\text{FaltanJugadores} \land (\text{TiempoRestante} < 3\text{h}) \land \neg\text{HayCandidatosCompatibles}$$
* **Acción Agéntica Propuesta:**
  El agente *MatchGuard Urgency* emite una alerta crítica de alta visibilidad al dispositivo móvil del organizador. Le presenta opciones tácticas predefinidas: *"Jugar en formato reducido (4 vs 4)"*, *"Compartir costo de alquiler entre los confirmados"* o *"Solicitar comodín al encargado del predio"*. **Bajo ninguna circunstancia cancela la reserva de forma unilateral.**
* **Resultado:** El organizador toma conocimiento urgente del estado y decide el camino a seguir sin perder la seña de la cancha.
* **Caso Límite & Intervención Humana (Nivel Propone):**
  * *Escenario:* Quedan 45 minutos para el partido y el organizador no leyó la alerta (sin batería o en viaje).
  * *Resolución:* El sistema eleva una notificación espejo al segundo jugador confirmado (subcapitán) y genera un mensaje de cortesía al WhatsApp del complejo deportivo para que el encargado consulte a los jugadores al momento de ingresar a las instalaciones.

---

## 5. Tecnologías Utilizadas

- **HTML5 Semántico:** Estructuración con `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<details>`, `<summary>` y `<footer>`, respetando los roles de accesibilidad ARIA y enlaces de salto (*skip-link*).
- **CSS3 Moderno:** Variables nativas (Custom Properties), layout en CSS Grid y Flexbox, estética nocturna deportiva (*Tactical Pitch*), estados `:focus-visible` para accesibilidad por teclado y diseño adaptable sin desbordes horizontales en desktop.
- **JavaScript Modular (ES6):** Controlador reactivo para el simulador interactivo de lógica, conmutador de escenarios prefijados (*presets*), resaltado dinámico de nodos SVG y sincronización de atributos de accesibilidad en los desplegables.
- **SVG Vectorial Nativo:** Dos diagramas de flujo integrados directamente en código, con marcadores de flecha definidos, rombos de decisión y diferenciación cromática de caminos.
- **Vite 6:** Empaquetador ultrarrápido y servidor de previsualización para asegurar una compilación limpia y sin dependencias superfluas.

---

## 6. Instrucciones para Ejecutar el Proyecto Localmente

### Requisitos Previos
Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) y `npm`.

### Paso a Paso
1. **Clonar o ingresar a la carpeta del proyecto:**
   ```powershell
   cd "TP3-Matchdeverdad-Grupo21"
   ```

2. **Instalar dependencias:**
   ```powershell
   npm install
   ```

3. **Iniciar servidor de desarrollo local:**
   ```powershell
   npm run dev
   ```
   Abrir en el navegador la dirección local indicada (usualmente `http://localhost:3000` o `http://localhost:5173`).

4. **Compilar para producción:**
   ```powershell
   npm run build
   ```
   Genera el bundle optimizado en la carpeta `dist/` (0 errores de compilación).

5. **Previsualizar la compilación de producción:**
   ```powershell
   npm run preview
   ```

---

## 7. Herramientas de IA y Construcción Agéntica

En estricto cumplimiento de la consigna de *“Construcción 100% Agéntica: Ustedes dirigen, el agente construye”*:

- **Entorno de Trabajo / Aplicación:** Google Antigravity (AGY IDE).
- **Modelo de Lenguaje Seleccionado:** `Gemini 3.8 Flash (High)` (declarado e informado por el entorno).
- **Usos de la IA:**
  - Análisis proposicional y descomposición de las sentencias R1 y R2 de Matchdeverdad.
  - Generación de la maquetación semántica en HTML5 y CSS3 responsive.
  - Modelado vectorial en SVG para los dos diagramas de flujo de decisión.
  - Implementación del script interactivo para el simulador de estados en tiempo real.
  - Auditoría de accesibilidad y verificación de compilación en Vite.

### Evidencia de Iteración (Rúbrica - Nivel Propone)
- **Instrucción inicial del grupo:**
  > *"Generá una landing page para la startup Matchdeverdad con la Frase 1 y Frase 2, mostrando un diagrama de qué pasa cuando faltan jugadores."*
- **Problema detectado por el grupo:**
  En la respuesta preliminar, el agente generó una estructura genérica donde, al evaluarse la Frase 2 (*faltan jugadores, quedan menos de 3 horas y no hay candidatos*), el sistema ejecutaba directamente la función `cancelarPartido()`, enviando un mail de cancelación al predio. Además, los diagramas se habían planteado como simples listas de texto sin formato gráfico vectorial y no se contemplaba cómo reaccionar si el organizador no respondía.
- **Pedido de mejora y reprompting formulado al agente:**
  > *"Corrección técnica obligatoria: la Frase 2 del sorteo S07-A prohíbe explícitamente cancelar el partido de forma automática ('sin cancelar el partido automáticamente'). Reformulá el flujo de R2 para que la consecuencia sea una ALERTA PRIORITARIA al organizador con opciones tácticas (jugar en formato reducido, invitar amigos externos), manteniendo la reserva intacta. Además, construí dos diagramas de flujo vectoriales nítidos en formato SVG nativo con caminos SÍ/NO diferenciados por color, incorporá un simulador interactivo donde el docente pueda mover los controles de jugadores y tiempo en tiempo real, y agregá un caso límite con protocolo de escalamiento humano para cuando el organizador no responde a 45 minutos del partido."*
- **Resultado final tras la iteración:**
  El agente reescribió íntegramente la arquitectura de decisión: los diagramas SVG se implementaron con marcadores de flecha y rombos formales de decisión; el simulador interactivo evalúa dinámicamente las condiciones activando las luces y textos correspondientes; y se incluyó la intervención humana de contingencia tanto en la web como en la documentación.

---

## 8. Enlaces del Proyecto

- **Repositorio de GitHub:** [https://github.com/GuiLeCha/TP3-Matchdeverdad-Grupo21](https://github.com/GuiLeCha/TP3-Matchdeverdad-Grupo21)
- **Landing Page Publicada en Vercel:** [https://tp3-matchdeverdad-grupo21.vercel.app/](https://tp3-matchdeverdad-grupo21.vercel.app/)

*(Los enlaces son públicos y accesibles desde cualquier navegador sin requerir inicio de sesión).*

---

## 9. Comprobación y Checklist de Criterios (Rúbrica Oficial)

| Ítem Rúbrica | Criterio | Nivel | Comprobación y Evidencia |
| :---: | :--- | :---: | :--- |
| **01** | **Participación de los integrantes** | **PROPONE** | 4 integrantes documentados con roles y aportes individuales. Registro explícito de la revisión colaborativa entre integrantes y la mejora en la regla R2. |
| **02** | **Repositorio y landing publicados** | **PROPONE** | Enlaces públicos y funcionales sin sesión. Guía paso a paso para reproducción local y verificación exhaustiva de enlaces. |
| **03** | **Landing acorde a la consigna** | **PROPONE** | Logo oficial de Matchdeverdad en WebP, bloque S07-A, sentencias textuales, desplegables `<details>` y simulador interactivo con pizarra táctica de fútbol 5. |
| **04** | **Dos flujos agénticos gráficos** | **PROPONE** | Dos diagramas vectoriales SVG nítidos y legibles (R1 y R2). Explicación exhaustiva de casos límite y resolución mediante intervención humana. |
| **05** | **Herramientas de IA y modelos** | **PROPONE** | Declaración de Google Antigravity y modelo Gemini 3.8 Flash. Evidencia completa de iteración con prompt inicial, error detectado, corrección y resultado. |
