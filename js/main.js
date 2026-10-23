/* =========================================================
   DISPONIBILIDAD — cambia solo esta línea cuando cambie tu situación.
   Valores posibles: "disponible" | "ocupado" | "no-disponible"
   ========================================================= */
const ESTADO_DISPONIBILIDAD = "disponible";

const ESTADOS = {
  "disponible": "Disponible para nuevos proyectos",
  "ocupado": "Ocupado, pero abierto a propuestas",
  "no-disponible": "No disponible actualmente",
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
const animate = hasGSAP && !prefersReducedMotion;

let lenis = null;

document.addEventListener("DOMContentLoaded", () => {
  // Sin GSAP (o con movimiento reducido) se muestra todo tal cual
  if (!animate) document.documentElement.classList.remove("js-anim");
  else gsap.registerPlugin(ScrollTrigger);

  initAvailability();
  initSocialInNav(); // antes que initNav, para que los iconos copiados también cierren el menú móvil
  initConsoleEasterEgg();
  initAvatarEasterEgg();
  initNav(); // antes que el smooth scroll: cierra el menú móvil antes de desplazar
  initSmoothScroll();
  initScrollProgress();
  initActiveLinks();
  initTooltips();
  initOffscreenPause();
  initHeroGlobe();
  initSkillsNetwork();
  initTimeline();
  initNameGlitch();

  if (animate) {
    initHeroIntro();
    initHeroParallax();
    initScrollReveals();
    initProjectCards();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  } else {
    initTyped({ delay: 900 });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Badge de disponibilidad del hero (color y texto según el estado) ---------- */
function initAvailability() {
  const badge = document.getElementById("availability");
  if (!badge) return;
  if (!(ESTADO_DISPONIBILIDAD in ESTADOS)) {
    console.warn(`ESTADO_DISPONIBILIDAD "${ESTADO_DISPONIBILIDAD}" no existe. Usa: ${Object.keys(ESTADOS).join(", ")}`);
    return; // se queda el texto por defecto del HTML
  }
  badge.dataset.state = ESTADO_DISPONIBILIDAD;
  badge.querySelector(".hero__status-text").textContent = ESTADOS[ESTADO_DISPONIBILIDAD];
}

/* ---------- Easter egg para quien abra la consola (F12) ---------- */
// Vaquero esqueleto programando en su portátil, en una silla desvencijada, para la consola: SVG de una sola línea.
// "currentColor" se sustituye por el color de acento al convertirlo en imagen.
const COWBOY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 130" fill="none" stroke="currentColor" stroke-width="3"
     stroke-linecap="round" stroke-linejoin="round">
  <!-- silla: respaldo, asiento torcido, patas (una doblada) y travesaños rotos -->
  <path d="M22 50 L27 124" />
  <path d="M14 53 L18 92" />
  <path d="M15 64 L25 63" />
  <path d="M16 76 L21 78" />
  <path d="M20 92 L66 96" />
  <path d="M30 94 L33 124" />
  <path d="M64 96 L67 110 L63 124" />
  <path d="M28 110 L44 108 M52 107 L60 106" />
  <!-- sombrero -->
  <path d="M24 30 Q42 37 62 28" />
  <path d="M32 31 Q33 17 42 20 Q51 17 53 29" />
  <!-- calavera -->
  <circle cx="43" cy="40" r="8" />
  <circle cx="40" cy="40" r="1.6" fill="currentColor" stroke="none" />
  <circle cx="46.5" cy="40" r="1.6" fill="currentColor" stroke="none" />
  <path d="M39 46.5 L47 46.5" />
  <!-- columna y costillas -->
  <path d="M42 48 Q39 70 43 91" />
  <path d="M34 58 Q42 62 50 57" />
  <path d="M35 65 Q42 69 49 64" />
  <path d="M36 72 Q42 75 48 71" />
  <!-- piernas: fémur, tibia y pie -->
  <path d="M43 91 L74 88 L78 118 L90 120" />
  <path d="M44 94 L68 97 L70 121 L80 123" />
  <!-- portátil sobre las rodillas: teclado, pantalla inclinada y </> -->
  <path d="M50 86.5 L82 84.5" />
  <path d="M72 85 L78 61 L91 60 L82 84.5" stroke-width="2.5" />
  <path d="M79.5 69 L77.5 72 L79.5 75 M82.4 68.5 L81.2 75.5 M84 69 L86 72 L84 75" stroke-width="1.4" />
  <!-- brazos tecleando -->
  <path d="M41 55 L47 74 L62 84" />
  <path d="M43 56 L52 72 L70 83" />
  <!-- suelo -->
  <path d="M6 126 L104 126" stroke-width="2" opacity="0.5" />
</svg>`;

function initConsoleEasterEgg() {
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ffa31a";
  const art = [
    "",
    "  ██████  ██████  ",
    "  ██      ██   ██ ",
    "  █████   ██████  ",
    "  ██      ██   ██ ",
    "  ██████  ██   ██ ",
    "",
  ].join("\n");

  console.log(
    `%c${art}`,
    `color: ${accent}; font-family: monospace; font-size: 14px; font-weight: bold; line-height: 1.1;`
  );

  // Imagen en la consola: un %c con el SVG como fondo (data URI) y padding para darle tamaño
  const cowboy = encodeURIComponent(COWBOY_SVG.trim().replaceAll("currentColor", accent));
  console.log(
    "%c ",
    `font-size: 1px; padding: 65px 55px; background: url("data:image/svg+xml,${cowboy}") center / contain no-repeat;`
  );

  console.log(
    "%cVaya, parece que no eres el único que ha pasado por aquí...",
    "font-size: 13px; font-style: italic; line-height: 1.6; color: #b9b9c0;"
  );
}

/* ---------- Easter egg: triple click en el avatar → "Party Parrot" ---------- */
function initAvatarEasterEgg() {
  const avatar = document.querySelector(".avatar");
  if (!avatar) return;
  const DURATION = 3500;   // ms que dura la fiesta
  const CLICK_GAP = 1500;  // ms máximos entre un click y el siguiente
  let partying = false;
  let clicks = 0;
  let lastClick = 0;

  avatar.addEventListener("click", () => {
    if (partying) return;
    const now = performance.now();
    clicks = now - lastClick > CLICK_GAP ? 1 : clicks + 1; // si pasa mucho rato, vuelve a contar
    lastClick = now;
    if (clicks < 3) return;
    clicks = 0;
    partying = true;

    avatar.classList.add("avatar--party");
    const toast = document.createElement("div");
    toast.className = "party-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = "<span>¡Qué curiosete eres, colega!</span>";
    avatar.parentElement.append(toast);

    setTimeout(() => {
      avatar.classList.remove("avatar--party");
      toast.classList.add("is-leaving");
      toast.addEventListener("animationend", () => toast.remove(), { once: true });
      partying = false;
    }, DURATION);
  });
}

/* ---------- Redes: copia los enlaces de la barra lateral al menú (se ven en < 1200px) ---------- */
function initSocialInNav() {
  const target = document.querySelector(".nav__social");
  const links = document.querySelectorAll(".social-rail a");
  if (!target) return;
  links.forEach((link) => target.append(link.cloneNode(true)));
}

/* ---------- Smooth scroll con Lenis, sincronizado con GSAP ---------- */
function initSmoothScroll() {
  if (prefersReducedMotion || typeof window.Lenis === "undefined") return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  if (hasGSAP) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Los enlaces internos (#seccion) también se desplazan con Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      const target = id.length > 1 && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target);
    });
  });
}

/* ---------- Nav: fondo al hacer scroll + menú móvil ---------- */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    document.body.style.overflow = open ? "hidden" : "";
    if (lenis) open ? lenis.stop() : lenis.start();
  };

  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* ---------- Congela las animaciones CSS de las secciones que no se ven (regla .is-offscreen) ---------- */
function initOffscreenPause() {
  const observer = new IntersectionObserver((entries) =>
    entries.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting))
  );
  document.querySelectorAll("main > section").forEach((s) => observer.observe(s));
}

/* ---------- Barra de progreso de lectura ---------- */
function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  // El recorrido máximo se mide solo cuando cambia el tamaño de la página, no en cada scroll
  // (leer scrollHeight tras una escritura de estilos fuerza un layout síncrono)
  let max = 0;
  const update = () => (bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`);
  const measure = () => {
    max = document.documentElement.scrollHeight - window.innerHeight;
    update();
  };
  measure();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure);
  new ResizeObserver(measure).observe(document.body);
}

/* ---------- Divide un texto en palabras (máscara) y letras ---------- */
function splitChars(el) {
  el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
  const chars = [];

  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) return walk(child);
      if (child.nodeType !== Node.TEXT_NODE) return;

      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(" ");

        const word = document.createElement("span");
        word.className = "split-word";
        word.setAttribute("aria-hidden", "true");
        [...part].forEach((ch) => {
          const span = document.createElement("span");
          span.className = "split-char";
          span.textContent = ch;
          word.append(span);
          chars.push(span);
        });
        frag.append(word);
      });
      child.replaceWith(frag);
    });
  };

  walk(el);
  return chars;
}

