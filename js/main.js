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
  initContact();
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
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6c5cff";
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
  const plasmaRgb = toRgb("#21e6c1");
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

/* ---------- Trayectoria: un cerebro que recuerda y un hilo de energía que baja encendiendo cada recuerdo ---------- */
// Todo se pinta en un canvas del tamaño de la pantalla (pegado con sticky) que solo dibuja lo visible.
// Arriba, un cerebro de neuronas que "arranca" y va recordando; de su tronco baja el hilo haciendo bucles
// hasta cada nodo, y de cada nodo salen unas pocas dendritas que conectan con las tarjetas vecinas
function initTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;
  const fx = timeline.querySelector(".timeline__fx");
  const canvas = fx.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const bootLabel = timeline.querySelector(".timeline__boot");
  const checkpoints = [...timeline.querySelectorAll(".checkpoint")];
  const nodes = checkpoints.map((c) => c.querySelector(".checkpoint__node"));
  const cards = checkpoints.map((c) => c.querySelector(".checkpoint__card"));
  const section = timeline.closest("section");

  const PAD = 100;       // la capa del canvas sobresale 100 px por arriba y por abajo (ver CSS)
  const MAX = 450;       // tope de chispas vivas
  const START = "62%";   // altura de la pantalla a la que va la cabeza de la carga
  const STEPS = 90;      // muestras por tramo entre dos nodos
  const BOOT = 300;      // fotogramas (a 60 fps) que tarda el cerebro en arrancar

  // Paleta "fuego y hielo": el hilo es fuego (ámbar → oro → brasa) y la electricidad es hielo azulado.
  // main: experiencia y el hilo · spark: formación, rayos, sinapsis e impulsos · alt: proyectos · next: la PR
  const PALETTE = { main: [108, 92, 255], spark: [33, 230, 193], alt: [255, 92, 200], next: [198, 208, 255], mid: [179, 168, 255] };
  const KIND_COLOR = { work: "main", edu: "spark", proj: "alt", next: "next" };
  const FLOW = [PALETTE.main, PALETTE.mid, PALETTE.alt, PALETTE.mid]; // ciclo de color a lo largo del hilo
  const rgb = ([r, g, b]) => `rgb(${r}, ${g}, ${b})`;
  // el CSS (tarjetas, leyenda, niebla) toma los mismos colores
  if (section) {
    ["main", "spark", "alt", "next", "mid"].forEach((k) => section.style.setProperty(`--tl-${k}`, rgb(PALETTE[k])));
    section.style.setProperty("--neb", rgb(PALETTE.main));
  }
  // 64 tonos precalculados del ciclo: así no se construyen strings de color en cada trazo
  const FLOW_STEPS = 64;
  const flowColors = Array.from({ length: FLOW_STEPS }, (_, k) => {
    const u = (k / FLOW_STEPS) * FLOW.length;
    const a = FLOW[Math.floor(u) % FLOW.length], b = FLOW[(Math.floor(u) + 1) % FLOW.length], f = u % 1;
    return rgb(a.map((v, j) => Math.round(v + (b[j] - v) * f)));
  });
  const flowAt = (u) => flowColors[((Math.floor(u * FLOW_STEPS) % FLOW_STEPS) + FLOW_STEPS) % FLOW_STEPS];
  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  // Posición sin transforms (las tarjetas entran desplazadas): se suman los offset hasta la línea
  const offsetIn = (el) => {
    let x = 0, y = 0;
    for (let n = el; n && n !== timeline; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  };

  /* ----- Geometría: tramos entre nodos con forma de trocoide (un bucle en medio de cada uno) ----- */
  // Coordenadas: x e y de los nodos y tramos van respecto a la línea; al pintar se suma PAD
  let w = 0, H = 0, ch = 0, dpr = 1, mobile = false, total = 1;
  let viewTop = 0;    // qué franja de la capa (de alto H) está cubriendo el canvas ahora mismo
  let points = [];    // centro de cada nodo, color y borde de su tarjeta más cercano al hilo
  let segs = [];      // tramos: parámetros de la curva + tabla de longitudes para recorrerla a velocidad constante
  let stops = [];     // 0 → 1: en qué punto de la carga se enciende cada nodo

  // Punto del tramo en t ∈ [0, 1] sin ondulación. θ va de -π a π: en los extremos la curva sale
  // vertical del nodo y en el centro (b > a) da la vuelta sobre sí misma → bucle
  const basePoint = (s, t, out) => {
    const th = -Math.PI + 2 * Math.PI * t;
    out.x = s.x0 + s.dir * s.bx * (1 + Math.cos(th));
    out.y = s.y0 + s.a * (th + Math.PI) - s.b * Math.sin(th);
    return out;
  };

  const measure = () => {
    mobile = timeline.clientWidth < 600;
    points = nodes.map((n, i) => {
      const o = offsetIn(n);
      const c = offsetIn(cards[i]);
      const x = o.x + n.offsetWidth / 2;
      const left = c.x + cards[i].offsetWidth / 2 < x; // tarjeta a la izquierda del nodo
      const color = PALETTE[KIND_COLOR[checkpoints[i].dataset.kind] || "main"];
      return { x, y: o.y + n.offsetHeight / 2, edge: left ? c.x + cards[i].offsetWidth : c.x, left, color };
    });

    const tmp = { x: 0, y: 0 };
    let acc = 0;
    segs = [];
    stops = [0];
    for (let i = 0; i < points.length - 1; i++) {
      const p = points[i], q = points[i + 1];
      const d = q.y - p.y;
      const a = d / (2 * Math.PI);
      const s = {
        i, x0: p.x, y0: p.y, a,
        b: a * (mobile ? 1.3 : 1.8),             // > a → bucle; cuanto más, más grande
        bx: mobile ? 10 : 46,                     // anchura del bucle (en móvil casi una onda)
        dir: mobile ? 1 : i % 2 ? -1 : 1,         // en escritorio cada bucle sale hacia un lado
        lut: new Float32Array(STEPS + 1),
        start: acc,
        len: 0,
      };
      let prev = basePoint(s, 0, { x: 0, y: 0 });
      for (let k = 1; k <= STEPS; k++) {
        basePoint(s, k / STEPS, tmp);
        s.lut[k] = s.lut[k - 1] + Math.hypot(tmp.x - prev.x, tmp.y - prev.y);
        prev = { x: tmp.x, y: tmp.y };
      }
      s.len = s.lut[STEPS];
      acc += s.len;
      segs.push(s);
      stops.push(acc);
    }
    total = Math.max(1, acc);
    stops = stops.map((v) => v / total);

    const top = points[0].y, bottom = points[points.length - 1].y;
    timeline.style.setProperty("--track-top", `${top}px`);
    timeline.style.setProperty("--track-h", `${bottom - top}px`);

    // El canvas solo mide lo que la pantalla (+ margen en móvil para cuando se esconde la barra del navegador)
    dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
    w = fx.clientWidth;
    H = fx.clientHeight;
    ch = Math.min(H, window.innerHeight + (mobile ? 120 : 0));
    canvas.style.height = `${ch}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(ch * dpr);
    if (animate) { seedDust(); seedBrain(); seedDendrites(); } // sin animaciones no existen (ni hacen falta)
  };

  // Sin animaciones: línea recta cargada, nodos encendidos y tarjetas visibles desde el principio
  if (!animate) {
    measure();
    new ResizeObserver(measure).observe(timeline);
    timeline.classList.add("is-static");
    checkpoints.forEach((c) => c.classList.add("is-active"));
    if (bootLabel) bootLabel.textContent = `> ${checkpoints.length} recuerdos cargados`;
    return;
  }

  /* ----- Sprites de luz, uno por color (núcleo blanco que se funde al color) ----- */
  const makeSprite = ([r, g, b]) => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.18, `rgb(${r}, ${g}, ${b})`);
    gr.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gr.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    return c;
  };
  const COLORS = [PALETTE.main, PALETTE.spark, PALETTE.alt, PALETTE.next];
  const SPRITES = COLORS.map(makeSprite);
  const spriteOf = (color) => SPRITES[COLORS.indexOf(color)] || SPRITES[0];
  // ámbar la mitad de las veces, brasa y algo de hielo
  const tintRand = () => { const r = Math.random(); return r < 0.5 ? 0 : r < 0.82 ? 2 : 1; };
  const glow = (spr, x, y, size, alpha) => {
    ctx.globalAlpha = alpha;
    ctx.drawImage(spr, x - size / 2, y - size / 2, size, size);
  };
  // ¿Esta altura (ya con PAD) cae en la franja visible? Lo que no, ni se pinta
  const visible = (y, margin = 60) => y > viewTop - margin && y < viewTop + ch + margin;

  /* ----- Chispas: arrays planos, sin objetos que recoger cada fotograma ----- */
  const px = new Float32Array(MAX), py = new Float32Array(MAX);
  const vx = new Float32Array(MAX), vy = new Float32Array(MAX);
  const life = new Float32Array(MAX), ttl = new Float32Array(MAX), size = new Float32Array(MAX);
  const tint = new Uint8Array(MAX);
  let alive = 0;

  // (x, y) en coordenadas de la línea, sin PAD
  const spark = (x, y, speed, spread = Math.PI * 2, dir = 0, big = 1, color = -1) => {
    if (alive >= MAX) return;
    const i = alive++;
    const a = dir + (Math.random() - 0.5) * spread;
    const s = speed * (0.3 + Math.random() * 0.7);
    px[i] = x; py[i] = y + PAD;
    vx[i] = Math.cos(a) * s;
    vy[i] = Math.sin(a) * s;
    ttl[i] = life[i] = 35 + Math.random() * 60; // en fotogramas de 60 fps
    size[i] = (4 + Math.random() * 9) * big;
    tint[i] = color >= 0 ? color : tintRand();
  };

  const stepSparks = (dt) => {
    const drag = Math.pow(0.95, dt);
    for (let i = 0; i < alive; i++) {
      life[i] -= dt;
      if (life[i] <= 0) {
        // se cambia por la última viva: el array sigue compacto
        const j = --alive;
        px[i] = px[j]; py[i] = py[j]; vx[i] = vx[j]; vy[i] = vy[j];
        life[i] = life[j]; ttl[i] = ttl[j]; size[i] = size[j]; tint[i] = tint[j];
        i--;
        continue;
      }
      vx[i] *= drag;
      vy[i] = vy[i] * drag - 0.014 * dt; // la energía tiende a subir
      px[i] += vx[i] * dt;
      py[i] += vy[i] * dt;
    }
  };

  /* ----- Polvo: va pegado a la pantalla (no a la línea), así que con pocas motas basta ----- */
  let dust = [];
  function seedDust() {
    const n = mobile ? 14 : 36;
    const cx = points[0].x;
    dust = Array.from({ length: n }, () => ({
      x: mobile ? Math.random() * 90 : cx + (Math.random() - 0.5) * 420,
      y: Math.random() * ch,
      v: 0.15 + Math.random() * 0.35,
      s: 4 + Math.random() * 8,
      ph: Math.random() * 6.28,
      c: tintRand(),
    }));
  }

  /* ----- El cerebro: corteza con circunvoluciones, cerebelo y tronco, visto de lado (mira a la izquierda) ----- */
  // La textura (pliegues, sombreado y brillo del borde) se genera una sola vez con ruido en un canvas aparte:
  // cada fotograma es un drawImage. Encima van las neuronas, que sí se mueven
  let brain = null;
  let boot = -1;          // -1: aún no se ha visto · 0 → 1: arrancando · 1: listo
  let stemCharge = 0;     // el tronco se carga cuando el cerebro termina de arrancar
  let recall = 0;         // sube cuando se enciende un nodo: el cerebro se agita un momento
  let hud = 1;            // marco del escáner: fuerte mientras arranca, luego casi se apaga
  let bootText = "";
  const synapses = [];
  const stemPulses = [];
  const thoughts = [];    // ondas de actividad que recorren la corteza
  const textures = new Map();

  // Contornos en coordenadas normalizadas u, v ∈ [-1, 1] (v hacia abajo)
  const CEREBRUM = [
    [-0.8, 0.2], [-0.94, 0.04], [-0.98, -0.22], [-0.9, -0.5], [-0.68, -0.76], [-0.36, -0.92], [0.02, -0.97],
    [0.38, -0.89], [0.67, -0.69], [0.87, -0.41], [0.97, -0.09], [0.92, 0.17], [0.76, 0.29], [0.52, 0.32],
    [0.3, 0.4], [0.08, 0.54], [-0.18, 0.6], [-0.4, 0.54], [-0.5, 0.4], [-0.47, 0.25], [-0.6, 0.23],
  ];
  const CEREBELLUM = [[0.34, 0.42], [0.58, 0.32], [0.84, 0.34], [0.97, 0.48], [0.88, 0.65], [0.64, 0.73], [0.42, 0.67], [0.31, 0.54]];
  const BRAINSTEM = [[0.12, 0.44], [0.33, 0.4], [0.37, 0.66], [0.35, 1], [0.23, 1], [0.21, 0.68]];
  // cisura lateral (de Silvio) y surco central: los dos pliegues que hacen que se lea como un cerebro
  const FISSURES = [
    [[-0.47, 0.25], [-0.2, 0.12], [0.12, 0.06], [0.42, -0.1]],
    [[0.08, -0.95], [0.02, -0.62], [-0.06, -0.3], [-0.14, 0.04]],
  ];
  const STEM_ROOT = [0.29, 0.98]; // por aquí sale la médula hacia el hilo
  // dónde se guarda cada recuerdo (uno por etapa); el último, en el cerebelo, es la PR pendiente
  const SPOTS = [[-0.66, -0.18], [-0.34, -0.6], [0.1, -0.7], [0.52, -0.44], [-0.14, 0.36], [0.26, -0.14], [0.64, 0.52]];

  // Catmull-Rom cerrado: el contorno queda redondeado
  const smooth = (poly, steps = 6) => {
    const out = [];
    for (let k = 0; k < poly.length; k++) {
      const p0 = poly[(k - 1 + poly.length) % poly.length], p1 = poly[k];
      const p2 = poly[(k + 1) % poly.length], p3 = poly[(k + 2) % poly.length];
      for (let s = 0; s < steps; s++) {
        const t = s / steps, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
      }
    }
    return out;
  };

  // Ruido de valor con fbm: de aquí salen los pliegues
  const hash = (x, y) => {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const vnoise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x, y) => vnoise(x, y) * 0.6 + vnoise(x * 2.1 + 5.2, y * 2.1 + 1.3) * 0.28 + vnoise(x * 4.3 + 9.1, y * 4.3 + 3.7) * 0.12;
  const sstep = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  function brainTexture(W, Hb, s) {
    const key = `${W}|${s}`;
    if (textures.has(key)) return textures.get(key);
    const m = 14;
    const tw = Math.ceil((W + m * 2) * s), th = Math.ceil((Hb + m * 2) * s);
    const toX = (u) => (m + ((u + 1) / 2) * W) * s, toY = (v) => (m + ((v + 1) / 2) * Hb) * s;
    const path = (c, poly) => {
      c.beginPath();
      poly.forEach(([u, v], k) => (k ? c.lineTo(toX(u), toY(v)) : c.moveTo(toX(u), toY(v))));
      c.closePath();
    };
    const cere = smooth(CEREBRUM), cbl = smooth(CEREBELLUM), stem = smooth(BRAINSTEM, 4);

    // máscara: rojo = corteza, verde = cerebelo, azul = tronco
    const mk = document.createElement("canvas");
    mk.width = tw; mk.height = th;
    const mc = mk.getContext("2d", { willReadFrequently: true });
    [[stem, "#00f"], [cbl, "#0f0"], [cere, "#f00"]].forEach(([poly, col]) => { path(mc, poly); mc.fillStyle = col; mc.fill(); });
    const mask = mc.getImageData(0, 0, tw, th).data;
    // la misma silueta desenfocada dice lo cerca que está cada punto del borde (brillo del contorno = volumen)
    let soft = null;
    if ("filter" in mc) {
      mc.clearRect(0, 0, tw, th);
      mc.filter = `blur(${Math.round(W * 0.03 * s)}px)`;
      mc.fillStyle = "#fff";
      [stem, cbl, cere].forEach((poly) => { path(mc, poly); mc.fill(); });
      mc.filter = "none";
      soft = mc.getImageData(0, 0, tw, th).data;
    }

    const tex = document.createElement("canvas");
    tex.width = tw; tex.height = th;
    const tc = tex.getContext("2d");
    const img = tc.createImageData(tw, th);
    const out = img.data;
    const [ar, ag, ab] = PALETTE.main, [er, eg, eb] = PALETTE.alt;
    for (let y = 0; y < th; y++) {
      const v = ((y / s - m) / Hb) * 2 - 1;
      for (let x = 0; x < tw; x++) {
        const i = (y * tw + x) * 4;
        const cR = mask[i] / 255, cG = mask[i + 1] / 255, cB = mask[i + 2] / 255;
        const inside = Math.max(cR, cG, cB);
        if (inside < 0.01) continue;
        const u = ((x / s - m) / W) * 2 - 1;
        let lines = 0;
        if (cR > 0.02) {
          // pliegues: curvas de nivel de un ruido deformado. Arriba corren más en vertical y en el temporal en horizontal
          const t = sstep(0.12, 0.42, v);
          const fx = 6.2 - 2.8 * t, fy = 3.2 + 3.8 * t;
          const wx = u * fx + 1.6 * fbm(u * 2.4 + 3.1, v * 2.4 + 7.7), wy = v * fy + 1.6 * fbm(u * 2.4 + 11.4, v * 2.4 + 1.9);
          const q = fbm(wx, wy) * 9;
          lines += cR * (1 - sstep(0.015, 0.1, Math.abs(q - Math.round(q))));
        }
        if (cG > 0.02) {
          // cerebelo: láminas finas en arco
          const q = Math.hypot((u - 0.62) * 1.1, (v - 0.18) * 1.7) * 17 + vnoise(u * 9, v * 9) * 1.2;
          lines += cG * 0.65 * (1 - sstep(0.03, 0.12, Math.abs(q - Math.round(q))));
        }
        if (cB > 0.02) {
          const q = (u - v * 0.1) * 34;
          lines += cB * 0.5 * (1 - sstep(0.05, 0.25, Math.abs(q - Math.round(q))));
        }
        // luz desde arriba a la izquierda + borde brillante
        const edge = soft ? 1 - soft[i + 3] / 255 : 0;
        const shade = 0.45 + 0.55 * clamp01(0.55 - v * 0.45 - u * 0.2);
        const I = inside * (0.07 + lines * 0.5 * shade + sstep(0.25, 0.55, edge) * 0.6);
        const warm = Math.min(1, cG * 0.75 + cB * 0.6); // cerebelo y tronco tiran a brasa
        const hot = Math.max(0, I - 0.55) * 1.6; // lo más brillante se va a blanco
        const r = Math.min(255, (ar + (er - ar) * warm) * I + 255 * hot);
        const g = Math.min(255, (ag + (eg - ag) * warm) * I + 230 * hot);
        const b = Math.min(255, (ab + (eb - ab) * warm) * I + 200 * hot);
        // se guarda como luz: alfa = brillo, para que al sumarse ("lighter") no oscurezca el fondo
        const a = Math.max(r, g, b);
        if (a < 1) continue;
        out[i] = (r / a) * 255; out[i + 1] = (g / a) * 255; out[i + 2] = (b / a) * 255; out[i + 3] = a;
      }
    }
    tc.putImageData(img, 0, 0);

    // contornos y las dos cisuras grandes, a trazo
    tc.globalCompositeOperation = "lighter";
    tc.lineCap = tc.lineJoin = "round";
    tc.strokeStyle = rgb(PALETTE.main);
    for (const [poly, a] of [[cere, 0.75], [cbl, 0.55]]) {
      path(tc, poly);
      tc.globalAlpha = 0.12; tc.lineWidth = 7 * s; tc.stroke();
      tc.globalAlpha = a; tc.lineWidth = 1.3 * s; tc.stroke();
    }
    tc.save();
    path(tc, cere);
    tc.clip();
    tc.globalAlpha = 0.7;
    tc.lineWidth = 2 * s;
    tc.beginPath();
    for (const f of FISSURES) {
      tc.moveTo(toX(f[0][0]), toY(f[0][1]));
      for (let k = 1; k < f.length - 1; k++) {
        const last = k === f.length - 2;
        tc.quadraticCurveTo(toX(f[k][0]), toY(f[k][1]), toX(last ? f[k + 1][0] : (f[k][0] + f[k + 1][0]) / 2), toY(last ? f[k + 1][1] : (f[k][1] + f[k + 1][1]) / 2));
      }
    }
    tc.stroke();
    tc.restore();

    const T = { tex, tw, th, m, s, mask, soft, toX, toY };
    textures.set(key, T);
    return T;
  }

  function seedBrain() {
    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const W = mobile ? Math.min(250, w - 70) : 360, Hb = W * 0.66;
    const T = brainTexture(W, Hb, dpr);
    // el tronco del encéfalo queda justo encima del primer nodo: la médula se convierte en el hilo
    const rootX = (STEM_ROOT[0] * W) / 2;
    const cx = mobile ? w / 2 : points[0].x - rootX; // en móvil, centrado (la médula baja en curva al nodo)
    const cy = PAD + 44 + Hb / 2;
    const toXY = (u, v) => [cx + (u * W) / 2, cy + (v * Hb) / 2];
    const texel = (u, v) => {
      const x = Math.round(T.toX(u)), y = Math.round(T.toY(v));
      return x < 0 || y < 0 || x >= T.tw || y >= T.th ? -1 : (y * T.tw + x) * 4;
    };

    // neuronas en la corteza y el cerebelo; la mitad pegadas al borde (marcan la silueta).
    // order: cuándo las alcanza el haz del escáner (va de delante hacia atrás)
    const N = mobile ? 70 : 120;
    const n = [];
    let guard = 0;
    while (n.length < N && guard++ < 30000) {
      const u = rand() * 2 - 1, v = rand() * 2 - 1;
      const i = texel(u, v);
      if (i < 0 || (T.mask[i] < 200 && T.mask[i + 1] < 200)) continue;
      const edge = T.soft ? 1 - T.soft[i + 3] / 255 : 0.4;
      if (n.length % 2 === 0 && edge < 0.3) continue;
      const [x, y] = toXY(u, v);
      if (n.some((o) => (o.x - x) ** 2 + (o.y - y) ** 2 < (W * 0.036) ** 2)) continue;
      n.push({
        x, y, u, v, z: rand(), ph: rand() * 6.28, r: 6 + rand() * 6, flash: 0, on: false, X: x, Y: y,
        c: T.mask[i + 1] > 200 ? 2 : rand() < 0.22 ? 1 : 0, // ámbar, alguna fría (hielo) y el cerebelo en brasa
        order: 0.08 + 0.52 * clamp01((u + 1) / 2) + rand() * 0.015,
      });
    }

    // cada neurona se une a sus 3 vecinas más cercanas
    const e = [];
    const seen = new Set();
    const adj = n.map(() => []);
    n.forEach((m, a) => {
      n.map((o, b) => [b, (o.x - m.x) ** 2 + (o.y - m.y) ** 2])
        .filter(([b]) => b !== a)
        .sort((p, q) => p[1] - q[1])
        .slice(0, 3)
        .forEach(([b, d]) => {
          const key = a < b ? `${a}-${b}` : `${b}-${a}`;
          if (d > (W * 0.2) ** 2 || seen.has(key)) return;
          seen.add(key);
          e.push({ a, b, c: m.c, from: Math.max(m.order, n[b].order) + 0.01 });
          adj[a].push(b);
          adj[b].push(a);
        });
    });

    // recuerdos: cada etapa tiene su sitio y un camino de neuronas hasta el tronco (por ahí baja al hilo)
    const nearest = (u, v) => {
      let best = 0, bd = Infinity;
      n.forEach((o, k) => { const d = (o.u - u) ** 2 + (o.v - v) ** 2; if (d < bd) { bd = d; best = k; } });
      return best;
    };
    const root = nearest(0.24, 0.42);
    const route = (from) => {
      const prev = new Int16Array(n.length).fill(-1);
      prev[from] = from;
      const queue = [from];
      while (queue.length) {
        const a = queue.shift();
        if (a === root) break;
        for (const b of adj[a]) if (prev[b] < 0) { prev[b] = a; queue.push(b); }
      }
      if (prev[root] < 0) return [];
      const out = [root];
      while (out[0] !== from) out.unshift(prev[out[0]]);
      return out;
    };
    let k = 0;
    const memories = checkpoints.filter((c) => c.dataset.kind !== "next").length;
    const hots = checkpoints.map((c, i) => {
      const pending = c.dataset.kind === "next";
      const a = nearest(...(pending ? SPOTS[SPOTS.length - 1] : SPOTS[Math.min(k++, SPOTS.length - 2)]));
      return { i, a, pending, path: pending ? [] : route(a), lit: false, flash: 0, at: 0.64 + (0.3 * i) / checkpoints.length, name: c.dataset.memory || "" };
    });

    // médula: del tronco al primer nodo
    const [sx, sy] = toXY(...STEM_ROOT);
    const p = points[0];
    const stem = { x0: sx, y0: sy, x1: p.x, y1: p.y + PAD - 14, c1x: sx, c1y: sy + 40, c2x: p.x, c2y: p.y + PAD - 60 };
    stem.len = Math.hypot(stem.x1 - stem.x0, stem.y1 - stem.y0) * 1.15;
    const box = { x0: cx - W / 2 - 16, x1: cx + W / 2 + 16, y0: cy - Hb / 2 - 14, y1: cy + Hb / 2 + 10 };
    brain = { cx, cy, W, Hb, n, e, stem, T, hots, memories, root, box, on: 0 };
    // si se vuelve a medir con el cerebro ya arrancado, se queda como estaba
    n.forEach((m) => { if (boot >= m.order) { m.on = true; brain.on++; } });
    hots.forEach((h) => (h.lit = !h.pending && boot >= h.at));
    synapses.length = stemPulses.length = thoughts.length = 0;
  }

  const stemAt = (t, out) => {
    const s = brain.stem, u = 1 - t;
    out.x = u * u * u * s.x0 + 3 * u * u * t * s.c1x + 3 * u * t * t * s.c2x + t * t * t * s.x1;
    out.y = u * u * u * s.y0 + 3 * u * u * t * s.c1y + 3 * u * t * t * s.c2y + t * t * t * s.y1;
    return out;
  };

  // Un recuerdo se enciende: brilla su sitio, una onda recorre la corteza y una señal baja neurona a neurona
  // hasta el tronco (y de ahí, por la médula, al hilo)
  const remember = (i) => {
    const h = brain && brain.hots[i];
    if (!h) return;
    const m = brain.n[h.a];
    h.lit = true;
    h.flash = 1;
    m.flash = 1;
    thoughts.push({ x: m.x, y: m.y, r: 0, max: brain.W * 0.55 });
    if (h.path.length > 1) synapses.push({ a: h.path[0], b: h.path[1], t: 0, v: 1 / 7, c: 1, path: h.path, k: 0 });
  };

  /* ----- Dendritas: cada nodo tiende una hacia la tarjeta de arriba y otra hacia la de abajo (en su lado
     libre). Se ramifican un par de veces y todas las puntas acaban en sinapsis sobre el borde de la tarjeta ----- */
  let trees = [];
  const impulses = [];
  const WIDTHS = [2.3, 1.7, 1.25, 0.95];
  function seedDendrites() {
    const old = trees;
    trees = [];
    impulses.length = 0;
    if (mobile) return; // en móvil las tarjetas ocupan todo el ancho: no hay hueco
    let seed = 4211;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const rects = cards.map((c) => {
      const o = offsetIn(c);
      return { x: o.x, y: o.y, r: o.x + c.offsetWidth, b: o.y + c.offsetHeight };
    });
    // rama: curva cuadrática con el control desviado en perpendicular (no son rectas)
    const branch = (x0, y0, x1, y1, parent, bend, depth, card = -1) => {
      const len = Math.hypot(x1 - x0, y1 - y0);
      const nx = -(y1 - y0) / (len || 1), ny = (x1 - x0) / (len || 1);
      const t0 = parent ? parent.t1 : 0;
      const b = {
        x0, y0, x1, y1, mx: (x0 + x1) / 2 + nx * bend, my: (y0 + y1) / 2 + ny * bend,
        t0, t1: t0 + len * 1.1, parent, leaf: true, glow: 0, card, depth, ph: rand() * 6.28,
      };
      if (parent) parent.leaf = false;
      return b;
    };

    points.forEach((p, i) => {
      const side = p.left ? 1 : -1;
      for (const dirY of [-1, 1]) {
        const j = i + dirY;
        if (j < 0 || j >= cards.length) continue;
        const r = rects[j];
        const ty = dirY < 0 ? r.b : r.y;                     // borde de abajo de la de arriba / de arriba de la de abajo
        const inner = side > 0 ? r.x : r.r;                  // lado de la tarjeta que mira al hilo
        const span = Math.min(250, (r.r - r.x) * 0.6);
        const jx = p.x + side * (55 + rand() * 30), jy = p.y + dirY * (10 + rand() * 14);
        const br = [branch(p.x + side * 14, p.y, jx, jy, null, dirY * side * (6 + rand() * 10), 0)];
        // cada rama avanza hacia su tramo del borde y lo reparte entre sus hijas; en la última, tocan la tarjeta
        const split = (parent, x0, y0, lo, hi, depth) => {
          if (depth >= 3 || (depth === 2 && rand() < 0.35)) {
            br.push(branch(x0, y0, lo + (hi - lo) * (0.3 + rand() * 0.4), ty, parent, side * (rand() - 0.5) * 14, depth, j));
            return;
          }
          const f = 0.38 + rand() * 0.14;
          const kx = x0 + ((lo + hi) / 2 - x0) * f + side * (rand() - 0.5) * 20, ky = y0 + (ty - y0) * f;
          const b = branch(x0, y0, kx, ky, parent, side * (rand() - 0.5) * 36, depth);
          br.push(b);
          const kids = depth < 2 && rand() < 0.3 ? 3 : 2;
          for (let s = 0; s < kids; s++) split(b, kx, ky, lo + ((hi - lo) * s) / kids, lo + ((hi - lo) * (s + 1)) / kids, depth + 1);
        };
        split(br[0], jx, jy, inner + side * 24, inner + side * (24 + span), 1);
        // la de arriba crece al encenderse este nodo; la de abajo, cuando aparece la tarjeta de abajo
        const at = stops[Math.max(i, j)] * total;
        const prev = old.find((t) => t.i === i && t.j === j);
        const ys = br.flatMap((b) => [b.y0, b.y1]);
        trees.push({
          i, j, at, br, color: p.color, col: rgb(p.color), spr: spriteOf(p.color), g: prev ? prev.g : 0,
          leaves: br.filter((b) => b.leaf), maxT: Math.max(...br.map((b) => b.t1)),
          top: Math.min(...ys) - 10, bottom: Math.max(...ys) + 10,
        });
      }
    });
  }

  // Punto de una rama en f ∈ [0, 1], con el control meciéndose (los extremos quedan fijos: siguen conectados)
  const Q = { x: 0, y: 0 };
  const C = { x: 0, y: 0 };
  const branchCtrl = (b) => {
    C.x = b.mx + Math.sin(time * 0.025 + b.ph) * (3 + b.depth * 2);
    C.y = b.my + Math.cos(time * 0.021 + b.ph) * (2 + b.depth * 1.5);
    return C;
  };
  const onBranch = (b, f, out) => {
    const c = branchCtrl(b);
    const u = 1 - f;
    out.x = u * u * b.x0 + 2 * u * f * c.x + f * f * b.x1;
    out.y = u * u * b.y0 + 2 * u * f * c.y + f * f * b.y1 + PAD;
    return out;
  };

  // Impulso por una dendrita hasta una de sus sinapsis (o la indicada)
  const fire = (tree, leaf) => {
    if (impulses.length > 30 || tree.g < 0.98) return;
    leaf = leaf || tree.leaves[(Math.random() * tree.leaves.length) | 0];
    impulses.push({ tree, leaf, d: 0, v: 4 + Math.random() * 3, c: Math.random() < 0.6 ? 1 : 0 });
  };

  // Al llegar un impulso a una tarjeta, su borde da un chispazo
  // (como mucho uno cada 700 ms por tarjeta: cada chispazo repinta la tarjeta entera)
  const zapTimers = [], zapAt = [];
  const zap = (j) => {
    const card = cards[j], now = performance.now();
    if (now - (zapAt[j] || 0) < 700) return;
    zapAt[j] = now;
    card.classList.add("is-zap");
    clearTimeout(zapTimers[j]);
    zapTimers[j] = setTimeout(() => card.classList.remove("is-zap"), 120);
  };

  /* ----- Ondas, rayos y pulsos (pocos a la vez: aquí sí valen objetos) ----- */
  const waves = [];
  const bolts = [];
  const pulses = [];
  let nextPulse = 0, nextImpulse = 0, nextSynapse = 0, nextStem = 0;

  // Onda cromática: tres anillos (cian, rosa, rojo) algo desfasados. (x, y) ya con PAD
  const wave = (x, y, max = 120) => {
    for (let k = 0; k < 3; k++) waves.push({ x, y, t: -k * 4, max: max * (1 - k * 0.12), c: k });
  };

  // Rayo quebrado por desplazamiento del punto medio: se genera una vez y se desvanece (sin PAD)
  const bolt = (x1, y1, x2, y2, ttl = 20, width = 1.6, color = PALETTE.spark) => {
    let pts = [[x1, y1 + PAD], [x2, y2 + PAD]];
    let off = Math.hypot(x2 - x1, y2 - y1) * 0.25;
    for (let k = 0; k < 4; k++) {
      const next = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
        next.push([(ax + bx) / 2 + (Math.random() - 0.5) * off, (ay + by) / 2 + (Math.random() - 0.5) * off], pts[i]);
      }
      pts = next;
      off /= 2;
    }
    bolts.push({ pts, life: ttl, ttl, width, color: rgb(color) });
  };

  /* ----- Estado ----- */
  const charge = { p: 0, target: 0 };
  let lastP = 0;
  let agitation = 0;  // sube con la velocidad del scroll y hace que el hilo se agite
  let time = 0;
  const flash = new Float32Array(checkpoints.length);
  const nextArc = new Float32Array(checkpoints.length).fill(60);
  const shown = new Set();
  const hovered = new Set();
  const cursor = { x: 0, y: 0, active: false, power: 0 };
  let fxRect = fx.getBoundingClientRect();

  // Texto que se "descifra": caracteres aleatorios que van fijándose de izquierda a derecha
  const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
  const scramble = (el, frames = 28) => {
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    let f = 0;
    const tick = () => {
      f++;
      const done = (f / frames) * final.length;
      el.textContent = [...final].map((ch, k) => (ch === " " || k < done ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (f < frames) requestAnimationFrame(tick);
      else el.textContent = final;
    };
    tick();
  };

  // La tarjeta "arranca" como una pantalla CRT: una raya de luz que sale del lado del hilo,
  // se abre en vertical con un fogonazo y el texto se descifra
  const reveal = (i) => {
    if (shown.has(i)) return;
    shown.add(i);
    const card = cards[i];
    const frame = card.querySelector(".checkpoint__frame");
    const origin = points[i].left ? "100% 50%" : "0% 50%";
    gsap.set(card, { autoAlpha: 1 });
    gsap.timeline()
      .fromTo(card, { scaleX: 0, scaleY: 0.012, transformOrigin: origin, filter: "brightness(4) saturate(2)" },
        { scaleX: 1, duration: 0.32, ease: "power4.out" })
      .to(card, { scaleY: 1, duration: 0.42, ease: "expo.out" })
      .to(card, { filter: "brightness(1) saturate(1)", duration: 0.5, ease: "power2.out", clearProps: "filter" }, "<")
      .from(frame.children, { autoAlpha: 0, x: points[i].left ? 14 : -14, duration: 0.45, ease: "power3.out", stagger: 0.06 }, "<0.05");
    card.querySelectorAll(".checkpoint__title, .checkpoint__kind, .checkpoint__id").forEach((el, k) => setTimeout(() => scramble(el), 250 + k * 60));
  };

  const ignite = (i) => {
    const p = points[i];
    const first = !shown.has(i);
    flash[i] = 1;
    recall = 1; // el cerebro "recuerda" esta etapa
    remember(i);
    for (let k = 0; k < (first ? 90 : 30); k++) spark(p.x, p.y, 7, Math.PI * 2, 0, 1.25);
    // sacudida solo la primera vez: si se vuelve a encender no tiembla todo otra vez
    if (first) gsap.fromTo(timeline, { x: 0 }, { keyframes: { x: [0, -6, 5, -3, 2, 0] }, duration: 0.35, ease: "none" });
    wave(p.x, p.y + PAD, first ? 190 : 90);
    for (let k = 0; k < 2; k++) bolt(p.x, p.y, p.edge, p.y + (Math.random() - 0.5) * 60, 22 + k * 6, 2);
    reveal(i);
  };

  const apply = (silent = false) => {
    const p = charge.p;
    // Al bajar se enciende (con todo el espectáculo); al volver a subir se apaga en silencio
    checkpoints.forEach((c, i) => {
      // se enciende al llegar, pero solo se apaga al subir un poco más: así no parpadea
      // (ni explota una y otra vez) si el scroll se queda justo en el umbral
      const was = c.classList.contains("is-active");
      const on = was ? p >= stops[i] - 0.015 : p >= stops[i] - 0.001;
      if (on === was) return;
      c.classList.toggle("is-active", on);
      if (!on) return;
      if (!silent && p > lastP) ignite(i);
      else reveal(i);
    });
    lastP = p;
    // la niebla del fondo se tiñe del color de la última etapa encendida
    let last = 0;
    checkpoints.forEach((c, i) => c.classList.contains("is-active") && (last = i));
    // (la niebla siempre cálida: las etapas frías la tiñen de oro)
    const c = points[last].color;
    const neb = rgb(c === PALETTE.spark || c === PALETTE.next ? PALETTE.mid : c);
    if (section && section.style.getPropertyValue("--neb") !== neb) section.style.setProperty("--neb", neb);
  };

  // El botón de la pull request: al pasar el ratón se "descifra" en el comando de merge
  timeline.querySelectorAll("[data-hover]").forEach((el) => {
    const label = el.textContent;
    const swap = (text) => { el.dataset.text = text; scramble(el, 16); };
    el.addEventListener("pointerenter", () => swap(el.dataset.hover));
    el.addEventListener("pointerleave", () => swap(label));
  });

  measure();
  ScrollTrigger.create({
    trigger: timeline,
    start: () => `top+=${points[0].y} ${START}`,
    end: () => `top+=${points[points.length - 1].y} ${START}`,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      charge.target = self.progress;
      agitation = Math.min(1, agitation + Math.abs(self.getVelocity()) / 6000);
    },
    onRefresh: (self) => (charge.target = self.progress),
  });
  new ResizeObserver(() => { measure(); ScrollTrigger.refresh(); }).observe(timeline);
  // si solo cambia el alto de la ventana (la barra del móvil no cuenta), el canvas se ajusta
  window.addEventListener("resize", () => {
    if (Math.abs(window.innerHeight + (mobile ? 120 : 0) - ch) > 140) measure();
  });

  // Ratón: el hilo se aparta de él y las sinapsis cercanas se disparan
  let clientX = 0, clientY = 0;
  timeline.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    clientX = e.clientX;
    clientY = e.clientY;
    cursor.active = true;
  }, { passive: true });
  timeline.addEventListener("pointerleave", () => (cursor.active = false));

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  cards.forEach((card, i) => {
    card.addEventListener("pointerenter", () => {
      hovered.add(i);
      if (!checkpoints[i].classList.contains("is-active")) return;
      const p = points[i];
      bolt(p.x, p.y, p.edge, p.y + (Math.random() - 0.5) * 30, 18, 1.6);
      wave(p.x, p.y + PAD, 70);
      // las dendritas que llegan a esta tarjeta mandan impulsos
      for (const t of trees) for (const l of t.leaves) if (l.card === i) fire(t, l);
    });
    // inclinación 3D hacia el ratón (solo con ratón de verdad)
    const ease = { duration: 0.6, ease: "power3.out" };
    const rotX = fine && gsap.quickTo(card, "rotationX", ease);
    const rotY = fine && gsap.quickTo(card, "rotationY", ease);
    if (fine) gsap.set(card, { transformPerspective: 900 });

    card.addEventListener("pointerleave", () => {
      hovered.delete(i);
      if (fine) { rotX(0); rotY(0); }
    });
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${mx * 100}%`);
      card.style.setProperty("--my", `${my * 100}%`);
      if (fine) { rotY((mx - 0.5) * 14); rotX((0.5 - my) * 14); }
    });
  });

  /* ----- El hilo vivo: punto del tramo con ondulación + empuje del ratón ----- */
  const livePoint = (s, t, out) => {
    basePoint(s, t, out);
    const env = Math.sin(Math.PI * t); // 0 en los nodos: los extremos no se mueven
    const amp = (mobile ? 3 : 9) + agitation * (mobile ? 10 : 36);
    out.x += env * amp * Math.sin(time * 0.045 + t * 9 + s.i * 1.7);
    out.y += env * amp * 0.45 * Math.cos(time * 0.038 + t * 6 + s.i);
    if (cursor.power > 0.01) {
      const dx = out.x - cursor.x, dy = out.y - cursor.y;
      const d2 = dx * dx + dy * dy, R = 190;
      if (d2 < R * R && d2 > 1) {
        const d = Math.sqrt(d2);
        const f = (1 - d / R) ** 2 * 72 * env * cursor.power;
        out.x += (dx / d) * f;
        out.y += (dy / d) * f;
      }
    }
    return out;
  };

  // Pasa de longitud recorrida (0 → total) a tramo + t, usando las tablas de longitudes
  const locate = (dist, out) => {
    let s = segs[segs.length - 1];
    for (const seg of segs) if (dist <= seg.start + seg.len) { s = seg; break; }
    const local = Math.max(0, Math.min(s.len, dist - s.start));
    let k = 1;
    while (k < STEPS && s.lut[k] < local) k++;
    const f = (local - s.lut[k - 1]) / Math.max(0.001, s.lut[k] - s.lut[k - 1]);
    out.seg = s;
    out.t = (k - 1 + f) / STEPS;
    return out;
  };

  // Buffer de puntos del hilo de este fotograma (se reutiliza). Solo se calculan los tramos visibles
  const MAXPTS = 1200;
  const bx = new Float32Array(MAXPTS), by = new Float32Array(MAXPTS), bs = new Float32Array(MAXPTS);
  let nPts = 0, headIndex = -1, headX = 0, headY = 0;
  const tmp = { x: 0, y: 0 };
  const loc = { seg: null, t: 0 };

  const buildThread = () => {
    nPts = 0;
    const head = charge.p * total;
    headIndex = -1;
    locate(head, loc);
    livePoint(loc.seg, loc.t, tmp);
    headX = tmp.x; headY = tmp.y + PAD;
    for (const s of segs) {
      // tramo entero fuera de la pantalla (con margen para los bucles y el empuje): se salta
      const y0 = Math.min(s.y0, s.y0 + 2 * Math.PI * s.a) + PAD, y1 = s.y0 + 2 * Math.PI * s.a + PAD;
      if (y1 < viewTop - 120 || y0 > viewTop + ch + 120) continue;
      for (let k = 0; k <= STEPS; k++) {
        const dist = s.start + s.lut[k];
        if (headIndex < 0 && dist >= head) {
          // punto exacto de la cabeza, para que el tramo cargado acabe justo ahí
          bx[nPts] = headX; by[nPts] = headY; bs[nPts] = head;
          headIndex = nPts++;
        }
        livePoint(s, k / STEPS, tmp);
        bx[nPts] = tmp.x; by[nPts] = tmp.y + PAD; bs[nPts] = dist;
        nPts++;
      }
    }
    // la cabeza ya pasó todo lo visible: todo lo visible está cargado
    if (headIndex < 0) headIndex = nPts > 0 && bs[nPts - 1] < head ? nPts : 0;
  };

  /* ----- Dibujo ----- */
  // Degradado vertical que "fluye": sustituye a cambiar de color cada pocos puntos (muchos menos trazos)
  const flowGradient = (shift = 0) => {
    const g = ctx.createLinearGradient(0, viewTop, 0, viewTop + ch);
    for (let k = 0; k <= 4; k++) g.addColorStop(k / 4, flowAt((viewTop + (k * ch) / 4) * 0.0025 - time * 0.012 + shift));
    return g;
  };

  const tracePath = (from, to, offset = 0, strand = 0) => {
    ctx.beginPath();
    for (let k = from; k < to; k++) {
      let x = bx[k], y = by[k];
      if (offset) {
        // hélice: desplazamiento perpendicular al hilo que gira con el tiempo
        const k0 = Math.max(0, k - 1), k1 = Math.min(nPts - 1, k + 1);
        const nx = -(by[k1] - by[k0]), ny = bx[k1] - bx[k0];
        const l = Math.hypot(nx, ny) || 1;
        const o = offset * Math.sin(bs[k] * 0.07 - time * 0.16 + strand * Math.PI);
        x += (nx / l) * o; y += (ny / l) * o;
      }
      k === from ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
  };

  const drawThread = () => {
    // tramo aún sin cargar: un hilo fino y discontinuo
    if (headIndex < nPts - 1) {
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = "#fff";
      ctx.setLineDash([2, 7]);
      tracePath(Math.max(0, headIndex), nPts);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (headIndex < 1) return;
    const end = Math.min(headIndex + 1, nPts);
    // tramo cargado: halo ancho, núcleo de color, doble hélice y un hilo blanco por dentro
    const grad = flowGradient();
    ctx.strokeStyle = grad;
    tracePath(0, end);
    ctx.globalAlpha = 0.16; ctx.lineWidth = 20; ctx.stroke();
    ctx.globalAlpha = 0.95; ctx.lineWidth = 3.2; ctx.stroke();
    ctx.globalAlpha = 0.55; ctx.lineWidth = 0.8; ctx.strokeStyle = "#fff"; ctx.stroke();
    ctx.globalAlpha = 0.7; ctx.lineWidth = 1.1;
    ctx.strokeStyle = flowGradient(0.25);
    tracePath(0, end, mobile ? 5 : 11, 0); ctx.stroke();
    ctx.strokeStyle = rgb(PALETTE.spark); // una hebra fría enrollada al fuego
    tracePath(0, end, mobile ? 5 : 11, 1); ctx.stroke();

    // pulsos: cometas de color que recorren el tramo cargado
    for (const pulse of pulses) {
      locate(pulse.s, loc);
      livePoint(loc.seg, loc.t, tmp);
      if (!visible(tmp.y + PAD)) continue;
      for (let k = 0; k < 3; k++) {
        if (k) { locate(Math.max(0, pulse.s - k * 10), loc); livePoint(loc.seg, loc.t, tmp); }
        glow(SPRITES[pulse.c], tmp.x, tmp.y + PAD, 26 - k * 6, 0.95 - k * 0.25);
      }
    }
  };

  const drawBrain = () => {
    const b = brain;
    if (!b || boot < 0 || !visible(b.cy, b.Hb)) return;
    const T = b.T;
    // paralaje con el ratón: las neuronas "de delante" se mueven más que la corteza → profundidad
    const tiltX = cursor.power * Math.max(-1, Math.min(1, (cursor.x - b.cx) / 500));
    const tiltY = cursor.power * Math.max(-1, Math.min(1, (cursor.y + PAD - b.cy) / 400));
    for (const m of b.n) {
      m.X = m.x + Math.sin(time * 0.03 + m.ph) * 1.4 + tiltX * (m.z - 0.3) * 12;
      m.Y = m.y + Math.cos(time * 0.026 + m.ph) * 1.4 + tiltY * (m.z - 0.3) * 8;
    }
    const ix = b.cx - b.W / 2 - T.m - tiltX * 3, iy = b.cy - b.Hb / 2 - T.m - tiltY * 2;
    const iw = T.tw / T.s, ih = T.th / T.s;
    const { box } = b;

    // corteza: aparece por donde ya ha pasado el haz del escáner
    const scan = clamp01((boot - 0.08) / 0.52);
    const beam = box.x0 + (box.x1 - box.x0) * scan;
    if (scan > 0) {
      ctx.globalAlpha = 0.72 + recall * 0.28 + 0.08 * Math.sin(time * 0.03);
      if (scan < 1) {
        ctx.save();
        ctx.beginPath(); ctx.rect(ix, iy, beam - ix, ih); ctx.clip();
        ctx.drawImage(T.tex, ix, iy, iw, ih);
        ctx.restore();
      } else ctx.drawImage(T.tex, ix, iy, iw, ih);
    }
    // ondas de actividad: un anillo que realza los pliegues por donde pasa
    for (const t of thoughts) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.r + 24, 0, Math.PI * 2);
      ctx.arc(t.x, t.y, Math.max(0.1, t.r - 6), 0, Math.PI * 2, true);
      ctx.clip();
      ctx.globalAlpha = (1 - t.r / t.max) * 0.9;
      ctx.drawImage(T.tex, ix, iy, iw, ih);
      ctx.restore();
    }
    // haz: franja que sobreexpone la corteza + línea fría de lado a lado
    if (scan > 0 && scan < 1) {
      ctx.save();
      ctx.beginPath(); ctx.rect(beam - 26, iy, 26, ih); ctx.clip();
      ctx.globalAlpha = 1;
      ctx.drawImage(T.tex, ix, iy, iw, ih);
      ctx.drawImage(T.tex, ix, iy, iw, ih);
      ctx.restore();
      ctx.fillStyle = rgb(PALETTE.spark);
      ctx.globalAlpha = 0.55;
      ctx.fillRect(beam - 0.75, box.y0, 1.5, box.y1 - box.y0);
      glow(SPRITES[1], beam, box.y0, 30, 0.9);
      glow(SPRITES[1], beam, box.y1, 30, 0.9);
    }
    // marco del escáner: esquinas y un par de lecturas
    if (hud > 0.01) {
      const L = mobile ? 10 : 18;
      ctx.strokeStyle = rgb(PALETTE.spark);
      ctx.globalAlpha = hud * 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [x, y, dx, dy] of [[box.x0, box.y0, 1, 1], [box.x1, box.y0, -1, 1], [box.x0, box.y1, 1, -1], [box.x1, box.y1, -1, -1]]) {
        ctx.moveTo(x + dx * L, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * L);
      }
      ctx.stroke();
      if (!mobile) {
        ctx.fillStyle = rgb(PALETTE.spark);
        ctx.globalAlpha = hud * 0.5;
        ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = "left";
        ctx.fillText("SAG · CORTEX", box.x0 + 4, box.y0 - 6);
        ctx.textAlign = "right";
        ctx.fillText(`N ${b.on}/${b.n.length}`, box.x1 - 4, box.y0 - 6);
      }
    }

    // conexiones: un trazo por color; cada una crece cuando ya están encendidas sus dos neuronas
    ctx.lineWidth = mobile ? 0.6 : 0.9;
    for (let c = 0; c < 3; c++) {
      ctx.strokeStyle = rgb(COLORS[c]);
      ctx.globalAlpha = 0.26 + recall * 0.3;
      ctx.beginPath();
      for (const e of b.e) {
        if (e.c !== c) continue;
        const f = clamp01((boot - e.from) / 0.06);
        if (!f) continue;
        const A = b.n[e.a], B = b.n[e.b];
        ctx.moveTo(A.X, A.Y);
        ctx.lineTo(A.X + (B.X - A.X) * f, A.Y + (B.Y - A.Y) * f);
      }
      ctx.stroke();
    }
    // neuronas
    const k = mobile ? 0.75 : 1;
    for (const m of b.n) {
      if (m.on) glow(SPRITES[m.c], m.X, m.Y, (m.r + m.flash * 16) * k * (0.8 + m.z * 0.4), 0.38 + 0.62 * m.flash);
    }
    // sitios de los recuerdos: un anillo que late del color de su etapa (la PR, discontinuo y apagado)
    for (const h of b.hots) {
      if (!h.lit && !h.pending) continue;
      const m = b.n[h.a];
      const col = points[h.i].color;
      const beat = 0.5 + 0.5 * Math.sin(time * 0.07 + h.i);
      if (h.pending) {
        if (boot < 1) continue;
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = rgb(col);
        ctx.globalAlpha = 0.25 + beat * 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(m.X, m.Y, 9 * k, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }
      ctx.strokeStyle = rgb(col);
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.5 + h.flash * 0.5;
      ctx.beginPath(); ctx.arc(m.X, m.Y, (8 + beat * 2 + h.flash * 14) * k, 0, Math.PI * 2); ctx.stroke();
      glow(spriteOf(col), m.X, m.Y, (22 + beat * 6 + h.flash * 40) * k, 0.55 + h.flash * 0.45);
    }
    // sinapsis viajando por las conexiones (frías: son la electricidad)
    for (const s of synapses) {
      const A = b.n[s.a], B = b.n[s.b];
      const x = A.X + (B.X - A.X) * s.t, y = A.Y + (B.Y - A.Y) * s.t;
      glow(SPRITES[s.c], x, y, (s.path ? 22 : 15) * k, 0.95);
      if (s.path) glow(SPRITES[0], x, y, 8 * k, 1);
    }
    // médula: se carga al terminar el arranque y lleva impulsos hasta el primer nodo
    if (stemCharge > 0) {
      const s = b.stem;
      ctx.beginPath();
      ctx.moveTo(s.x0, s.y0);
      ctx.bezierCurveTo(s.c1x, s.c1y, s.c2x, s.c2y, s.x1, s.y1);
      ctx.setLineDash([s.len * stemCharge, s.len]);
      ctx.strokeStyle = flowGradient();
      ctx.globalAlpha = 0.14; ctx.lineWidth = 16; ctx.stroke();
      ctx.globalAlpha = 0.9; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.setLineDash([]);
      for (const sp of stemPulses) {
        stemAt(sp.t, Q);
        glow(SPRITES[sp.c], Q.x, Q.y, 24, 0.95);
      }
    }
  };

  const drawDendrites = () => {
    for (const t of trees) {
      if (t.g <= 0.001 || t.bottom + PAD < viewTop - 40 || t.top + PAD > viewTop + ch + 40) continue;
      const reach = t.maxT * (1 - (1 - t.g) ** 3);
      ctx.strokeStyle = t.col;
      // un trazo por grosor: las ramas ya crecidas y las que están creciendo van juntas
      for (let d = 0; d < WIDTHS.length; d++) {
        ctx.beginPath();
        let any = false;
        for (const b of t.br) {
          if (b.depth !== d || b.t0 >= reach) continue;
          const f = Math.min(1, (reach - b.t0) / (b.t1 - b.t0));
          // trozo de la curva de 0 a f (de Casteljau): control intermedio + punto final
          const c = branchCtrl(b);
          const cx = b.x0 + (c.x - b.x0) * f, cy = b.y0 + (c.y - b.y0) * f + PAD;
          onBranch(b, f, Q);
          ctx.moveTo(b.x0, b.y0 + PAD);
          ctx.quadraticCurveTo(cx, cy, Q.x, Q.y);
          any = true;
        }
        if (!any) continue;
        ctx.globalAlpha = (0.62 - d * 0.06) * Math.min(1, t.g * 2);
        ctx.lineWidth = WIDTHS[d];
        ctx.stroke();
      }
      // puntas que avanzan mientras crece y sinapsis sobre la tarjeta
      for (const b of t.br) {
        if (b.t0 >= reach) continue;
        const f = Math.min(1, (reach - b.t0) / (b.t1 - b.t0));
        if (f < 1) { onBranch(b, f, Q); glow(t.spr, Q.x, Q.y, 12, 0.85); }
        else if (b.leaf) glow(t.spr, b.x1, b.y1 + PAD, 10 + b.glow * 20, 0.5 + b.glow * 0.5);
      }
    }
    // impulsos: un destello frío que viaja desde el nodo hasta una de las sinapsis
    for (const im of impulses) {
      let b = im.leaf;
      while (b.parent && b.t0 > im.d) b = b.parent;
      onBranch(b, clamp01((im.d - b.t0) / (b.t1 - b.t0)), Q);
      glow(SPRITES[im.c], Q.x, Q.y, 20, 0.95);
    }
  };

  const drawNode = (i) => {
    const p = points[i];
    const y = p.y + PAD;
    const f = flash[i];
    const spr = spriteOf(p.color);
    const breathe = 0.5 + 0.5 * Math.sin(time * 0.06 + i);
    const k = (hovered.has(i) ? 1.4 : 1) * (mobile ? 0.6 : 1);

    glow(spr, p.x, y, (74 + breathe * 20 + f * 160) * k, 0.34 + f * 0.6);

    // electrones en tres órbitas inclinadas, cada una de un color, con estela
    for (let o = 0; o < 3; o++) {
      const r = (24 + o * 9) * k;
      const tilt = o * 1.05 + i + time * 0.004;
      const cos = Math.cos(tilt), sin = Math.sin(tilt);
      for (let e = 0; e < 3; e++) {
        const ang = time * (0.05 + o * 0.018) * (o % 2 ? -1 : 1) + o * 2.1 - e * 0.16;
        const ex = Math.cos(ang) * r, ey = Math.sin(ang) * r * 0.36;
        glow(SPRITES[o], p.x + ex * cos - ey * sin, y + ex * sin + ey * cos, 9 - e * 2, 0.95 - e * 0.3);
      }
    }

    // conexión nodo → tarjeta: trazo discontinuo que corre y una bola que la recorre
    ctx.strokeStyle = rgb(p.color);
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 7]);
    ctx.lineDashOffset = (p.left ? 1 : -1) * time * 0.8;
    ctx.beginPath(); ctx.moveTo(p.x, y); ctx.lineTo(p.edge, y); ctx.stroke();
    ctx.setLineDash([]);
    const run = (time * 0.012 + i * 0.37) % 1;
    glow(spr, p.x + (p.edge - p.x) * run, y, 15, 0.9 * Math.sin(run * Math.PI));
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, -viewTop * dpr);
    ctx.clearRect(0, viewTop, w, ch);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // polvo flotante (pegado a la pantalla)
    for (const m of dust) glow(SPRITES[m.c], m.x, viewTop + m.y, m.s, 0.16 + 0.2 * Math.sin(time * 0.05 + m.ph) ** 2);

    drawBrain();
    buildThread();
    drawDendrites();
    drawThread();

    checkpoints.forEach((c, i) => {
      if (!visible(points[i].y + PAD, 160)) return;
      if (c.classList.contains("is-active")) drawNode(i);
      else if (c.classList.contains("checkpoint--next")) glow(SPRITES[3], points[i].x, points[i].y + PAD, 56 + 12 * Math.sin(time * 0.08), 0.4);
    });

    // cabeza de la carga: núcleo blanco con un halo que va cambiando de color
    if (charge.p > 0.001 && charge.p < 0.999 && visible(headY)) {
      const c = ((time * 0.02) | 0) % 3;
      glow(SPRITES[c], headX, headY, 110 + Math.random() * 20 + agitation * 60, 0.95);
      glow(SPRITES[(c + 1) % 3], headX, headY, 46, 0.9);
      glow(SPRITES[0], headX, headY, 14, 1);
    }

    // ondas cromáticas
    ctx.lineWidth = 2;
    for (const wv of waves) {
      if (wv.t < 0) continue;
      const k = wv.t / 42;
      ctx.strokeStyle = flowColors[wv.c * 16];
      ctx.globalAlpha = (1 - k) * 0.85;
      ctx.beginPath(); ctx.arc(wv.x, wv.y, 4 + (1 - (1 - k) ** 3) * wv.max, 0, Math.PI * 2); ctx.stroke();
    }

    // rayos: trazo ancho y tenue del color + trazo fino casi blanco
    for (const b of bolts) {
      const a = b.life / b.ttl;
      ctx.beginPath();
      b.pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = b.color;
      ctx.globalAlpha = a * 0.45;
      ctx.lineWidth = b.width * 4;
      ctx.stroke();
      ctx.strokeStyle = "#c9fff3"; // núcleo del rayo: blanco aqua
      ctx.globalAlpha = a;
      ctx.lineWidth = b.width;
      ctx.stroke();
    }

    // chispas
    for (let i = 0; i < alive; i++) {
      if (!visible(py[i], 20)) continue;
      const t = life[i] / ttl[i];
      const s = size[i] * (0.35 + 0.65 * t);
      ctx.globalAlpha = t * t;
      ctx.drawImage(SPRITES[tint[i]], px[i] - s / 2, py[i] - s / 2, s, s);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  const setBoot = (html) => {
    if (bootLabel && html !== bootText) bootLabel.innerHTML = bootText = html;
  };

  const stepBrain = (dt) => {
    const b = brain;
    if (!b) return;
    // arranca la primera vez que asoma por la pantalla
    if (boot < 0 && fxRect.top + b.cy < window.innerHeight * 0.85) boot = 0;
    if (boot < 0) return;
    if (boot < 1) {
      boot = Math.min(1, boot + dt / BOOT);
      // el haz va encendiendo las neuronas que cruza
      for (const m of b.n) if (!m.on && boot >= m.order) { m.on = true; m.flash = 1; b.on++; }
      // y después los recuerdos se indexan uno a uno
      let last = null;
      for (const h of b.hots) {
        if (!h.pending && !h.lit && boot >= h.at) remember(h.i);
        if (h.lit) last = h;
      }
      const lit = b.hots.filter((h) => h.lit).length;
      if (boot === 1) {
        // terminó de recordar: fogonazo en todas las neuronas, onda por toda la corteza y la médula se carga
        b.n.forEach((m) => (m.flash = 1));
        const r = b.n[b.root];
        thoughts.push({ x: r.x, y: r.y, r: 0, max: b.W * 1.1 });
        wave(b.stem.x0, b.stem.y0, mobile ? 70 : 160);
      }
      const pending = b.hots.length - b.memories;
      setBoot(boot < 0.08 ? "&gt; estableciendo conexión…"
        : boot < 0.62 ? `&gt; escaneando corteza… <b>${Math.round(clamp01((boot - 0.08) / 0.52) * 100)}%</b>`
        : boot < 1 ? `&gt; indexando recuerdos ${lit}/${b.memories}${last && last.name ? ` · <b>${last.name}</b>` : ""}`
        : `&gt; <b>${b.memories}</b> recuerdos cargados${pending ? ` · ${pending} pendiente` : ""}`);
    } else {
      if (stemCharge < 1) stemCharge = Math.min(1, stemCharge + dt / 40);
      hud = Math.max(0.15, hud - 0.008 * dt);
    }

    recall *= Math.pow(0.97, dt);
    for (const m of b.n) m.flash = Math.max(0, m.flash - 0.035 * dt);
    for (const h of b.hots) h.flash = Math.max(0, h.flash - 0.02 * dt);
    for (let k = thoughts.length - 1; k >= 0; k--) if ((thoughts[k].r += 2.4 * dt) > thoughts[k].max) thoughts.splice(k, 1);
    if (!visible(b.cy, b.Hb)) return;

    // actividad espontánea: alguna neurona se dispara sola
    if (Math.random() < 0.12 * dt) {
      const m = b.n[(Math.random() * b.n.length) | 0];
      if (m.on) m.flash = Math.max(m.flash, 0.7);
    }
    // de vez en cuando, un pensamiento: onda desde un recuerdo
    if (boot >= 1 && !thoughts.length && Math.random() < 0.004 * dt) {
      const h = b.hots[(Math.random() * b.memories) | 0];
      if (h) { const m = b.n[h.a]; thoughts.push({ x: m.x, y: m.y, r: 0, max: b.W * 0.5 }); }
    }
    // el ratón cerca enciende las neuronas de alrededor
    let near = 0;
    if (cursor.power > 0.3) {
      for (const m of b.n) {
        const d = Math.hypot(m.X - cursor.x, m.Y - (cursor.y + PAD));
        if (d < 70 && m.on) { m.flash = Math.max(m.flash, (1 - d / 70) * 0.8); near = 1; }
      }
    }
    // sinapsis sueltas: más mientras arranca, al recordar una etapa o con el ratón encima
    nextSynapse -= dt * (1 + (boot < 1 ? 3 : 0) + recall * 5 + near * 3);
    if (nextSynapse <= 0 && synapses.length < 22) {
      const e = b.e[(Math.random() * b.e.length) | 0];
      if (e && boot >= e.from + 0.06) {
        const flip = Math.random() < 0.5;
        synapses.push({ a: flip ? e.b : e.a, b: flip ? e.a : e.b, t: 0, v: 1 / (12 + Math.random() * 14), c: Math.random() < 0.7 ? 1 : 0 });
      }
      nextSynapse = 4 + Math.random() * 8;
    }
    for (let k = synapses.length - 1; k >= 0; k--) {
      const s = synapses[k];
      if ((s.t += s.v * dt) < 1) continue;
      b.n[s.b].flash = 1;
      // la señal de un recuerdo sigue su camino salto a salto; al llegar al tronco baja por la médula
      if (s.path && s.k + 2 < s.path.length) {
        s.k++;
        s.a = s.path[s.k]; s.b = s.path[s.k + 1]; s.t = 0;
        continue;
      }
      if (s.path && stemCharge >= 1) stemPulses.push({ t: 0, c: 1, fwd: true });
      synapses.splice(k, 1);
    }
    // impulsos que bajan por la médula hasta el hilo (los de un recuerdo siguen por el hilo)
    if (stemCharge >= 1) {
      nextStem -= dt;
      if (nextStem <= 0) { stemPulses.push({ t: 0, c: tintRand() }); nextStem = 30 + Math.random() * 40; }
    }
    for (let k = stemPulses.length - 1; k >= 0; k--) {
      const sp = stemPulses[k];
      if ((sp.t += 0.022 * dt) < 1) continue;
      if (sp.fwd) pulses.push({ s: 0, v: 9, c: 1 });
      stemPulses.splice(k, 1);
    }
  };

  const stepDendrites = (dt, head) => {
    // crecen cuando les llega la carga y se recogen si se vuelve atrás
    for (const t of trees) t.g = clamp01(t.g + (head >= t.at - 1 ? 0.014 : -0.04) * dt);
    nextImpulse -= dt;
    if (nextImpulse <= 0) {
      const ready = trees.filter((t) => t.g >= 0.98 && visible(points[t.i].y + PAD, 200));
      if (ready.length) fire(ready[(Math.random() * ready.length) | 0]);
      nextImpulse = 8 + Math.random() * 16;
    }
    for (let k = impulses.length - 1; k >= 0; k--) {
      const im = impulses[k];
      if ((im.d += im.v * dt) < im.leaf.t1) continue;
      // llega a la sinapsis: brilla, chisporrotea y la tarjeta recibe el chispazo
      im.leaf.glow = 1;
      for (let s = 0; s < 4; s++) spark(im.leaf.x1, im.leaf.y1, 1.4, Math.PI * 2, 0, 0.7, im.c);
      zap(im.leaf.card);
      impulses.splice(k, 1);
    }
    for (const t of trees) {
      for (const l of t.leaves) {
        l.glow = Math.max(0, l.glow - 0.03 * dt);
        // con el ratón cerca de una sinapsis, se dispara
        if (cursor.power > 0.5 && t.g >= 0.98 && l.glow < 0.05 && Math.abs(l.x1 - cursor.x) < 50 && Math.abs(l.y1 - cursor.y) < 50 && Math.random() < 0.05 * dt) fire(t, l);
      }
    }
  };

  const step = (dt) => {
    time += dt;

    // la carga persigue al scroll con suavidad
    if (charge.p !== charge.target) {
      charge.p += (charge.target - charge.p) * (1 - Math.pow(0.9, dt));
      if (Math.abs(charge.target - charge.p) < 0.0005) charge.p = charge.target; // remata sin quedarse en 0.9998
      apply();
    }
    agitation *= Math.pow(0.96, dt);

    // ratón: posición en la línea y fuerza del empuje (entra y sale suave)
    if (cursor.active) {
      cursor.x = clientX - fxRect.left;
      cursor.y = clientY - fxRect.top - PAD;
    }
    cursor.power += ((cursor.active ? 1 : 0) - cursor.power) * (1 - Math.pow(0.9, dt));

    const head = charge.p * total;
    stepBrain(dt);
    stepDendrites(dt, head);

    // pulsos: nacen al principio y mueren al llegar a la cabeza (con chisporroteo)
    nextPulse -= dt;
    if (nextPulse <= 0 && head > 80) {
      pulses.push({ s: 0, v: 7 + Math.random() * 5, c: tintRand() });
      nextPulse = 16 + Math.random() * 26;
    }
    for (let k = pulses.length - 1; k >= 0; k--) {
      pulses[k].s += pulses[k].v * dt;
      if (pulses[k].s >= head) {
        for (let s = 0; s < 5; s++) spark(headX, headY - PAD, 2.4, Math.PI * 2, 0, 1, pulses[k].c);
        pulses.splice(k, 1);
      }
    }

    // estela de la cabeza
    if (charge.p > 0.002 && charge.p < 0.998) {
      let n = (0.5 + agitation * 3) * dt;
      while (n > 0) { if (Math.random() < n) spark(headX, headY - PAD, 2.2, 2, -Math.PI / 2); n--; }
    }

    // los nodos sueltan de vez en cuando un arco hacia fuera
    checkpoints.forEach((c, i) => {
      flash[i] = Math.max(0, flash[i] - 0.03 * dt);
      if (!c.classList.contains("is-active") || !visible(points[i].y + PAD, 100)) return;
      nextArc[i] -= dt * (hovered.has(i) ? 3 : 1);
      if (nextArc[i] > 0) return;
      nextArc[i] = 70 + Math.random() * 150;
      const p = points[i];
      const a = Math.random() * Math.PI * 2, d = (34 + Math.random() * 44) * (mobile ? 0.6 : 1);
      bolt(p.x, p.y, p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 14, 1.1);
    });

    for (const m of dust) {
      m.y -= m.v * dt;
      if (m.y < 0) m.y = ch;
    }
    for (let k = waves.length - 1; k >= 0; k--) if ((waves[k].t += dt) > 42) waves.splice(k, 1);
    for (let k = bolts.length - 1; k >= 0; k--) if ((bolts[k].life -= dt) <= 0) bolts.splice(k, 1);
    stepSparks(dt);
  };

  // Va en el mismo tick de GSAP que Lenis (después de él): el canvas y el scroll nunca se desfasan
  let running = false;
  let last = 0;
  const tick = () => {
    const now = performance.now();
    const dt = Math.min((now - last) / 16.67, 3);
    last = now;
    fxRect = fx.getBoundingClientRect();
    viewTop = Math.max(0, Math.min(H - ch, -fxRect.top));
    step(dt);
    draw();
  };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true;
      last = performance.now();
      gsap.ticker.add(tick);
    } else if (!entry.isIntersecting && running) {
      running = false;
      gsap.ticker.remove(tick);
      alive = 0;
      waves.length = bolts.length = pulses.length = impulses.length = synapses.length = stemPulses.length = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // fuera de pantalla se salta directamente al estado final, sin espectáculo
      charge.p = charge.target;
      apply(true);
      for (const t of trees) t.g = charge.p * total >= t.at - 1 ? 1 : 0;
    }
  }).observe(timeline);
}

