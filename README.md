# CV Interactivo

El CV y portfolio de **Enrique Rincón**: una web de una sola página, hecha a mano y sin frameworks, para presentar mi perfil, mis proyectos y mi trayectoria de una forma más viva que un PDF.

🌐 **Web:** https://rinconn.github.io/CV-INTERAKTIVO/

## Qué hay en la web

### Secciones

- **Inicio**: presentación con texto que se escribe solo (Frontend / Backend / Full Stack Developer), indicador de disponibilidad y un globo de humo con tormenta eléctrica dibujado en canvas.
- **01. Skills**: dos carruseles de tecnologías en sentidos opuestos sobre un fondo de red de nodos, con tooltips que indican dónde usé cada una, y mis soft skills.
- **02. Proyectos**: tarjetas con tilt 3D y efecto parallax.
- **03. Trayectoria**: línea de tiempo en la que un cerebro "recuerda" y un hilo de energía va encendiendo cada hito (formación, experiencia, proyectos y prácticas).
- **04. Contacto**: un murciélago de chispas que ecolocaliza, copia del email con un clic, QR con mi tarjeta de contacto y descarga de la vCard (`.vcf`).

### Interacciones

- **Paleta de comandos** (`Ctrl/⌘ + K`) para saltar a una sección, copiar el email o abrir mis redes.
- **Terminal** (tecla `º`): el CV respondiendo a comandos; lee los datos de la propia página y `git log` trae mis últimos commits reales de GitHub.
- **Modo reclutador** (`cv`): el CV entero en una pantalla, para leerlo en 30 segundos, con botón de imprimir / guardar en PDF.
- **Murciélago acompañante** que te sigue por la web y ecolocaliza cada sección.
- Botones magnéticos, título que reacciona al ratón y barra de progreso de lectura.
- Algún que otro easter egg (abre la consola o prueba a hacer triple clic en el avatar).

### Rendimiento y accesibilidad

- Calidad adaptativa: si el equipo va justo de fps, los canvas pasan solos a modo ligero.
- Las animaciones se pausan en las secciones que no se ven.
- Respeta `prefers-reduced-motion`.
- Imágenes en WebP con versiones responsive y Open Graph / tarjeta de X para compartir el enlace.

## Stack de la web

- HTML5, CSS3 y JavaScript vanilla (sin build ni dependencias que instalar)
- [GSAP](https://gsap.com/) + ScrollTrigger para las animaciones
- [Lenis](https://lenis.darkroom.engineering/) para el scroll suave
- Canvas 2D para el globo, la red de skills, el cerebro y el murciélago
- Tipografías: Inter, JetBrains Mono y Clash Display
- Desplegada en GitHub Pages

## Estructura

```
├── index.html        # Contenido de la página
├── css/styles.css    # Estilos
├── js/main.js        # Animaciones, canvas y interacciones
└── assets/           # Avatar, imágenes de proyectos y recursos
```

## Ejecutarlo en local

No requiere instalación. Clona el repositorio y sirve la carpeta con cualquier servidor estático:

```bash
git clone https://github.com/rinconn/CV-INTERAKTIVO.git
cd CV-INTERAKTIVO
python3 -m http.server 8000
```

Después abre http://localhost:8000.

## Tecnologías

**Frontend:** HTML5, CSS3, JavaScript, TypeScript, React, Angular, Tailwind CSS, Bootstrap, Vite

**Backend y bases de datos:** Java, Spring Boot, Python, Node.js, MySQL, MongoDB

**Herramientas:** Docker, Git, GitHub, Power Apps, Power Automate, Power Pages

## Proyectos

- [**ScriptBay**](https://github.com/rinconn/ScriptBay): marketplace de scripts y recursos digitales con licencias verificadas en blockchain (NFT). TFG del ciclo de DAW, en equipo de 3. *React, Node.js, Supabase, Solidity, Stripe.*
- [**TSender**](https://github.com/rinconn/TsenderPython): dApp Web3 para airdrops masivos de tokens, construida 100% en Python. Trabajo final de Python, en equipo. *Python, Streamlit, Web3.py, Solidity, SQLite.*

## Trayectoria

- Técnico Superior en Administración y Finanzas
- Becario (2024)
- Desarrollo de Aplicaciones Web (2024 — 2025)
- Prácticas en el equipo de IT, con Power Platform (actualmente)

## Contacto

- GitHub: [@rinconn](https://github.com/rinconn)
- LinkedIn: [Enrique Rincón Mateeva](https://www.linkedin.com/in/enrique-rincón-mateeva-264845363)
- Email: rincon.enriquemv@gmail.com

---

<img width="1857" height="902" alt="Captura de pantalla 2026-09-24 115945" src="https://github.com/user-attachments/assets/30dac109-ede9-4eb3-b23a-6a1752775856" />
<img width="1835" height="627" alt="Captura de pantalla 2026-09-24 124150" src="https://github.com/user-attachments/assets/ca90dec4-6abc-4ce0-b4af-b61b1c2badb7" />