/* ---------- Intro del hero al cargar ---------- */
function initHeroIntro() {
  const title = document.querySelector("[data-split]");
  const chars = splitChars(title);

  const show = { autoAlpha: 1, y: 0 };

  // Párrafo, botones e iconos entran cuando la máquina de escribir termina la primera frase
  const revealRest = () =>
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .fromTo(".hero__desc", { autoAlpha: 0, y: 30 }, { ...show, duration: 1 })
      .fromTo(".hero__actions", { autoAlpha: 0, y: 30 }, { ...show, duration: 1 }, "-=0.7")
      .fromTo(".social-rail", { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 1 }, "<0.1")
      .fromTo(".hero__scroll", { autoAlpha: 0, y: -10 }, { autoAlpha: 0.6, y: 0, duration: 0.8 }, "-=0.5");

  // Al acabar la intro, la primera frase se escribe letra a letra
  const tl = gsap.timeline({
    defaults: { ease: "expo.out" },
    onComplete: () => initTyped({ onFirstTyped: revealRest }),
  });

  // clearProps: sin transform en el nav, el menú móvil (position: fixed) ocupa toda la pantalla
  tl.fromTo("#nav", { autoAlpha: 0, yPercent: -100 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, clearProps: "transform" }, 0.1)
    .from(".blob", { scale: 0.3, opacity: 0, duration: 2.4, stagger: 0.2, ease: "power3.out" }, 0)
    .from(".hero__globe", { opacity: 0, scale: 0.94, duration: 2.6, ease: "power2.out" }, 0.3)
    .fromTo(".hero__identity", { autoAlpha: 0, y: 20 }, { ...show, duration: 0.9 }, 0.2)
    // clearProps: al acabar quita el transform en línea para que funcione el :hover del CSS
    .from(".avatar", { scale: 0.4, rotate: -20, duration: 1, ease: "back.out(2)", clearProps: "transform" }, 0.25)
    .set(title, { autoAlpha: 1 }, 0.35)
    .from(chars, { yPercent: 120, rotate: 10, duration: 1.2, stagger: 0.03 }, 0.35)
    // la línea del rol aparece vacía (solo el cursor) y enseguida empieza a escribirse
    .fromTo(".hero__role", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "-=0.7");
}

/* ---------- Glitch ocasional del nombre del hero (la animación está en el CSS) ---------- */
function initNameGlitch() {
  const name = document.querySelector(".glitch");
  if (!name || prefersReducedMotion) return;
  // Intervalos aleatorios para que no sea predecible: el primero justo al acabar la intro
  // (las letras terminan de entrar hacia los 2 s), para que el visitante lo vea enseguida
  const FIRST_MIN = 2000, FIRST_MAX = 3000;
  const MIN_WAIT = 4000, MAX_WAIT = 6000;
  const GLITCHED_CHARS = 3;

  let heroVisible = true;
  new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting)).observe(name);

  const glitch = () => {
    // Letras sueltas que se descolocan (solo existen si la intro ha partido el texto)
    const chars = [...name.querySelectorAll(".split-char")];
    for (let i = 0; i < GLITCHED_CHARS && chars.length; i++) {
      chars.splice((Math.random() * chars.length) | 0, 1)[0].classList.add("is-glitched");
    }
    name.classList.add("is-glitching");
  };

  name.addEventListener("animationend", (e) => {
    if (e.target !== name) return; // ignora el animationend de palabras y letras
    name.classList.remove("is-glitching");
    name.querySelectorAll(".is-glitched").forEach((c) => c.classList.remove("is-glitched"));
  });

  const schedule = (min, max) =>
    setTimeout(() => {
      if (heroVisible && !document.hidden && !name.classList.contains("is-glitching")) glitch();
      schedule(MIN_WAIT, MAX_WAIT);
    }, min + Math.random() * (max - min));
  schedule(FIRST_MIN, FIRST_MAX);
}