/* ---------- Contacto: un murciélago de chispas que ecolocaliza ---------- */
// El murciélago es fuego (chispas ámbar, huesos de las alas en oro) y sus ultrasonidos son hielo.
// Al llegar a la sección se junta el enjambre, abre los ojos y lanza un anillo completo: la onda "encuentra"
// los enlaces y los saca de la niebla. Después escucha: apunta al ratón y fija el enlace que tengas encima.
function initContact() {
  const stage = document.getElementById("echo");
  const toast = document.querySelector(".contact__toast");
  if (!stage || !toast) return;

  /* ----- Avisos, copiar el email y guardar la vCard ----- */
  let toastTimer;
  const say = (text) => {
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2200);
  };
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        say("> email copiado al portapapeles");
        btn.textContent = "copiado ✓";
        btn.classList.add("is-done");
        setTimeout(() => {
          btn.textContent = "copiar";
          btn.classList.remove("is-done");
        }, 1800);
      } catch {
        say(btn.dataset.copy);
      }
    });
  });
  const saveVcard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Rincón Mateeva;Enrique;;;",
      "FN:Enrique Rincón",
      "TITLE:Full Stack Developer",
      "EMAIL;TYPE=INTERNET:rincon.enriquemv@gmail.com",
      "URL:https://www.linkedin.com/in/enrique-rincón-mateeva-264845363",
      "URL:https://github.com/rinconn",
      "END:VCARD",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard;charset=utf-8" }));
    Object.assign(document.createElement("a"), { href: url, download: "enrique-rincon.vcf" }).click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    say("> contacto guardado");
  };

  /* ----- Guardar contacto: carga energía mientras estás encima y al pulsar revienta en esquirlas ----- */
  const CHARGE = 1000; // ms hasta el tope (igual que la transición del CSS)
  document.querySelectorAll("[data-vcard]").forEach((btn) => {
    const text = btn.querySelector(".echo__vcard-text");
    let chargeStart = 0, chargeTimer, busy = false;
    const charge = () => {
      if (busy || btn.classList.contains("is-charging")) return;
      chargeStart = performance.now();
      btn.classList.add("is-charging");
      stage.dispatchEvent(new CustomEvent("echo:charge", { detail: { on: true } })); // el canvas chisporrotea alrededor
      chargeTimer = setTimeout(() => btn.classList.add("is-charged"), CHARGE);
    };
    const discharge = () => {
      if (busy) return;
      clearTimeout(chargeTimer);
      btn.classList.remove("is-charging", "is-charged");
      stage.dispatchEvent(new CustomEvent("echo:charge", { detail: { on: false } }));
    };
    const shatter = () => {
      const s = stage.getBoundingClientRect(), b = btn.getBoundingClientRect();
      const ox = b.left - s.left, oy = b.top - s.top;
      const cxB = ox + b.width / 2, cyB = oy + b.height / 2;
      // fogonazo y dos ondas de choque que se abren desde el botón
      for (const [cls, delay] of [["echo__blast", 0], ["echo__shock", 0], ["echo__shock", 120]]) {
        const el = document.createElement("span");
        el.className = cls;
        Object.assign(el.style, { left: `${cxB}px`, top: `${cyB}px`, animationDelay: `${delay}ms` });
        stage.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }
      for (let i = 0; i < 70; i++) {
        const spark = i >= 40;
        const el = document.createElement("span");
        el.className = spark ? "echo__shard is-spark" : "echo__shard";
        const size = spark ? 3 + Math.random() * 3 : 8 + Math.random() * 18;
        const x = ox + Math.random() * b.width, y = oy + Math.random() * b.height;
        const pts = Array.from({ length: 3 }, () => `${(Math.random() * 100) | 0}% ${(Math.random() * 100) | 0}%`).join(",");
        Object.assign(el.style, {
          left: `${x - size / 2}px`,
          top: `${y - size / 2}px`,
          width: `${size}px`,
          height: `${size}px`,
          clipPath: spark ? "" : `polygon(${pts})`,
        });
        stage.appendChild(el);
        const a = Math.atan2(y - cyB, x - cxB) + (Math.random() - 0.5) * 0.8;
        const d = (spark ? 120 : 60) + Math.random() * (spark ? 200 : 140);
        el.animate(
          [
            { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
            { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 60}px) rotate(${(Math.random() - 0.5) * 720}deg)`, opacity: 0 },
          ],
          { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.15,.7,.35,1)" }
        ).onfinish = () => el.remove();
      }
      stage.dispatchEvent(new CustomEvent("echo:burst", { detail: { x: cxB, y: cyB } }));
    };
    const burst = () => {
      busy = true;
      saveVcard();
      if (prefersReducedMotion) {
        busy = false;
        discharge();
        return;
      }
      shatter();
      btn.classList.remove("is-charging", "is-charged");
      btn.classList.add("is-broken");
      setTimeout(() => {
        text.textContent = "Guardado ✓";
        btn.classList.remove("is-broken");
        btn.classList.add("is-reborn", "is-saved");
      }, 1400);
      setTimeout(() => {
        text.textContent = "Guardar contacto";
        btn.classList.remove("is-reborn", "is-saved");
        busy = false;
      }, 4200);
    };
    btn.addEventListener("pointerenter", charge);
    btn.addEventListener("focus", charge);
    btn.addEventListener("pointerleave", discharge);
    btn.addEventListener("blur", discharge);
    btn.addEventListener("click", () => {
      if (busy) return;
      if (btn.classList.contains("is-charged")) return burst(); // cargado del todo: revienta ya
      // sin carga completa (en táctil o con un clic rápido) termina de cargarse antes de reventar
      charge();
      const left = prefersReducedMotion ? 0 : Math.max(250, CHARGE - (performance.now() - chargeStart));
      busy = true;
      setTimeout(() => {
        btn.classList.add("is-charged");
        setTimeout(burst, prefersReducedMotion ? 0 : 160);
      }, left);
    });
  });

  /* ----- La vía: el tren pasa cuando la vía se ve y el murciélago ya ha encontrado todo, y de vez en cuando vuelve ----- */
  const rail = stage.querySelector(".echo__rail");
  if (rail) {
    if (prefersReducedMotion) rail.classList.add("is-gone");
    else {
      const train = rail.querySelector(".echo__train");
      let seen = false, ready = false, passing = false, nextTrain;
      const pass = () => {
        if (!seen || !ready || passing) return;
        passing = true;
        clearTimeout(nextTrain);
        rail.classList.remove("is-gone", "is-passing");
        void train.offsetWidth; // reinicia la animación
        rail.classList.add("is-passing");
        setTimeout(() => stage.classList.add("is-passing"), 900); // el golpe de aire llega cuando pasa por el centro
      };
      const later = (ms) => {
        clearTimeout(nextTrain);
        nextTrain = setTimeout(pass, ms);
      };
      new IntersectionObserver(
        ([e]) => {
          seen = e.isIntersecting;
          if (seen && ready && !passing) later(700);
        },
        { threshold: 1 }
      ).observe(rail);
      stage.addEventListener("echo:ready", () => {
        ready = true;
        if (seen) later(700);
      });
      train.addEventListener("animationend", () => {
        passing = false;
        rail.classList.add("is-gone");
        stage.classList.remove("is-passing");
        later(16000 + Math.random() * 12000); // el siguiente, quién sabe cuándo
      });
    }
  }

  /* ----- Escena ----- */
  const canvas = stage.querySelector(".echo__canvas");
  const ctx = canvas.getContext("2d");
  const batBox = stage.querySelector(".echo__bat");
  const statusEl = stage.querySelector(".echo__status");
  const vcardBtn = stage.querySelector("[data-vcard]");
  const targets = [...stage.querySelectorAll("[data-echo]")].map((el) => ({
    el,
    label: el.querySelector(".echo__label"),
    name: el.dataset.echo,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    found: false,
    hover: false,
  }));
  const mobile = matchMedia("(max-width: 760px)").matches;
  const motion = !prefersReducedMotion;

  // las chispas se pintan a 4–8 px: con un sprite de 24 px la GPU escala menos (64 solo para ojos y destellos)
  const makeSprite = ([r, g, b], n = 64) => {
    const c = document.createElement("canvas");
    c.width = c.height = n;
    const x = c.getContext("2d");
    const h = n / 2;
    const gr = x.createRadialGradient(h, h, 0, h, h, h);
    gr.addColorStop(0, "#fff");
    gr.addColorStop(0.18, `rgb(${r}, ${g}, ${b})`);
    gr.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gr.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    x.fillStyle = gr;
    x.fillRect(0, 0, n, n);
    return c;
  };
  const ICE = [33, 230, 193], AMBER = [124, 108, 255], RED = [255, 34, 40]; // AMBER es ya el violeta del acento
  // por tipo de chispa: 0 borde (oro), 1 huesos y trazos (ámbar), 2 membrana (sangre), 3 colmillos (blanco caliente)
  const SPR = [makeSprite([179, 168, 255], 24), makeSprite(AMBER, 24), makeSprite([225, 18, 32], 24), makeSprite([236, 240, 255], 24)];
  const SPR_ICE = makeSprite(ICE);
  const SPR_RED = makeSprite(RED);
  const SPR_AMBER = makeSprite(AMBER);
  const KIND_ALPHA = [0.8, 0.7, 0.3, 0.95];
  const rgba = ([r, g, b], a) => `rgba(${r}, ${g}, ${b}, ${a})`;

  /* ----- Silueta (unidades: las alas van de -1 a 1, la y hacia abajo) ----- */
  // mitad derecha, de la cabeza a los pies: [x, y] o [x, y, cx, cy] si llega con una curva.
  // Como el tatuaje: cabezón con orejas enormes abiertas, brazo corto que sube a la muñeca (garra arriba)
  // y el ala como una vela rasgada: borde de ataque casi recto hacia la punta y festones hundidos abajo
  const RIGHT = [
    [0, -0.13], [0.035, -0.16],
    [0.115, -0.46, 0.05, -0.33], // oreja
    [0.125, -0.1, 0.15, -0.3],
    [0.105, -0.03], [0.15, -0.01], // mejilla y hombro
    [0.33, -0.24, 0.24, -0.06], [0.29, -0.34], [0.355, -0.27], // brazo y garra de la muñeca
    [0.97, -0.43, 0.66, -0.38], [1, -0.37], // borde de ataque y punta
    [0.93, -0.04, 0.9, -0.24],
    [0.78, 0.12, 0.8, 0.0],
    [0.6, 0.19, 0.66, 0.08],
    [0.42, 0.21, 0.5, 0.12],
    [0.25, 0.17, 0.33, 0.13],
    [0.14, 0.17], [0.12, 0.29, 0.15, 0.24], // cadera y pata
    [0.09, 0.37], [0.07, 0.31], [0.045, 0.37], [0.03, 0.3], [0, 0.33], // garras
  ];
  const SHOULDER = [0.15, -0.01], WRIST = [0.33, -0.25];
  // huesos: brazo hasta la muñeca y de ahí los dedos hasta cada punta del ala (algo curvados)
  const BONES = [
    [SHOULDER, WRIST, 0.03],
    [WRIST, [0.96, -0.41], -0.03],
    [WRIST, [0.93, -0.04], -0.05],
    [WRIST, [0.78, 0.12], -0.04],
    [WRIST, [0.6, 0.19], -0.03],
    [WRIST, [0.42, 0.21], -0.01],
  ];
  // trazos de las orejas y el ceño: [desde, hasta, curva, tipo]
  const STROKES = [
    [[0.055, -0.15], [0.1, -0.38], -0.02, 1], // pliegue de la oreja
    [[0.012, -0.072], [0.085, -0.118], -0.012, 0], // ceño fruncido: baja hacia el centro
    [[0.016, -0.064], [0.082, -0.106], -0.01, 0],
  ];

  const K = 400, MW = 2 * K + 20, MH = Math.round(0.9 * K), OX = MW / 2, OY = 0.5 * K;
  const mask = document.createElement("canvas");
  mask.width = MW;
  mask.height = MH;
  const m = mask.getContext("2d", { willReadFrequently: true });
  m.setTransform(K, 0, 0, K, OX, OY);
  m.fillStyle = "#fff";
  m.beginPath();
  m.moveTo(RIGHT[0][0], RIGHT[0][1]);
  for (let i = 1; i < RIGHT.length; i++) {
    const [x, y, qx, qy] = RIGHT[i];
    qx === undefined ? m.lineTo(x, y) : m.quadraticCurveTo(qx, qy, x, y);
  }
  for (let i = RIGHT.length - 1; i > 0; i--) {
    const [, , qx, qy] = RIGHT[i];
    const [x, y] = RIGHT[i - 1];
    qx === undefined ? m.lineTo(-x, y) : m.quadraticCurveTo(-qx, qy, -x, y);
  }
  m.fill();
  m.beginPath(); m.ellipse(0, -0.05, 0.1, 0.095, 0, 0, Math.PI * 2); m.fill();
  m.beginPath(); m.ellipse(0, 0.12, 0.075, 0.17, 0, 0, Math.PI * 2); m.fill();
  const alpha = m.getImageData(0, 0, MW, MH).data;
  const inside = (x, y) => {
    const px = Math.round(x * K + OX), py = Math.round(y * K + OY);
    return px >= 0 && py >= 0 && px < MW && py < MH && alpha[(py * MW + px) * 4 + 3] > 128;
  };

  /* ----- Chispas ----- */
  const parts = [];
  const wingW = (ux) => Math.min(1, Math.max(0, (Math.abs(ux) - 0.17) / 0.83)); // cuánto se mueve con el aleteo
  const add = (ux, uy, kind) => {
    const side = Math.sign(ux) || 1;
    parts.push({
      ux, uy, kind, side,
      w: wingW(ux),
      size: [3.1, 2.8, 2.5, 2.4][kind] * (mobile ? 0.8 : 1.08),
      ph: Math.random() * Math.PI * 2,
      ang: Math.random() * Math.PI * 2, // rumbo de la sangre que corre por la membrana
      spd: 0.5 + Math.random(),
      // de dónde sale en la intro (fracción del escenario) y cuándo
      sx: Math.random(), sy: Math.random() * 0.9,
      delay: Math.abs(ux) * 0.7 + Math.random() * 0.5,
      ox: 0, oy: 0, vx: 0, vy: 0, ice: 0, X: 0, Y: 0,
    });
  };
  // separación de la malla: cada chispa es un drawImage por frame, así que es lo que más cuesta
  const g = mobile ? 0.013 : 0.0104;
  for (let y = -0.48; y < 0.4; y += g) {
    for (let x = -1.02; x < 1.02; x += g) {
      const px = x + (Math.random() - 0.5) * g * 0.6, py = y + (Math.random() - 0.5) * g * 0.6;
      if (!inside(px, py)) continue;
      const e = g * 1.1;
      const edge = !inside(px + e, py) || !inside(px - e, py) || !inside(px, py + e) || !inside(px, py - e);
      if (edge) add(px, py, 0);
      else if (Math.random() < 0.24) add(px, py, 2);
    }
  }
  const line = ([ax, ay], [bx, by], bend, kind, step = 1.3) => {
    const len = Math.hypot(bx - ax, by - ay), n = Math.ceil(len / (g * step));
    const nx = -(by - ay) / len, ny = (bx - ax) / len; // normal: la curva se abomba hacia ella
    for (let i = 0; i <= n; i++) {
      const t = i / n, k = 4 * t * (1 - t) * bend;
      for (const s of [1, -1]) add(s * (ax + (bx - ax) * t + nx * k), ay + (by - ay) * t + ny * k, kind);
    }
  };
  for (const [a, b, bend] of BONES) line(a, b, bend, 1);
  for (const [a, b, bend, kind] of STROKES) line(a, b, bend, kind, 0.8);
  // colmillos: dos largos que bajan de la boca
  for (const [x0, y0, len] of [[0.026, -0.008, 0.055]]) {
    for (let t = 0; t <= 1; t += 0.16) {
      const half = 0.008 * (1 - t);
      for (const s of [1, -1]) {
        add(s * (x0 - half), y0 + t * len, 3);
        if (half > 0.002) add(s * (x0 + half), y0 + t * len, 3);
      }
    }
  }
  // la sangre corre sin salirse de la membrana ni pisar el borde
  const deep = (x, y) => inside(x, y) && inside(x + 0.02, y) && inside(x - 0.02, y) && inside(x, y + 0.02) && inside(x, y - 0.02);

  // telaraña bajo el cuerpo: hilos desde las patas a los festones de las alas, y vueltas que cuelgan entre ellos
  const WEB_HUB = [0, 0.3];
  const WEB_ANCHORS = [[-0.78, 0.12], [-0.6, 0.19], [-0.42, 0.21], [-0.25, 0.17], [-0.12, 0.42], [0, 0.48], [0.12, 0.42], [0.25, 0.17], [0.42, 0.21], [0.6, 0.19], [0.78, 0.12]];

  /* ----- Fondo: ceniza que sube y murciélagos lejanos ----- */
  const motes = Array.from({ length: mobile ? 30 : 70 }, () => ({
    x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8,
    v: 0.1 + Math.random() * 0.35, ph: Math.random() * 6.3, red: Math.random() < 0.4,
  }));
  const flock = [];
  let nextFlock = 2;
  // de dónde nacen las ondas de power (lado derecho; se reflejan al azar): muñeca, hombro, cabeza y punta del ala
  const SURGE_FROM = [WRIST, SHOULDER, [0.03, -0.06], [0.9, -0.36]];
  const surges = [];
  let nextSurge = 4;

  /* ----- Medidas ----- */
  let W = 0, H = 0, S = 1, cx = 0, cy = 0, hx = 0, hy = 0;
  const layout = () => {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5); // chispas difusas: más resolución no se aprecia
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const b = batBox.getBoundingClientRect();
    S = (b.width / 2) * 0.94;
    cx = b.left - r.left + b.width / 2;
    cy = b.top - r.top + b.height * 0.5 + 0.03 * S;
    hx = cx;
    hy = cy + 0.01 * S; // la boca
    for (const t of targets) {
      const e = t.label.getBoundingClientRect();
      t.x = e.left - r.left + e.width / 2;
      t.y = e.top - r.top + e.height / 2;
      t.w = e.width;
      t.h = e.height;
    }
  };

  /* ----- Estado ----- */
  const INTRO = 2.3;   // s hasta que el enjambre forma el murciélago
  let introT = motion ? -1 : INTRO + 10;
  let time = 0, flapBig = 0, lunge = 0, shake = 0, eyes = motion ? 0 : 1, eyeFlash = 0, nextPing = 0, firstRing = !motion;
  let lookX = 0, lookY = 0, flap = 0, bob = 0, zoom = 1;
  const sonic = [], sparks = [], bolts = [];
  const cursor = { x: 0, y: 0, in: false };
  let charge = null; // { since } mientras el botón de contacto se carga
  let statusHTML = "";
  const status = (html) => {
    if (html === statusHTML) return;
    statusHTML = html;
    statusEl.innerHTML = html;
  };
  let nFound = 0;
  const found = () => nFound;

  // de unidades del murciélago a pantalla, con el aleteo (sin el empujón del ratón).
  // place() deja el resultado en PX, PY para no crear un array por chispa en cada frame
  let PX = 0, PY = 0;
  const place = (ux, uy, side, w) => {
    const sx = side * SHOULDER[0], sy = SHOULDER[1], k = S * zoom;
    if (w > 0) {
      const dx = ux - sx, dy = uy - sy;
      const a = flap * side * (0.5 + 0.5 * w), c = Math.cos(a), s = Math.sin(a);
      PX = cx + (sx + dx * c + dy * s) * k;
      PY = cy + bob + (sy - dx * s + dy * c) * k;
    } else {
      PX = cx + ux * k;
      PY = cy + bob + uy * k;
    }
  };
  const toScreen = (ux, uy) => {
    place(ux, uy, Math.sign(ux) || 1, wingW(ux));
    return [PX, PY];
  };

  // ultrasonidos: un chorro de partículas de sonido que sale de la boca; las que dan en un enlace rebotan
  // y vuelven a la boca, las demás se pierden. Si va dirigido a un enlace (aim), atraviesa los demás
  // (en móvil están en columna y el primero se lo comería todo)
  const emit = (dir, spread, n, full = false, ox = hx, oy = hy, aim = null) => {
    const burst = new Set();
    for (let i = 0; i < n; i++) {
      const a = full ? (i / n) * Math.PI * 2 + Math.random() * 0.02 : dir + (Math.random() * 2 - 1) * spread;
      const v = 7 + Math.random() * 4;
      sonic.push({ x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, back: false, burst, aim });
    }
    eyeFlash = Math.max(eyeFlash, 0.6);
    lunge = Math.max(lunge, full ? 1 : 0.5); // cada chillido es una embestida
    flapBig = Math.max(flapBig, full ? 1 : 0.4);
    if (full) shake = Math.max(shake, 6);
  };
  const emitTo = (x, y, spread, n, aim = null) => emit(Math.atan2(y - hy, x - hx), spread, n, false, hx, hy, aim);

  const ping = (t) => {
    t.el.classList.remove("is-ping");
    void t.el.offsetWidth; // reinicia la animación
    t.el.classList.add("is-ping");
    if (!t.found) {
      t.found = true;
      nFound++;
      t.el.classList.add("is-found");
      const k = found();
      if (k === targets.length) stage.dispatchEvent(new Event("echo:ready"));
      status(k < targets.length ? `&gt; señal ${k}/${targets.length} · <b>${t.name}</b>` : `&gt; ${k} señales encontradas · ${mobile ? "toca la pantalla" : "acércate a una"}`);
    }
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 4;
      sparks.push({ x: t.x + (Math.random() - 0.5) * t.w, y: t.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, red: Math.random() < 0.6 });
    }
  };

  // rayos que salen de un punto (al reventar el botón)
  const zap = (x, y, n, len) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, l = len * (0.5 + Math.random() * 0.7);
      bolts.push({ x, y, a, l, life: 1, decay: 0.05 + Math.random() * 0.04 });
    }
  };

  /* ----- Paso ----- */
  const step = (dt) => {
    const f = dt * 60;
    time += dt;
    if (introT >= 0 && introT < INTRO + 10) {
      introT += dt;
      if (introT < INTRO) status("&gt; despertando…");
      else if (!firstRing && introT >= INTRO + 0.35) {
        // primer chillido: en todas direcciones
        firstRing = true;
        status("&gt; emitiendo ultrasonidos…");
        emit(0, Math.PI, mobile ? 70 : 110, true);
        nextPing = 3.5;
      }
    }
    if (introT >= INTRO) eyes = Math.min(1, eyes + dt * 2);
    eyeFlash = Math.max(0, eyeFlash - dt * 2.5);
    flapBig *= Math.pow(0.975, f);
    lunge *= Math.pow(0.9, f);
    shake *= Math.pow(0.86, f);

    // a quién escucha: el enlace fijado, si no el ratón
    const locked = targets.find((t) => t.hover && t.found);
    const lx = locked ? locked.x : cursor.in ? cursor.x : hx, ly = locked ? locked.y : cursor.in ? cursor.y : hy + 200;
    lookX += (Math.max(-1, Math.min(1, (lx - hx) / 300)) - lookX) * 0.1 * f;
    lookY += (Math.max(-1, Math.min(1, (ly - hy) / 300)) - lookY) * 0.1 * f;

    if (firstRing && motion) {
      nextPing -= dt;
      if (nextPing <= 0) {
        if (locked) { emitTo(locked.x, locked.y, 0.1, 10, locked); nextPing = 0.8; }
        else if (cursor.in) { emitTo(cursor.x, cursor.y, 0.3, 22); nextPing = 2.6; }
        else {
          // primero va a por los que aún no ha encontrado, y más seguido
          const lost = targets.filter((t) => !t.found), pool = lost.length ? lost : targets;
          const t = pool[(Math.random() * pool.length) | 0];
          emitTo(t.x, t.y, 0.2, 26, t);
          nextPing = lost.length ? 1.2 : 4.5 + Math.random() * 2;
        }
      }
      if (locked) status(`&gt; fijado · <b>${locked.name}</b> · ${(Math.hypot(locked.x - hx, locked.y - hy) / 100).toFixed(1)} m`);
      else if (found() === targets.length) status(`&gt; ${targets.length} señales encontradas · ${mobile ? "toca la pantalla" : "acércate a una"}`);
    }

    // partículas de sonido
    for (let k = sonic.length - 1; k >= 0; k--) {
      const p = sonic[k];
      if (!p.back) {
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.life -= 0.007 * f;
        for (const t of targets) {
          if ((p.aim && p.aim !== t) || Math.abs(p.x - t.x) > t.w / 2 + 12 || Math.abs(p.y - t.y) > t.h / 2 + 10) continue;
          if (!p.burst.has(t)) { p.burst.add(t); ping(t); }
          // rebota: casi todas vuelven a la boca, alguna sale despedida
          if (Math.random() < 0.8) { p.back = true; p.life = 1; }
          else { p.vx *= -0.6; p.vy *= -0.6; }
          break;
        }
      } else {
        // de vuelta: se curva hacia la boca y acelera
        const dx = hx - p.x, dy = hy - p.y, d = Math.hypot(dx, dy);
        if (d < 14) {
          eyeFlash = Math.max(eyeFlash, 0.7);
          sonic.splice(k, 1);
          continue;
        }
        const sp = Math.min(16, 6 + (1 - Math.min(1, d / 600)) * 10);
        p.vx += ((dx / d) * sp - p.vx) * 0.12 * f;
        p.vy += ((dy / d) * sp - p.vy) * 0.12 * f;
        p.x += p.vx * f;
        p.y += p.vy * f;
      }
      if (p.life <= 0 || p.x < -40 || p.y < -40 || p.x > W + 40 || p.y > H + 40) sonic.splice(k, 1);
    }
    for (let k = sparks.length - 1; k >= 0; k--) {
      const s = sparks[k];
      s.x += s.vx * f;
      s.y += s.vy * f;
      s.vx *= Math.pow(0.92, f);
      s.vy = s.vy * Math.pow(0.92, f) + 0.1 * f; // gotean
      if ((s.life -= 0.025 * f) <= 0) sparks.splice(k, 1);
    }
    for (let k = bolts.length - 1; k >= 0; k--) if ((bolts[k].life -= bolts[k].decay * f) <= 0) bolts.splice(k, 1);
    // mientras el botón se carga, chisporrotea cada vez más
    if (charge && motion) {
      const k = Math.min(1, (performance.now() - charge.since) / 1000);
      if (Math.random() < 0.08 + k * 0.5) {
        const r = vcardBtn.getBoundingClientRect(), s = stage.getBoundingClientRect();
        const a = Math.random() * Math.PI * 2;
        const x = r.left - s.left + r.width / 2 + Math.cos(a) * r.width * 0.5, y = r.top - s.top + r.height / 2 + Math.sin(a) * r.height * 0.6;
        bolts.push({ x, y, a, l: 12 + k * 30 * Math.random(), life: 1, decay: 0.14 });
      }
    }

    // fondo
    for (const m of motes) {
      m.y -= (m.v * f) / Math.max(H, 1);
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
    }
    nextFlock -= dt;
    if (motion && nextFlock <= 0) {
      nextFlock = 5 + Math.random() * 7;
      const dir = Math.random() < 0.5 ? 1 : -1, y0 = H * (0.08 + Math.random() * 0.5);
      for (let i = 0, n = 1 + ((Math.random() * 3) | 0); i < n; i++) {
        flock.push({ x: dir > 0 ? -30 - i * 40 : W + 30 + i * 40, y: y0 + (Math.random() - 0.5) * 60, vx: dir * (1.1 + Math.random() * 0.8), s: 5 + Math.random() * 6, ph: Math.random() * 6.3 });
      }
    }
    for (let k = flock.length - 1; k >= 0; k--) {
      const b = flock[k];
      b.x += b.vx * f;
      b.y += Math.sin(time * 2 + b.ph) * 0.4 * f;
      if (b.x < -80 || b.x > W + 80) flock.splice(k, 1);
    }

    // el murciélago: aleteo con golpe (baja rápido y sube despacio); al chillar, sacudidas y embestida
    const beat = Math.sin(time * 2.3);
    flap = (motion ? 0.08 * Math.sign(beat) * Math.abs(beat) ** 0.55 : 0) + flapBig * 0.2 * Math.sin(time * 14);
    bob = motion ? Math.sin(time * 2.3 + 0.6) * 5 - lunge * 6 : 0;
    zoom = 1 + lunge * 0.05;
    const R = mobile ? 60 : 90;
    // la sangre: corre a borbotones con cada latido y se vuelve loca al chillar
    const pump = 0.45 + 1.2 * Math.max(0, Math.sin(time * 2.6)) ** 4 + lunge * 1.5;
    const sp = 0.16 * dt * pump; // en unidades del ala
    const damp = Math.pow(0.86, f), iceDecay = Math.pow(0.95, f), pull = 0.05 * f;
    const blood = motion && introT >= INTRO, forming = introT < INTRO + 1.2;
    // power: de vez en cuando una onda de energía (el aqua del ratón) recorre parte del cuerpo
    nextSurge -= dt;
    if (blood && nextSurge <= 0) {
      nextSurge = 3 + Math.random() * 3;
      const [ox, oy] = SURGE_FROM[(Math.random() * SURGE_FROM.length) | 0];
      const side = Math.random() < 0.5 ? -1 : 1;
      surges.push({ x: ox * side, y: oy, r: 0, max: 0.5 + Math.random() * 0.5 });
    }
    for (let k = surges.length - 1; k >= 0; k--) if ((surges[k].r += dt * 0.75) > surges[k].max) surges.splice(k, 1);
    for (const p of parts) {
      if (p.kind === 2 && blood) {
        p.ang += (Math.random() - 0.5) * 0.9 * f;
        const nx = p.ux + Math.cos(p.ang) * sp * p.spd, ny = p.uy + Math.sin(p.ang) * sp * p.spd;
        if (deep(nx, ny)) {
          p.ux = nx;
          p.uy = ny;
          p.side = Math.sign(nx) || 1;
          p.w = wingW(nx);
        } else p.ang += Math.PI * (0.6 + Math.random() * 0.8); // rebota contra el borde
      }
      place(p.ux, p.uy, p.side, p.w);
      let X = PX, Y = PY;
      p.a = 1;
      if (forming) {
        const lt = Math.min(1, Math.max(0, (introT - p.delay) / 1.1));
        const e = 1 - (1 - lt) ** 3;
        const wob = (1 - e) * 40;
        X = p.sx * W + (X - p.sx * W) * e + Math.sin(time * 2 + p.ph) * wob;
        Y = p.sy * H + (Y - p.sy * H) * e + Math.cos(time * 1.7 + p.ph) * wob;
        p.a = 0.25 + 0.75 * e;
      }
      if (cursor.in) {
        const ddx = X + p.ox - cursor.x, ddy = Y + p.oy - cursor.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < R * R && d2 > 1) {
          const d = Math.sqrt(d2), force = (1 - d / R) * 2.4;
          p.vx += (ddx / d) * force * f;
          p.vy += (ddy / d) * force * f;
        }
      }
      p.vx = (p.vx - p.ox * pull) * damp;
      p.vy = (p.vy - p.oy * pull) * damp;
      p.ox += p.vx * f;
      p.oy += p.vy * f;
      p.ice *= iceDecay;
      const o2 = p.ox * p.ox + p.oy * p.oy; // la raíz solo si se ha movido algo
      if (o2 > 0.01) p.ice = Math.max(p.ice, Math.min(1, Math.sqrt(o2) / 30));
      for (const s of surges) {
        // un frente fino que se apaga según se aleja de donde nace
        const band = 1 - Math.abs(Math.hypot(p.ux - s.x, p.uy - s.y) - s.r) / 0.045;
        if (band > 0) p.ice = Math.max(p.ice, band * 0.85 * (1 - s.r / s.max));
      }
      p.X = X + p.ox;
      p.Y = Y + p.oy;
    }
  };

  /* ----- Pintado ----- */
  const tinyBat = (x, y, s, fl) => {
    const wy = -s * 0.45 * fl;
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.1);
    ctx.quadraticCurveTo(x + s * 0.45, y - s * 0.15 + wy, x + s, y + wy);
    ctx.quadraticCurveTo(x + s * 0.7, y + wy * 0.4 + s * 0.1, x + s * 0.55, y + s * 0.18);
    ctx.quadraticCurveTo(x + s * 0.3, y + s * 0.05, x, y + s * 0.25);
    ctx.quadraticCurveTo(x - s * 0.3, y + s * 0.05, x - s * 0.55, y + s * 0.18);
    ctx.quadraticCurveTo(x - s * 0.7, y + wy * 0.4 + s * 0.1, x - s, y + wy);
    ctx.quadraticCurveTo(x - s * 0.45, y - s * 0.15 + wy, x, y - s * 0.1);
    ctx.fill();
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    if (shake > 0.3) ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    ctx.globalCompositeOperation = "lighter";

    // fondo: ceniza que sube balanceándose y algún murciélago lejano cruzando
    for (const m of motes) {
      const x = m.x * W + Math.sin(time * 0.6 + m.ph) * 14, y = m.y * H;
      ctx.globalAlpha = 0.18 + 0.14 * Math.sin(time * 1.3 + m.ph);
      ctx.drawImage(m.red ? SPR_RED : SPR_AMBER, x - m.r * 2, y - m.r * 2, m.r * 4, m.r * 4);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(140, 120, 255, 0.14)";
    for (const b of flock) tinyBat(b.x, b.y, b.s, Math.sin(time * 13 + b.ph));

    // telaraña: hilos finos de plata que se estiran con el aleteo
    if (introT >= INTRO) {
      const show = Math.min(1, (introT - INTRO) / 1.2);
      const hub = toScreen(...WEB_HUB);
      const anchors = WEB_ANCHORS.map(([x, y]) => toScreen(x, y));
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(200, 220, 255, ${0.16 * show})`;
      ctx.beginPath();
      for (const [x, y] of anchors) { ctx.moveTo(hub[0], hub[1]); ctx.lineTo(x, y); }
      for (let r = 1; r <= 4; r++) {
        const t = r / 5;
        for (let i = 0; i < anchors.length - 1; i++) {
          const [ax, ay] = anchors[i], [bx, by] = anchors[i + 1];
          const x0 = hub[0] + (ax - hub[0]) * t, y0 = hub[1] + (ay - hub[1]) * t;
          const x1 = hub[0] + (bx - hub[0]) * t, y1 = hub[1] + (by - hub[1]) * t;
          ctx.moveTo(x0, y0);
          ctx.quadraticCurveTo((x0 + x1) / 2 + (hub[0] - (x0 + x1) / 2) * 0.12, (y0 + y1) / 2 + (hub[1] - (y0 + y1) / 2) * 0.12, x1, y1);
        }
      }
      ctx.stroke();
    }

    // halo detrás del cuerpo
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.45);
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, S);
    halo.addColorStop(0, rgba(RED, 0.04 + eyes * 0.07 + lunge * 0.08));
    halo.addColorStop(0.5, rgba(AMBER, 0.03 + eyes * 0.04));
    halo.addColorStop(1, rgba(AMBER, 0));
    ctx.fillStyle = halo;
    ctx.fillRect(-S, -S, S * 2, S * 2);
    ctx.restore();

    // el murciélago: un latido recorre la membrana desde el cuerpo hasta las puntas
    const t22 = time * 2.2, t26 = time * 2.6;
    for (const p of parts) {
      const tw = 0.75 + 0.25 * Math.sin(t22 + p.ph);
      let pulse = 0;
      if (p.kind === 2 && motion) {
        const v = Math.sin(t26 - Math.abs(p.ux) * 7);
        if (v > 0) pulse = (v * v * v) ** 2;
      }
      const s = p.size * (1 + p.ice * 0.4 + pulse * 0.5);
      ctx.globalAlpha = Math.min(1, KIND_ALPHA[p.kind] + pulse * 0.55) * tw * p.a * (1 - p.ice * 0.6);
      ctx.drawImage(SPR[p.kind], p.X - s, p.Y - s, s * 2, s * 2);
      if (p.ice > 0.05) {
        ctx.globalAlpha = p.ice * 0.9 * p.a;
        ctx.drawImage(SPR_ICE, p.X - s, p.Y - s, s * 2, s * 2);
      }
    }

    // ojos: rojos, rasgados hacia dentro (ceño), miran hacia lo que persiguen y se encienden al chillar
    if (eyes > 0) {
      for (const side of [-1, 1]) {
        const ex = cx + side * 0.045 * S + lookX * 2, ey = cy + bob - 0.058 * S + lookY * 2; // bajo el ceño
        const r = (mobile ? 7 : 10) * (1 + eyeFlash * 0.7);
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate(-side * 0.45);
        ctx.globalAlpha = eyes * (0.55 + 0.45 * eyeFlash);
        ctx.drawImage(SPR_RED, -r * 1.6, -r * 1.6, r * 3.2, r * 3.2); // resplandor
        ctx.scale(1.8, 0.5);
        ctx.globalAlpha = eyes * (0.9 + 0.1 * Math.sin(time * 5));
        ctx.drawImage(SPR_RED, -r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
        ctx.drawImage(SPR_RED, -r * 0.4, -r * 0.4, r * 0.8, r * 0.8);
        ctx.restore();
      }
    }

    // ultrasonidos: estelas cortas, rojas al salir y ámbar al volver, con la cabeza encendida
    for (const back of [false, true]) {
      ctx.lineWidth = back ? 1.6 : 1.2;
      ctx.strokeStyle = back ? rgba(AMBER, 0.75) : "rgba(255, 90, 80, 0.4)";
      ctx.beginPath();
      for (const p of sonic) {
        if (p.back !== back || p.life <= 0) continue;
        const tl = back ? 3.2 : 2.4;
        ctx.moveTo(p.x - p.vx * tl, p.y - p.vy * tl);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
    for (const p of sonic) {
      ctx.globalAlpha = p.back ? 1 : Math.min(1, p.life * 1.4);
      const r = p.back ? 5 : 3.5;
      ctx.drawImage(p.back ? SPR_AMBER : SPR_RED, p.x - r, p.y - r, r * 2, r * 2);
    }

    // rayos de energía
    for (const b of bolts) {
      const pts = [[b.x, b.y]];
      let x = b.x, y = b.y, a = b.a;
      const n = Math.max(3, Math.round(b.l / 12));
      for (let i = 0; i < n; i++) {
        a += (Math.random() - 0.5) * 1.1;
        x += Math.cos(a) * (b.l / n);
        y += Math.sin(a) * (b.l / n);
        pts.push([x, y]);
      }
      for (const [col, lw, al] of [[ICE, 4, 0.25], [[201, 255, 243], 1.2, 0.95]]) {
        ctx.lineWidth = lw;
        ctx.strokeStyle = rgba(col, al * b.life);
        ctx.beginPath();
        pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
        ctx.stroke();
      }
    }

    for (const s of sparks) {
      ctx.globalAlpha = s.life;
      const r = 6 * s.life + 2;
      ctx.drawImage(s.red ? SPR_RED : SPR_ICE, s.x - r, s.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  };

  /* ----- Ratón, dedo y enlaces ----- */
  const local = (e) => {
    const r = stage.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    [cursor.x, cursor.y] = local(e);
    cursor.in = true;
  });
  stage.addEventListener("pointerleave", () => (cursor.in = false));
  stage.addEventListener("echo:charge", (e) => (charge = e.detail.on ? { since: performance.now() } : null));
  // al reventar el botón de contacto: rayos y una onda de sonido desde el botón, y el murciélago chilla con todo
  stage.addEventListener("echo:burst", (e) => {
    charge = null;
    const { x, y } = e.detail;
    zap(x, y, 16, mobile ? 120 : 190);
    for (let i = 0; i < 50; i++) {
      const a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 9;
      sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, red: Math.random() < 0.35 });
    }
    if (!firstRing) return;
    emit(0, Math.PI, mobile ? 70 : 110, true, x, y);
    emitTo(x, y, 0.25, 20);
  });
  // en táctil: un toque es un chillido hacia ese punto y aparta las chispas un momento
  stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || !firstRing) return;
    const [x, y] = local(e);
    emitTo(x, y, 0.3, 22);
    for (const p of parts) {
      const dx = p.X - x, dy = p.Y - y, d = Math.hypot(dx, dy);
      if (d < 80 && d > 1) { p.vx += (dx / d) * 8; p.vy += (dy / d) * 8; }
    }
  });
  for (const t of targets) {
    const on = () => { t.hover = true; nextPing = 0; };
    const off = () => (t.hover = false);
    t.el.addEventListener("pointerenter", on);
    t.el.addEventListener("pointerleave", off);
    t.el.addEventListener("focusin", on);
    t.el.addEventListener("focusout", off);
  }

  /* ----- Bucle: solo mientras se ve ----- */
  let running = false, last = 0;
  const frame = (now) => {
    if (!running) return;
    // el sello del rAF puede ser anterior al performance.now() con el que arrancamos: nunca hacia atrás
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    step(dt);
    draw();
    requestAnimationFrame(frame);
  };
  new ResizeObserver(() => {
    layout();
    if (!motion) { step(0); draw(); }
  }).observe(stage);

  if (!motion) {
    targets.forEach((t) => { t.found = true; t.el.classList.add("is-found"); });
    nFound = targets.length;
    status(`&gt; ${targets.length} señales encontradas`);
    return;
  }
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && introT < 0 && entry.intersectionRatio >= 0.3) introT = 0;
      if (entry.isIntersecting && !running) {
        running = true;
        layout();
        last = performance.now();
        requestAnimationFrame(frame);
      } else if (!entry.isIntersecting) running = false;
    },
    { threshold: [0, 0.3] }
  ).observe(stage);
}