/* ---------- Globo de puntos del hero + bola de plasma (canvas, sin librerías) ---------- */
function initHeroGlobe() {
  const canvas = document.getElementById("heroGlobe");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const hero = document.getElementById("hero");

  const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lighten = (rgb, k) => `rgb(${rgb.map((c) => Math.round(c + (255 - c) * k)).join(", ")})`;

  // Puntos en el color de acento (ámbar, leído del CSS). Los rayos van en cian:
  // excepción deliberada solo para este efecto, para que destaque sobre el ámbar.
  const accent = toRgb(getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());
  const dotColor = `rgb(${accent.join(", ")})`;
  const plasmaRgb = toRgb("#22d3ee");
  const plasmaColor = `rgb(${plasmaRgb.join(", ")})`;
  const plasmaCore = lighten(plasmaRgb, 0.7);

  const PERSPECTIVE = 3;
  const LEVELS = 12; // niveles de opacidad: los puntos se pintan en 12 rellenos, no uno a uno

  let w, h, cx, cy, radius, count;
  // Datos de los puntos en arrays tipados, reservados una vez (nada se crea por fotograma)
  let px, py, pz, psize, sx, sy, sr, lvl, order;
  const levelCount = new Int32Array(LEVELS);
  const levelStart = new Int32Array(LEVELS + 1);
  const levelAlpha = Float32Array.from({ length: LEVELS }, (_, i) => {
    const depth = (i + 0.5) / LEVELS;
    return 0.03 + depth * depth * 0.6; // delante se ve más, detrás casi nada
  });

  let rotY = 0;
  const tilt = { x: 0.35, y: 0 };   // inclinación actual
  const target = { x: 0.35, y: 0 }; // inclinación hacia la que va (ratón)

  // Puntos repartidos uniformemente en una esfera (espiral de Fibonacci)
  const buildPoints = (n) => {
    count = n;
    px = new Float32Array(n); py = new Float32Array(n); pz = new Float32Array(n);
    psize = new Float32Array(n); sx = new Float32Array(n); sy = new Float32Array(n);
    sr = new Float32Array(n); lvl = new Int8Array(n); order = new Int32Array(n);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const ring = Math.sqrt(1 - y * y);
      px[i] = Math.cos(golden * i) * ring;
      py[i] = y;
      pz[i] = Math.sin(golden * i) * ring;
      // unos pocos puntos grandes, como en el ejemplo
      psize[i] = Math.random() < 0.08 ? 1.5 + Math.random() * 1.5 : 0.45 + Math.random() * 0.75;
    }
  };

  /* --- Estado de la bola de plasma --- */
  const canPlasma = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pointer = { x: 0, y: 0, active: false }; // posición del ratón en la ventana
  let energy = 0;          // 0 = apagado, 1 = rayos a pleno
  let nextBoltAt = 0;
  let hasContact = false;
  let contactX = 0, contactY = 0; // punto donde el rayo toca el "cristal"
  let rect = null;         // posición del canvas en pantalla (caché)

  // Círculo del color de acento pre-renderizado una vez; drawImage lo escala a cada punto
  const dotSprite = document.createElement("canvas");
  dotSprite.width = dotSprite.height = 16;
  const dctx = dotSprite.getContext("2d");
  dctx.fillStyle = dotColor;
  dctx.arc(8, 8, 8, 0, Math.PI * 2);
  dctx.fill();

  const resize = () => {
    // En móvil el resize salta al mostrar/ocultar la barra de URL: si no cambia nada, no se toca
    if (canvas.clientWidth === w && canvas.clientHeight === h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // más no se aprecia en puntos de 1–2 px
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = w < 768;
    radius = mobile ? w * 0.7 : Math.min(w * 0.3, h * 0.5);
    cx = mobile ? w * 0.6 : w * 0.74;
    cy = mobile ? h * 1.0 : h * 0.66;
    const n = mobile ? 900 : 2000;
    if (n !== count) buildPoints(n);
    rect = null;
  };

  const drawDots = () => {
    const cosY = Math.cos(rotY + tilt.y), sinY = Math.sin(rotY + tilt.y);
    const cosX = Math.cos(tilt.x), sinX = Math.sin(tilt.x);
    levelCount.fill(0);

    // 1) Proyección 3D → 2D y nivel de opacidad de cada punto
    for (let i = 0; i < count; i++) {
      const x1 = px[i] * cosY - pz[i] * sinY;
      const z1 = px[i] * sinY + pz[i] * cosY;
      const y2 = py[i] * cosX - z1 * sinX;
      const z2 = py[i] * sinX + z1 * cosX;
      const scale = PERSPECTIVE / (PERSPECTIVE - z2);
      const x = cx + x1 * radius * scale;
      const y = cy + y2 * radius * scale;
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) { lvl[i] = -1; continue; }
      sx[i] = x; sy[i] = y; sr[i] = psize[i] * scale;
      const l = Math.min(LEVELS - 1, ((z2 + 1) / 2) * LEVELS | 0);
      lvl[i] = l;
      levelCount[l]++;
    }

    // 2) Ordena los índices por nivel (counting sort, sin crear arrays)
    levelStart[0] = 0;
    for (let l = 0; l < LEVELS; l++) levelStart[l + 1] = levelStart[l] + levelCount[l];
    levelCount.fill(0);
    for (let i = 0; i < count; i++) {
      const l = lvl[i];
      if (l >= 0) order[levelStart[l] + levelCount[l]++] = i;
    }

    // 3) Por nivel de opacidad: los diminutos con fillRect y el resto copiando un sprite.
    // Un path con miles de arcos obliga a la GPU a rasterizar una máscara del canvas entero
    // en cada fill(); rectángulos e imágenes sueltos se agrupan en lotes y salen casi gratis.
    ctx.fillStyle = dotColor;
    for (let l = 0; l < LEVELS; l++) {
      const from = levelStart[l], to = levelStart[l + 1];
      if (from === to) continue;
      ctx.globalAlpha = levelAlpha[l];
      for (let k = from; k < to; k++) {
        const i = order[k], r = sr[i];
        if (r < 0.9) ctx.fillRect(sx[i] - r, sy[i] - r, r * 2, r * 2);
      }
      for (let k = from; k < to; k++) {
        const i = order[k], r = sr[i];
        if (r >= 0.9) ctx.drawImage(dotSprite, sx[i] - r, sy[i] - r, r * 2, r * 2);
      }
    }
    ctx.globalAlpha = 1;
  };

  /* --- Bola de plasma: rayos del centro hacia el cursor --- */

  // Buffers de rayos reservados una vez y reutilizados en cada regeneración
  const MAX_BOLTS = 12;             // 3 principales + hasta 9 ramas
  const MAX_POINTS = (1 << 6) + 1;  // subdivisión de profundidad 6
  const boltX = Array.from({ length: MAX_BOLTS }, () => new Float32Array(MAX_POINTS));
  const boltY = Array.from({ length: MAX_BOLTS }, () => new Float32Array(MAX_POINTS));
  const boltLen = new Int32Array(MAX_BOLTS);
  const boltKind = new Int8Array(MAX_BOLTS); // índice en STRENGTHS (entero: se compara sin errores de redondeo)
  const STRENGTHS = [1, 0.6, 0.4]; // principal, secundario, rama
  let boltCount = 0;

  // Rayo en zigzag por subdivisión del punto medio, escrito en el buffer `slot`
  const zigzagInto = (slot, x1, y1, x2, y2, disp, depth) => {
    const X = boltX[slot], Y = boltY[slot];
    const n = 1 << depth;
    X[0] = x1; Y[0] = y1; X[n] = x2; Y[n] = y2;
    for (let step = n; step > 1; step >>= 1) {
      const half = step >> 1;
      for (let i = 0; i < n; i += step) {
        const ax = X[i], ay = Y[i], bx = X[i + step], by = Y[i + step];
        const len = Math.hypot(bx - ax, by - ay) || 1;
        const off = (Math.random() - 0.5) * disp;
        X[i + half] = (ax + bx) / 2 - ((by - ay) / len) * off;
        Y[i + half] = (ay + by) / 2 + ((bx - ax) / len) * off;
      }
      disp /= 2;
    }
    boltLen[slot] = n + 1;
  };

  const buildBolts = () => {
    boltCount = 0;
    const mains = 2 + Math.round(Math.random());
    for (let m = 0; m < mains; m++) {
      const jx = contactX + (Math.random() - 0.5) * radius * 0.08;
      const jy = contactY + (Math.random() - 0.5) * radius * 0.08;
      const len = Math.hypot(jx - cx, jy - cy);
      const main = boltCount++;
      zigzagInto(main, cx, cy, jx, jy, len * 0.22, 6);
      boltKind[main] = m === 0 ? 0 : 1;

      // Ramificaciones cortas que salen del rayo principal
      const angle = Math.atan2(jy - cy, jx - cx);
      const branches = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < branches && boltCount < MAX_BOLTS; k++) {
        const from = Math.floor(boltLen[main] * (0.3 + Math.random() * 0.5));
        const bx = boltX[main][from], by = boltY[main][from];
        const bAngle = angle + (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.6);
        const bLen = len * (0.15 + Math.random() * 0.25);
        const slot = boltCount++;
        zigzagInto(slot, bx, by, bx + Math.cos(bAngle) * bLen, by + Math.sin(bAngle) * bLen, bLen * 0.35, 4);
        boltKind[slot] = 2;
      }
    }
  };

  // Brillo radial pre-renderizado una vez; en cada fotograma solo se copia
  const glowSprite = document.createElement("canvas");
  glowSprite.width = glowSprite.height = 128;
  const gctx = glowSprite.getContext("2d");
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "#ffffff");       // centro blanco quemado
  grad.addColorStop(0.15, plasmaCore);
  grad.addColorStop(0.4, plasmaColor);   // aura cian
  grad.addColorStop(1, "transparent");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);

  const glow = (x, y, size, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(glowSprite, x - size, y - size, size * 2, size * 2);
  };

  // Capas de fuera a dentro: aura cian cada vez más estrecha e intensa y núcleo blanco
  // puro. Con "lighter" se suman, así que el centro queda casi quemado y los bordes
  // se difuminan en cian (sin shadowBlur, que es caro). [grosor, opacidad, color]
  const LAYERS = [
    [16, 0.04, plasmaColor],
    [9, 0.08, plasmaColor],
    [4.5, 0.22, plasmaColor],
    [2.2, 0.6, plasmaCore],
    [1, 1, "#ffffff"],
  ];

  const drawPlasma = () => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter"; // los brillos se suman, como la luz
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const flicker = 0.75 + Math.random() * 0.25;
    glow(cx, cy, radius * 0.16, 0.55 * energy * flicker);                  // núcleo
    if (hasContact) glow(contactX, contactY, radius * 0.1, 0.5 * energy); // punto de contacto

    for (const [width, alpha, stroke] of LAYERS) {
      ctx.lineWidth = width;
      ctx.strokeStyle = stroke;
      // un trazo por intensidad (principal, secundarios, ramas): 9 trazos en total
      for (let kind = 0; kind < STRENGTHS.length; kind++) {
        ctx.globalAlpha = alpha * STRENGTHS[kind] * energy * flicker;
        ctx.beginPath();
        for (let b = 0; b < boltCount; b++) {
          if (boltKind[b] !== kind) continue;
          const X = boltX[b], Y = boltY[b];
          ctx.moveTo(X[0], Y[0]);
          for (let i = 1; i < boltLen[b]; i++) ctx.lineTo(X[i], Y[i]);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Energía, punto de contacto y regeneración de rayos
  const updatePlasma = (time, dt) => {
    let hovering = false;
    if (pointer.active) {
      if (!rect) rect = canvas.getBoundingClientRect(); // solo se mide cuando ha cambiado
      const lx = (pointer.x - rect.left) * (w / rect.width);
      const ly = (pointer.y - rect.top) * (h / rect.height);
      const dist = Math.hypot(lx - cx, ly - cy);
      hovering = dist < radius * 1.2;
      if (hovering) {
        // Dentro del globo el rayo va al cursor; fuera, al borde en esa dirección
        const reach = Math.min(dist, radius * 0.97) / (dist || 1);
        contactX = cx + (lx - cx) * reach;
        contactY = cy + (ly - cy) * reach;
        hasContact = true;
      }
    }

    energy += ((hovering ? 1 : 0) - energy) * Math.min(1, 0.12 * dt);
    if (energy < 0.01) energy = 0;
    if (energy > 0 && hasContact && time >= nextBoltAt) {
      buildBolts();
      nextBoltAt = time + 50 + Math.random() * 60; // parpadeo: rayos nuevos cada 50–110 ms
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    drawDots();
    if (energy > 0) drawPlasma();
  };

  resize();
  window.addEventListener("resize", resize);

  if (prefersReducedMotion) {
    draw(); // un fotograma estático
    return;
  }

  window.addEventListener("scroll", () => (rect = null), { passive: true });
  setTimeout(() => (rect = null), 3500); // la intro escala el canvas: se vuelve a medir al acabar

  // El ratón solo guarda su posición; todo el cálculo se hace una vez por fotograma
  window.addEventListener(
    "pointermove",
    (e) => {
      target.y = (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.x = 0.35 + (e.clientY / window.innerHeight - 0.5) * 0.3;
      if (canPlasma && e.pointerType !== "touch") {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      }
    },
    { passive: true }
  );
  document.documentElement.addEventListener("mouseleave", () => (pointer.active = false));

  // Un único bucle de requestAnimationFrame, que se para cuando el hero no se ve
  let rafId = 0;
  let last = 0;
  const loop = (time) => {
    const dt = Math.min((time - last) / 16.67, 3); // normaliza a ~60 fps
    last = time;
    rotY += 0.0012 * dt;
    tilt.x += (target.x - tilt.x) * 0.04 * dt;
    tilt.y += (target.y - tilt.y) * 0.04 * dt;
    if (canPlasma) updatePlasma(time, dt);
    draw();
    rafId = requestAnimationFrame(loop);
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    } else if (!entry.isIntersecting && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }).observe(hero);
}

/* ---------- Fondo de Skills: red de nodos que se conectan por cercanía ---------- */
function initSkillsNetwork() {
  const canvas = document.getElementById("skillsNetwork");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const section = canvas.parentElement;

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const LINK = 140;          // distancia máxima entre nodos para unirlos (px)
  const LINK_CURSOR = 190;   // el cursor alcanza un poco más lejos
  const LEVELS = 8;          // las líneas se agrupan en 8 opacidades: 8 trazos por fotograma, no uno por línea
  const MAX_LINE_ALPHA = 0.46; // algo más opacas para compensar el grosor de 1 px
  const DOT_ALPHA = 0.6;
  const DOT_RADIUS = 2.1;
  const LINE_WIDTH = 1;      // 1 px: Skia lo pinta como "hairline" (ruta rápida); 1.4 costaba el doble de GPU

  let w = 0, h = 0, count = 0;
  let px, py, vx, vy;
  const paths = Array.from({ length: LEVELS }, () => new Path2D());
  const cursor = { x: 0, y: 0, active: false };

  const dotSprite = document.createElement("canvas");
  dotSprite.width = dotSprite.height = 16;
  const dctx = dotSprite.getContext("2d");
  dctx.fillStyle = accent;
  dctx.arc(8, 8, 8, 0, Math.PI * 2);
  dctx.fill();

  // Densidad según el área, con tope para que el O(n²) de las distancias siga siendo barato
  const build = () => {
    const n = Math.min(Math.round((w * h) / 11000), w < 768 ? 45 : 90);
    if (n === count) return;
    count = n;
    px = new Float32Array(n); py = new Float32Array(n);
    vx = new Float32Array(n); vy = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      px[i] = Math.random() * w;
      py[i] = Math.random() * h;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.12 + Math.random() * 0.18; // deriva lenta
      vx[i] = Math.cos(angle) * speed;
      vy[i] = Math.sin(angle) * speed;
    }
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  // Suma la línea a al grupo de opacidad que le toca según la distancia
  const addLink = (x1, y1, x2, y2, d2, max) => {
    const t = 1 - Math.sqrt(d2) / max; // 1 = pegados, 0 = en el límite
    const level = Math.min(LEVELS - 1, (t * LEVELS) | 0);
    paths[level].moveTo(x1, y1);
    paths[level].lineTo(x2, y2);
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let l = 0; l < LEVELS; l++) paths[l] = new Path2D();

    const link2 = LINK * LINK;
    const cursor2 = LINK_CURSOR * LINK_CURSOR;
    for (let i = 0; i < count; i++) {
      const xi = px[i], yi = py[i];
      for (let j = i + 1; j < count; j++) {
        const dx = xi - px[j], dy = yi - py[j];
        const d2 = dx * dx + dy * dy;
        if (d2 < link2) addLink(xi, yi, px[j], py[j], d2, LINK);
      }
      if (cursor.active) {
        const dx = xi - cursor.x, dy = yi - cursor.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < cursor2) addLink(xi, yi, cursor.x, cursor.y, d2, LINK_CURSOR);
      }
    }

    ctx.strokeStyle = accent;
    ctx.lineWidth = LINE_WIDTH;
    for (let l = 0; l < LEVELS; l++) {
      ctx.globalAlpha = ((l + 1) / LEVELS) * MAX_LINE_ALPHA;
      ctx.stroke(paths[l]);
    }

    // Nodos copiando un sprite: más barato para la GPU que un path con decenas de arcos
    ctx.globalAlpha = DOT_ALPHA;
    for (let i = 0; i < count; i++) {
      ctx.drawImage(dotSprite, px[i] - DOT_RADIUS, py[i] - DOT_RADIUS, DOT_RADIUS * 2, DOT_RADIUS * 2);
    }
    ctx.globalAlpha = 1;
  };

  const step = (dt) => {
    for (let i = 0; i < count; i++) {
      px[i] += vx[i] * dt;
      py[i] += vy[i] * dt;
      // rebotan en los bordes en vez de reaparecer de golpe
      if (px[i] < 0 || px[i] > w) { vx[i] = -vx[i]; px[i] = Math.max(0, Math.min(w, px[i])); }
      if (py[i] < 0 || py[i] > h) { vy[i] = -vy[i]; py[i] = Math.max(0, Math.min(h, py[i])); }
    }
  };

  resize();
  new ResizeObserver(() => { resize(); if (prefersReducedMotion) draw(); }).observe(section);

  // Con movimiento reducido se queda como un fondo estático
  if (prefersReducedMotion) { draw(); return; }

  // El canvas no recibe eventos (pointer-events: none): se escucha en la sección
  section.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    clientX = e.clientX;
    clientY = e.clientY;
    cursor.active = true;
  }, { passive: true });
  section.addEventListener("pointerleave", () => (cursor.active = false));

  // Se guarda la posición en la ventana y se pasa al canvas en cada fotograma,
  // para que siga cuadrando si la página hace scroll con el ratón quieto
  let clientX = 0, clientY = 0;
  let rect = null; // posición del canvas en pantalla: se mide solo tras scroll o resize
  const invalidate = () => (rect = null);
  window.addEventListener("scroll", invalidate, { passive: true });
  window.addEventListener("resize", invalidate);
  const syncCursor = () => {
    if (!cursor.active) return;
    if (!rect) rect = canvas.getBoundingClientRect();
    cursor.x = clientX - rect.left;
    cursor.y = clientY - rect.top;
  };

  // Bucle propio que solo corre mientras la sección está en pantalla
  let rafId = 0;
  let last = 0;
  const loop = (time) => {
    const dt = Math.min((time - last) / 16.67, 3);
    last = time;
    step(dt);
    syncCursor();
    draw();
    rafId = requestAnimationFrame(loop);
  };

  // Con solo una franja a la vista (p. ej. el borde inferior mientras se leen los proyectos)
  // el canvas se queda quieto: redibujarlo entero cada fotograma para 80 px no compensa
  const MIN_VISIBLE = 0.15;
  new IntersectionObserver(([entry]) => {
    const visible = entry.intersectionRatio >= MIN_VISIBLE;
    if (visible && !rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    } else if (!visible && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }, { threshold: [0, MIN_VISIBLE] }).observe(section);
}

/* ---------- El hero se aleja suavemente al hacer scroll ---------- */
function initHeroParallax() {
  const scrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__content", { yPercent: -20, opacity: 0.2, ease: "none", scrollTrigger: scrub });
  gsap.to(".hero__bg", { yPercent: 30, ease: "none", scrollTrigger: { ...scrub } });
}

/* ---------- Apariciones al hacer scroll (fade + slide con stagger) ---------- */
function initScrollReveals() {
  const offsetFor = (el) => {
    if (el.classList.contains("reveal--left")) return { x: -60 };
    if (el.classList.contains("reveal--right")) return { x: 60 };
    if (el.classList.contains("reveal--zoom")) return { scale: 0.9 };
    return { y: 60 };
  };

  gsap.utils.toArray(".reveal").forEach((el) => gsap.set(el, { autoAlpha: 0, ...offsetFor(el) }));

  // batch agrupa los elementos que entran a la vez y los escalona
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        overwrite: "auto",
      }),
  });

  // La línea junto a cada título se dibuja de izquierda a derecha
  gsap.utils.toArray(".section__title").forEach((title) => {
    gsap.fromTo(
      title,
      { "--line": 0 },
      {
        "--line": 1,
        duration: 1.4,
        delay: 0.2,
        ease: "expo.inOut",
        scrollTrigger: { trigger: title, start: "top 88%", once: true },
      }
    );
  });
}

/* ---------- Cards de proyectos: tilt 3D + parallax de imagen + borde que sigue al ratón ---------- */
function initProjectCards() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    const img = card.querySelector(".project-card__img");
    const ease = { duration: 0.6, ease: "power3.out" };

    gsap.set(card, { transformPerspective: 900 });
    const rotX = gsap.quickTo(card, "rotationX", ease);
    const rotY = gsap.quickTo(card, "rotationY", ease);
    const imgX = gsap.quickTo(img, "x", ease);
    const imgY = gsap.quickTo(img, "y", ease);

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-hovered");
      gsap.to(card, { scale: 1.03, ...ease, overwrite: "auto" });
      gsap.to(img, { scale: 1.22, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    });

    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0 → 1
      const py = (e.clientY - r.top) / r.height;

      rotY((px - 0.5) * 12);
      rotX((0.5 - py) * 12);
      imgX((0.5 - px) * 24); // la imagen se mueve al contrario → profundidad
      imgY((0.5 - py) * 24);

      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-hovered");
      rotX(0);
      rotY(0);
      imgX(0);
      imgY(0);
      gsap.to(card, { scale: 1, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      gsap.to(img, { scale: 1.12, duration: 0.9, ease: "power3.out", overwrite: "auto" });
    });
  });
}

/* ---------- Tooltips de los badges: se desplazan para no salirse de su tarjeta ---------- */
function initTooltips() {
  const margin = 12;

  document.querySelectorAll(".tags li").forEach((badge) => {
    const tip = badge.querySelector(".tip");
    if (!tip) return;
    const bounds = badge.closest(".project-card") || document.documentElement;

    // Se calcula desde el badge (no desde el tooltip, que puede estar a mitad de transición)
    const fit = () => {
      const b = badge.getBoundingClientRect();
      const box = bounds.getBoundingClientRect();
      const left = b.left + b.width / 2 - tip.offsetWidth / 2;
      const right = left + tip.offsetWidth;
      let shift = 0;
      if (left < box.left + margin) shift = box.left + margin - left;
      else if (right > box.right - margin) shift = box.right - margin - right;
      tip.style.setProperty("--tip-shift", `${shift}px`);
    };

    badge.addEventListener("pointerenter", fit);
    badge.addEventListener("focusin", fit);
  });
}

/* ---------- Efecto máquina de escribir en el hero ---------- */
function initTyped({ delay = 0, onFirstTyped } = {}) {
  const el = document.querySelector(".typed");
  if (!el) return;

  const roles = el.dataset.roles.split("|");

  if (prefersReducedMotion) {
    el.textContent = roles[0];
    onFirstTyped?.();
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  // Con el hero fuera de pantalla (o la pestaña oculta) no se escribe: cada letra es un layout
  let heroVisible = true;
  new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting)).observe(el.closest("section") || el);

  const tick = () => {
    if (!heroVisible || document.hidden) return setTimeout(tick, 500);
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = current.slice(0, charIndex);

    let next = deleting ? 40 : 90;

    if (!deleting && charIndex === current.length) {
      // aviso (una sola vez) de que la primera frase ya está escrita
      if (onFirstTyped) {
        onFirstTyped();
        onFirstTyped = null;
      }
      next = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      next = 400;
    }

    setTimeout(tick, next);
  };

  setTimeout(tick, delay);
}

/* ---------- Resalta el link de la sección visible ---------- */
function initActiveLinks() {
  const links = document.querySelectorAll(".nav__link");
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ---------- Trayectoria: línea de energía. La carga baja con el scroll y enciende cada nodo ---------- */
// Todo el "show" va en un canvas encima de la línea: el rayo con su chisporroteo, los pulsos que lo
// recorren, las órbitas de los nodos encendidos, ondas expansivas, rayos hacia las tarjetas y chispas
function initTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;
  const canvas = timeline.querySelector(".timeline__fx");
  const ctx = canvas.getContext("2d");
  const checkpoints = [...timeline.querySelectorAll(".checkpoint")];
  const nodes = checkpoints.map((c) => c.querySelector(".checkpoint__node"));
  const cards = checkpoints.map((c) => c.querySelector(".checkpoint__card"));

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const PAD = 100;         // el canvas sobresale 100 px por arriba y por abajo (ver CSS)
  const MAX = 700;         // tope de chispas vivas
  const START = "62%";     // altura de la pantalla a la que va la cabeza de la carga

  // Posición sin transforms (las tarjetas entran desplazadas): se suman los offset hasta la línea
  const offsetIn = (el) => {
    let x = 0, y = 0;
    for (let n = el; n && n !== timeline; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  };

  let trackX = 0, trackTop = 0, trackH = 1, w = 0, h = 0;
  let scale = 1; // en móvil la línea va pegada al borde: órbitas y halos más pequeños para que no se corten
  let points = [];  // centro de cada nodo y borde de su tarjeta más cercano a la línea
  let stops = [];   // 0 → 1: en qué punto de la carga se enciende cada nodo
  const measure = () => {
    points = nodes.map((n, i) => {
      const o = offsetIn(n);
      const c = offsetIn(cards[i]);
      const x = o.x + n.offsetWidth / 2;
      const left = c.x + cards[i].offsetWidth / 2 < x; // tarjeta a la izquierda del nodo
      return { x, y: o.y + n.offsetHeight / 2, edge: left ? c.x + cards[i].offsetWidth : c.x, left };
    });
    trackX = points[0].x;
    trackTop = points[0].y;
    trackH = Math.max(1, points[points.length - 1].y - trackTop);
    stops = points.map((p) => (p.y - trackTop) / trackH);
    timeline.style.setProperty("--track-top", `${trackTop}px`);
    timeline.style.setProperty("--track-h", `${trackH}px`);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    scale = w < 600 ? 0.62 : 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Sin animaciones: línea cargada, nodos encendidos y tarjetas visibles desde el principio
  if (!animate) {
    measure();
    new ResizeObserver(measure).observe(timeline);
    timeline.classList.add("is-static");
    checkpoints.forEach((c) => c.classList.add("is-active"));
    return;
  }

  // Sprite de luz: núcleo blanco que se funde al acento (se reutiliza para todo lo que brilla)
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const sctx = sprite.getContext("2d");
  const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(0.2, accent);
  sctx.fillStyle = accent; // el canvas normaliza el color a #rrggbb y de ahí sale la versión translúcida
  const [r, g, b] = sctx.fillStyle.match(/\w\w/g).map((hex) => parseInt(hex, 16));
  grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.35)`);
  grad.addColorStop(1, "transparent");
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 64, 64);
  const glow = (x, y, size, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  };

  /* ----- Chispas: arrays planos, sin objetos que recoger cada fotograma ----- */
  const px = new Float32Array(MAX), py = new Float32Array(MAX);
  const vx = new Float32Array(MAX), vy = new Float32Array(MAX);
  const life = new Float32Array(MAX), ttl = new Float32Array(MAX), size = new Float32Array(MAX);
  let alive = 0;

  const spark = (x, y, speed, spread = Math.PI * 2, dir = 0, big = 1) => {
    if (alive >= MAX) return;
    const i = alive++;
    const a = dir + (Math.random() - 0.5) * spread;
    const s = speed * (0.3 + Math.random() * 0.7);
    px[i] = x; py[i] = y + PAD;
    vx[i] = Math.cos(a) * s;
    vy[i] = Math.sin(a) * s;
    ttl[i] = life[i] = 35 + Math.random() * 65; // en fotogramas de 60 fps
    size[i] = (4 + Math.random() * 9) * big;
  };

  const stepSparks = (dt) => {
    const drag = Math.pow(0.95, dt);
    for (let i = 0; i < alive; i++) {
      life[i] -= dt;
      if (life[i] <= 0) {
        // se cambia por la última viva: el array sigue compacto
        const j = --alive;
        px[i] = px[j]; py[i] = py[j]; vx[i] = vx[j]; vy[i] = vy[j];
        life[i] = life[j]; ttl[i] = ttl[j]; size[i] = size[j];
        i--;
        continue;
      }
      vx[i] *= drag;
      vy[i] = vy[i] * drag - 0.014 * dt; // la energía tiende a subir
      px[i] += vx[i] * dt;
      py[i] += vy[i] * dt;
    }
  };

  /* ----- Ondas expansivas y rayos (pocos a la vez: aquí sí valen objetos) ----- */
  const waves = [];
  const bolts = [];

  const wave = (x, y, delay = 0, max = 110) => waves.push({ x, y: y + PAD, t: -delay, max });

  // Rayo quebrado por desplazamiento del punto medio: se genera una vez y se desvanece
  const bolt = (x1, y1, x2, y2, ttl = 20, width = 1.6) => {
    let pts = [[x1, y1 + PAD], [x2, y2 + PAD]];
    let off = Math.hypot(x2 - x1, y2 - y1) * 0.22;
    for (let k = 0; k < 5; k++) {
      const next = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
        next.push([(ax + bx) / 2 + (Math.random() - 0.5) * off, (ay + by) / 2 + (Math.random() - 0.5) * off], pts[i]);
      }
      pts = next;
      off /= 2;
    }
    bolts.push({ pts, life: ttl, ttl, width });
  };

  /* ----- Pulsos que bajan por el tramo cargado ----- */
  const pulses = [];
  let nextPulse = 0;

  /* ----- Estado de la carga ----- */
  const charge = { p: 0, target: 0 };
  let lastP = 0;
  let headSpeed = 0;
  const flash = new Float32Array(checkpoints.length); // destello de cada nodo al encenderse
  const nextArc = new Float32Array(checkpoints.length).fill(60);
  const shown = new Set();
  const hovered = new Set();

  // La tarjeta se materializa desde el nodo: se abre (clip-path) desde el lado de la línea
  const reveal = (i) => {
    if (shown.has(i)) return;
    shown.add(i);
    const card = cards[i];
    const fromNode = points[i].left ? "inset(0% 0% 0% 100% round 14px)" : "inset(0% 100% 0% 0% round 14px)";
    gsap.fromTo(card,
      { autoAlpha: 0, x: points[i].left ? 40 : -40, clipPath: fromNode, filter: "blur(8px) brightness(2)" },
      {
        autoAlpha: 1, x: 0, clipPath: "inset(0% 0% 0% 0% round 14px)", filter: "blur(0px) brightness(1)",
        duration: 0.9, ease: "expo.out", clearProps: "clipPath,filter",
      });
    gsap.from(card.children, { autoAlpha: 0, y: 14, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.18 });
  };

  const ignite = (i) => {
    const p = points[i];
    flash[i] = 1;
    for (let k = 0; k < 70; k++) spark(p.x, p.y, 5.5, Math.PI * 2, 0, 1.1);
    wave(p.x, p.y);
    wave(p.x, p.y, 7, 70);
    for (let k = 0; k < 3; k++) bolt(p.x, p.y, p.edge, p.y + (Math.random() - 0.5) * 50, 22 + k * 6, 2);
    reveal(i);
  };

  const apply = (silent = false) => {
    const p = charge.p;
    headSpeed = Math.max(headSpeed, Math.abs(p - lastP) * trackH);
    // Al bajar se enciende (con todo el espectáculo); al volver a subir se apaga en silencio
    checkpoints.forEach((c, i) => {
      const on = p >= stops[i] - 0.001;
      if (on === c.classList.contains("is-active")) return;
      c.classList.toggle("is-active", on);
      if (!on) return;
      if (!silent && p > lastP) ignite(i);
      else reveal(i);
    });
    lastP = p;
  };

  measure();
  const follow = (self) => (charge.target = self.progress);
  ScrollTrigger.create({
    trigger: timeline,
    start: () => `top+=${trackTop} ${START}`,
    end: () => `top+=${trackTop + trackH} ${START}`,
    invalidateOnRefresh: true,
    onUpdate: follow,
    onRefresh: follow,
  });
  new ResizeObserver(() => { measure(); ScrollTrigger.refresh(); }).observe(timeline);

  // Años gigantes con parallax: se mueven a otra velocidad que la línea
  checkpoints.forEach((c) => {
    const year = c.querySelector(".checkpoint__year");
    if (year) gsap.fromTo(year, { yPercent: 60 }, { yPercent: -60, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Ratón: foco en la tarjeta, y su nodo suelta un rayo y más chispas
  cards.forEach((card, i) => {
    card.addEventListener("pointerenter", () => {
      hovered.add(i);
      if (!checkpoints[i].classList.contains("is-active")) return;
      const p = points[i];
      bolt(p.x, p.y, p.edge, p.y + (Math.random() - 0.5) * 30, 18);
      wave(p.x, p.y, 0, 60);
    });
    card.addEventListener("pointerleave", () => hovered.delete(i));
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  /* ----- Dibujo ----- */
  let time = 0;

  const drawBeam = (headY) => {
    const top = trackTop + PAD, bottom = headY + PAD;
    if (bottom - top < 1) return;

    // halo ancho + núcleo + hilo blanco
    ctx.globalAlpha = 0.14;
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(trackX, top); ctx.lineTo(trackX, bottom); ctx.stroke();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.strokeStyle = accent;

    // dos hilos eléctricos que serpentean alrededor del rayo y cambian en cada fotograma
    ctx.lineWidth = 1;
    for (let s = 0; s < 2; s++) {
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      for (let y = top; y <= bottom; y += 9) {
        const x = trackX + Math.sin(y * 0.045 + time * (0.12 + s * 0.05) + s * 2) * 4 + (Math.random() - 0.5) * 2.4;
        y === top ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // pulsos: destellos alargados que bajan hasta la cabeza
    for (const pulse of pulses) {
      const y = top + pulse.y;
      const g = ctx.createLinearGradient(0, y - 70, 0, y);
      g.addColorStop(0, "transparent");
      g.addColorStop(1, "#fff");
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = g;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(trackX, Math.max(top, y - 70)); ctx.lineTo(trackX, y); ctx.stroke();
      glow(trackX, y, 26, 0.8);
    }
    ctx.strokeStyle = accent;
  };

  const drawNode = (i, dt) => {
    const p = points[i];
    const y = p.y + PAD;
    const f = flash[i];
    const breathe = 0.5 + 0.5 * Math.sin(time * 0.06 + i);
    const boost = (hovered.has(i) ? 1.4 : 1) * scale;

    // halo que respira (y destella al encenderse)
    glow(p.x, y, (70 + breathe * 18 + f * 120) * boost, 0.32 + f * 0.6);

    // electrones en tres órbitas inclinadas, con estela
    for (let o = 0; o < 3; o++) {
      const r = (24 + o * 9) * boost;
      const tilt = o * 1.05 + i;
      const cos = Math.cos(tilt), sin = Math.sin(tilt);
      for (let k = 0; k < 4; k++) {
        const ang = time * (0.05 + o * 0.018) * (o % 2 ? -1 : 1) + o * 2.1 - k * 0.14;
        const ex = Math.cos(ang) * r, ey = Math.sin(ang) * r * 0.36;
        glow(p.x + ex * cos - ey * sin, y + ex * sin + ey * cos, 9 - k * 1.8, 0.95 - k * 0.22);
      }
    }

    // conexión nodo → tarjeta: trazo discontinuo que corre y una bola que lo recorre
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 7]);
    ctx.lineDashOffset = (p.left ? 1 : -1) * time * 0.8;
    ctx.beginPath(); ctx.moveTo(p.x, y); ctx.lineTo(p.edge, y); ctx.stroke();
    ctx.setLineDash([]);
    const run = ((time * 0.012 + i * 0.37) % 1);
    glow(p.x + (p.edge - p.x) * run, y, 14, 0.9 * Math.sin(run * Math.PI));

    // de vez en cuando suelta un arco pequeño hacia fuera
    nextArc[i] -= dt * (hovered.has(i) ? 3 : 1);
    if (nextArc[i] <= 0) {
      nextArc[i] = 70 + Math.random() * 150;
      const a = Math.random() * Math.PI * 2, d = 34 + Math.random() * 40;
      bolt(p.x, p.y, p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 14, 1.1);
      for (let k = 0; k < 6; k++) spark(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 1.6);
    }

    // chispas sueltas
    if (Math.random() < 0.09 * dt * boost) spark(p.x, p.y, 1.3);
    flash[i] = Math.max(0, f - 0.03 * dt);
  };

  const draw = (dt) => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = accent;
    ctx.lineCap = "round";

    const headY = trackTop + charge.p * trackH;
    drawBeam(headY);

    checkpoints.forEach((c, i) => {
      if (c.classList.contains("is-active")) drawNode(i, dt);
      else if (c.classList.contains("checkpoint--next")) glow(points[i].x, points[i].y + PAD, 50 + 10 * Math.sin(time * 0.08), 0.35);
    });

    // cabeza de la carga: núcleo blanco que vibra
    if (charge.p > 0.001 && charge.p < 0.999) {
      const jitter = 1 + Math.random() * 0.25 + Math.min(headSpeed / 10, 0.6);
      glow(trackX, headY + PAD, 64 * jitter, 0.85);
      glow(trackX, headY + PAD, 18, 1);
    }

    // ondas expansivas
    ctx.lineWidth = 2;
    for (const wv of waves) {
      if (wv.t < 0) continue;
      const k = wv.t / 40;
      ctx.globalAlpha = (1 - k) * 0.8;
      ctx.beginPath(); ctx.arc(wv.x, wv.y, 4 + k * wv.max, 0, Math.PI * 2); ctx.stroke();
    }

    // rayos: trazo ancho y tenue + trazo fino casi blanco
    for (const b of bolts) {
      const a = b.life / b.ttl;
      ctx.beginPath();
      b.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.globalAlpha = a * 0.35;
      ctx.lineWidth = b.width * 4;
      ctx.stroke();
      ctx.globalAlpha = a;
      ctx.lineWidth = b.width;
      ctx.strokeStyle = "#ffe6c2";
      ctx.stroke();
      ctx.strokeStyle = accent;
    }

    // chispas
    for (let i = 0; i < alive; i++) {
      const t = life[i] / ttl[i];
      const s = size[i] * (0.35 + 0.65 * t);
      ctx.globalAlpha = t * t;
      ctx.drawImage(sprite, px[i] - s / 2, py[i] - s / 2, s, s);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  const step = (dt) => {
    time += dt;

    // la carga persigue al scroll con suavidad
    if (charge.p !== charge.target) {
      charge.p += (charge.target - charge.p) * (1 - Math.pow(0.9, dt));
      if (Math.abs(charge.target - charge.p) < 0.0005) charge.p = charge.target; // remata sin quedarse en 0.9998
      apply();
    }

    const span = charge.p * trackH;

    // pulsos: nacen arriba y mueren al llegar a la cabeza
    nextPulse -= dt;
    if (nextPulse <= 0 && span > 60) {
      pulses.push({ y: 0, v: 7 + Math.random() * 4 });
      nextPulse = 28 + Math.random() * 40;
    }
    for (let k = pulses.length - 1; k >= 0; k--) {
      pulses[k].y += pulses[k].v * dt;
      if (pulses[k].y >= span) {
        // al llegar a la cabeza, chisporrotea
        for (let s = 0; s < 5; s++) spark(trackX, trackTop + span, 2.2);
        pulses.splice(k, 1);
      }
    }

    // estela de la cabeza mientras avanza
    if (charge.p > 0.002 && charge.p < 0.998) {
      let n = (0.25 + Math.min(headSpeed / 3, 2)) * dt;
      while (n > 0) { if (Math.random() < n) spark(trackX, trackTop + span, 2.4, 1.8, -Math.PI / 2); n--; }
    }
    headSpeed *= Math.pow(0.88, dt);

    for (let k = waves.length - 1; k >= 0; k--) if ((waves[k].t += dt) > 40) waves.splice(k, 1);
    for (let k = bolts.length - 1; k >= 0; k--) if ((bolts[k].life -= dt) <= 0) bolts.splice(k, 1);
    stepSparks(dt);
  };

  // Bucle propio que solo corre con la línea en pantalla
  let rafId = 0;
  let last = 0;
  const loop = (now) => {
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    step(dt);
    draw(dt);
    rafId = requestAnimationFrame(loop);
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(loop);
    } else if (!entry.isIntersecting && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
      alive = 0;
      waves.length = bolts.length = pulses.length = 0;
      ctx.clearRect(0, 0, w, h);
      // fuera de pantalla se salta directamente al estado final, sin espectáculo
      charge.p = charge.target;
      apply(true);
    }
  }).observe(timeline);
}
