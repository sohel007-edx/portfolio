/**
 * SOHEL KHAN // NARUTO GAME DEVELOPER PORTFOLIO
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  initThemeEngine();
  initChakraCanvas();
  initCustomCursor();
  initTiltCard();
  initMissionFilters();
  initModals();
  initContactForm();
  initMobileNav();
  initChuninMiniGame();
  initEasterEgg();
});

/* ==========================================================================
   1. WEB AUDIO SYNTHESIZER (ZERO-DEPENDENCY PROCEDURAL SFX)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudio() {
  const toggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  toggleBtn.addEventListener('click', () => {
    getAudioContext();
    soundEnabled = !soundEnabled;
    toggleBtn.setAttribute('aria-pressed', soundEnabled);
    if (soundEnabled) {
      soundIcon.textContent = '🔊';
      playJutsuChime();
    } else {
      soundIcon.textContent = '🔇';
    }
  });

  // Sound triggers on interactive elements
  document.querySelectorAll('.btn, .nav-link, .filter-btn, .sign-btn, .ctrl-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      if (soundEnabled) playHoverSweep();
    });
    elem.addEventListener('click', () => {
      if (soundEnabled) playKunaiClash();
    });
  });
}

function playHoverSweep() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) {
    // Audio context may be restricted before user interaction
  }
}

function playKunaiClash() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {}
}

function playJutsuChime() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.22);
    });
  } catch (e) {}
}

function playScoreChime() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {}
}

function playRasenganExplosion() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  } catch (e) {}
}

function playHurtSound() {
  if (!soundEnabled || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  } catch (e) {}
}

/* ==========================================================================
   2. SHINOBI THEME ENGINE (LEAF, SHARINGAN, SAGE)
   ========================================================================== */
function initThemeEngine() {
  const themeMenuBtn = document.getElementById('theme-menu-btn');
  const themeDropdownWrap = themeMenuBtn.parentElement;
  const themeOpts = document.querySelectorAll('.theme-opt');
  const themeLabel = document.getElementById('theme-label');

  const savedTheme = localStorage.getItem('shinobi-theme') || 'leaf';
  setTheme(savedTheme);

  themeMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdownWrap.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    themeDropdownWrap.classList.remove('active');
  });

  themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const selected = opt.getAttribute('data-theme');
      setTheme(selected);
      themeDropdownWrap.classList.remove('active');
      if (soundEnabled) playJutsuChime();
    });
  });

  function setTheme(name) {
    document.documentElement.setAttribute('data-theme', name);
    localStorage.setItem('shinobi-theme', name);
    themeOpts.forEach(o => o.classList.toggle('active', o.getAttribute('data-theme') === name));

    if (name === 'leaf') {
      themeLabel.textContent = 'Will of Fire';
    } else if (name === 'sharingan') {
      themeLabel.textContent = 'Sharingan';
    } else if (name === 'sage') {
      themeLabel.textContent = 'Sage Mode';
    }
  }
}

/* ==========================================================================
   3. BACKGROUND CHAKRA CANVAS
   ========================================================================== */
function initChakraCanvas() {
  const canvas = document.getElementById('chakra-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const PARTICLE_COUNT = Math.min(width > 768 ? 45 : 25, 50);

  class ChakraParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1.2;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = -(Math.random() * 0.9 + 0.3); // floats upward like chakra fire
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
      this.type = Math.random() > 0.4 ? 'spark' : 'leaf';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulseAngle += this.pulseSpeed;

      // Mouse gentle interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 10;
      }
    }
    draw() {
      ctx.save();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'leaf';
      let colorGlow = '#ff6b00';
      if (currentTheme === 'sharingan') colorGlow = '#e63946';
      if (currentTheme === 'sage') colorGlow = '#00f0ff';

      const pulseAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulseAngle) * 0.2);

      if (this.type === 'spark') {
        ctx.fillStyle = colorGlow;
        ctx.globalAlpha = pulseAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colorGlow;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Falling/rising leaf petal
        ctx.fillStyle = '#ffb703';
        ctx.globalAlpha = pulseAlpha * 0.7;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size * 2, this.size, this.pulseAngle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new ChakraParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. CUSTOM KUNAI CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('chakra-cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let currentX = -100;
  let currentY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    currentX += (mouseX - currentX) * 0.22;
    currentY += (mouseY - currentY) * 0.22;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.querySelectorAll('a, button, input, textarea, select, .mission-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform += ' scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.4)', '');
    });
  });
}

/* ==========================================================================
   5. 3D TILT EFFECT ON SHINOBI ID CARD
   ========================================================================== */
function initTiltCard() {
  const wrapper = document.getElementById('shinobi-card-3d');
  if (!wrapper) return;
  const card = wrapper.querySelector('.id-card');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  });
}

/* ==========================================================================
   6. MISSION SCROLLS FILTERING (PROJECTS)
   ========================================================================== */
function initMissionFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.mission-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const rank = card.getAttribute('data-rank');
        if (filter === 'all' || rank === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT MODAL INSPECTION DETAILS
   ========================================================================== */
const PROJECT_DATA = {
  'modal-apex': {
    title: 'Super Striker 2026: Apex Ball',
    rank: 'S-Rank Flagship Mission',
    genre: 'Physics-Based Arcade Football Game',
    tagline: 'Bridging Sohel\'s Number 10 Football Striker Experience with Realtime Kinematics',
    overview: 'As a 19-year-old active football striker, I wanted to build a football game that genuinely respects the sensation of real ball flight. Super Striker 2026 explores realistic aerodynamic forces like the Magnus effect (how spinning balls curve), dynamic ground friction, and trajectory prediction.',
    stack: ['Unreal Engine 5', 'C++', 'Physics Simulation', 'Behavior Tree Goalkeeper AI', 'Blender'],
    highlights: [
      'Realistic Curve Physics: Implemented custom aerodynamic drag and Magnus force calculations in C++.',
      'Goalkeeper Reaction Matrices: Goalkeepers compute trajectory intercept cones with human-like reaction latency.',
      'Anime Hyper-Shots: Toggleable "Will of Fire" mode enabling bicycle kicks with particle smoke trails and slow-motion cinematic camera cuts.'
    ],
    nindoTakeaway: 'Proved how real-world athletic muscle memory translates directly into game mechanics math.'
  },
  'modal-shinobi': {
    title: 'Shinobi Striker: Way of Fire',
    rank: 'S-Rank Flagship Mission',
    genre: '3D Ninja Action Combat System',
    tagline: 'High-Speed Brawler Featuring Chakra Dashing, Aerial Juggles, and Hand-Sign Combos',
    overview: 'Inspired by beloved Naruto arena battlers, this prototype focuses on fluid movement mechanics: wall-running, chakra jumping, lightning dashes, and responsive 8-way combat animation cancelling.',
    stack: ['Unity 3D', 'C#', 'Finite State Machine (FSM)', 'Inverse Kinematics (IK)', 'Custom VFX Shaders'],
    highlights: [
      'State-Machine Combat: Seamless attack buffering allowing light, heavy, and jutsu sequences without input dropping.',
      'Wall Running Physics: Dynamic gravity realignment aligning player mesh normal to any climbable surface.',
      'Elemental Jutsu Chaining: Elemental affinity system where fire, lightning, and wind interact dynamically.'
    ],
    nindoTakeaway: 'Mastering state machines and animation frame windows gave me deep insight into fighter game responsiveness.'
  },
  'modal-dungeon': {
    title: 'Dungeon of the Nine Tails',
    rank: 'A-Rank Combat Simulation',
    genre: 'Procedural Roguelike RPG',
    tagline: 'Binary Space Partitioning (BSP) Dungeon Generation in C++',
    overview: 'Developed as part of my B.Tech CSE Core coursework at JECRC University, applying advanced data structures to create endless dungeons with dynamic room connections, item drops, and turn-based enemy AI.',
    stack: ['C++', 'Raylib / Custom Engine', 'Data Structures (Trees & Graphs)', 'A* Pathfinding Algorithm'],
    highlights: [
      'Procedural BSP Generation: Divides dungeon space recursively to guarantee fully connected rooms without deadlocks.',
      'A* Pathfinding: Intelligent monster roaming with line-of-sight occlusion and avoidance of environmental hazard traps.',
      'Inventory & Memory Management: Strict RAII and zero-leak memory management in raw C++.'
    ],
    nindoTakeaway: 'Proved the direct power of core Computer Science algorithms in game development.'
  },
  'modal-rasengan': {
    title: 'Rasengan Chakra Core (WebGL)',
    rank: 'A-Rank Visual Experiment',
    genre: 'GPU Particle Vortex Simulation',
    tagline: '50,000+ Swirling Particles Simulating Pure Naruto Chakra Energy',
    overview: 'An interactive browser-based GPU graphics demo showcasing high-speed vortex physics. Particles revolve along complex spherical spiral vectors, warping to audio input or cursor drag.',
    stack: ['WebGL', 'Three.js', 'Custom GLSL Compute Shaders', 'Web Audio API'],
    highlights: [
      'GPGPU Simulation: Particles updated directly on the graphics card for silky 60+ FPS on all devices.',
      'Turbulence Noise: Simulates the chaotic, spinning energy of Naruto\'s signature Rasengan sphere.',
      'Audio Reactive Mode: Particle vibration and radius pulse in sync with microphone or soundtrack frequencies.'
    ],
    nindoTakeaway: 'Demystified graphics programming and shader mathematics.'
  },
  'modal-kunai': {
    title: 'Kunai Velocity: Ninja Dash',
    rank: 'B-Rank Mechanics Prototype',
    genre: 'Precision 2D Speedrunner Platformer',
    tagline: 'Momentum Conservation and Grappling Hook Physics',
    overview: 'A frantic 2D platformer exploring player velocity curves. Featuring a ninja grappling kunai that swings through obstacles and catapults the runner through tight obstacles.',
    stack: ['Godot Engine', 'C#', 'Verlet Integration Physics', 'Custom Tilemaps'],
    highlights: [
      'Tight Responsive Movement: Zero floatiness with coyote-time jump buffering and snappy ground friction.',
      'Pendulum Swing Physics: Realistic swinging arcs conserving angular momentum on release.',
      'Integrated Speedrun Split Clock: Precise millisecond timer and ghost runner replay comparison.'
    ],
    nindoTakeaway: 'Good platformer design lives or dies by the feel of the first 30 seconds of jumping.'
  },
  'modal-omni': {
    title: 'Omni-Gamer Mechanics Lab',
    rank: 'B-Rank Design Sandbox',
    genre: 'Multi-Genre Game Mechanics Dissection',
    tagline: 'Reverse Engineering Why Games Feel Good Across 20+ Genres',
    overview: 'A living interactive research document and test suite analyzing mechanical tropes from FPS recoil curves, fighter hitstop frames, RTS fog-of-war, to racing tire drift slip angles.',
    stack: ['Game Systems Design', 'Mathematical Curve Modeling', 'Interactive Prototyping', 'Player UX'],
    highlights: [
      'Cross-Genre Synthesis: How football spatial awareness improves FPS team coordination and vice versa.',
      'Hitstop & Screen Shake Formulas: Exact mathematical formulas for impact punchiness.',
      'Input Latency Breakdown: Comparing responsive frame loops across industry game engines.'
    ],
    nindoTakeaway: 'Having played almost every genre allows me to innovate rather than merely clone existing games.'
  }
};

function initModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const box = document.getElementById('modal-box');
  const content = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close-btn');

  document.querySelectorAll('.modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalKey = trigger.getAttribute('data-modal');
      const data = PROJECT_DATA[modalKey];
      if (!data) return;

      content.innerHTML = `
        <div style="margin-bottom: 20px;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-orange); font-weight: 700; letter-spacing: 1px;">${data.rank} • ${data.genre}</span>
          <h2 style="font-family: var(--font-epic); font-size: 1.8rem; color: #fff; margin: 6px 0;">${data.title}</h2>
          <p style="font-size: 0.95rem; color: var(--accent-gold); font-style: italic;">"${data.tagline}"</p>
        </div>

        <div style="margin-bottom: 20px; line-height: 1.6; color: #d4d9e8; font-size: 0.95rem;">
          <p>${data.overview}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px;">TECH ARSENAL:</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.stack.map(s => `<span style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-family: var(--font-mono); color: #fff;">${s}</span>`).join('')}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-family: var(--font-epic); font-size: 1rem; color: #fff; margin-bottom: 8px;">Key Technical Accomplishments:</h4>
          <ul style="padding-left: 20px; color: #cbd2e2; font-size: 0.9rem; line-height: 1.6;">
            ${data.highlights.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
          </ul>
        </div>

        <div style="background: rgba(255,107,0,0.1); border-left: 3px solid var(--accent-orange); padding: 12px 16px; border-radius: 4px;">
          <strong style="color: var(--accent-gold); font-size: 0.82rem; font-family: var(--font-mono); display: block; margin-bottom: 2px;">THE SHINOBI'S TAKEAWAY:</strong>
          <span style="font-size: 0.9rem; color: #e6ebf5; font-style: italic;">${data.nindoTakeaway}</span>
        </div>
      `;

      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      if (soundEnabled) playKunaiClash();
    });
  });

  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });
}

/* ==========================================================================
   8. CONTACT FORM & HAND SIGNS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('summon-form');
  const status = document.getElementById('form-status');
  const signBtns = document.querySelectorAll('.sign-btn');
  let selectedSign = 'Tiger';

  signBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      signBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSign = btn.getAttribute('data-sign');
      if (soundEnabled) playJutsuChime();
    });
  });

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('shinobi-name').value.trim();
    const email = document.getElementById('shinobi-email').value.trim();
    const mission = document.getElementById('mission-type').value;
    const message = document.getElementById('shinobi-message').value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠️ Please fill all required scroll fields!';
      status.style.color = '#ff4d6d';
      return;
    }

    if (soundEnabled) playRasenganExplosion();

    status.innerHTML = `🌀 <strong>Kuchiyose no Jutsu!</strong> Hand Sign: <em>${selectedSign}</em>. Summoning scroll successfully prepared for Sohel Khan! Opening mail dispatch...`;
    status.style.color = '#2ec4b6';

    const subject = encodeURIComponent(`[Shinobi Mission: ${mission.toUpperCase()}] From ${name}`);
    const body = encodeURIComponent(`Shinobi / Guild: ${name}\nVillage Mail: ${email}\nHand Sign: ${selectedSign}\nClassification: ${mission}\n\nScroll Message:\n${message}\n\nSent from Sohel Khan Portfolio Website`);
    
    setTimeout(() => {
      window.location.href = `mailto:sohelkhan.gamedev@gmail.com?subject=${subject}&body=${body}`;
      form.reset();
    }, 1200);
  });
}

/* ==========================================================================
   9. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  drawer.querySelectorAll('.m-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   10. PLAYABLE CANVAS MINI-GAME: CHUNIN EXAM DASH
   ========================================================================== */
function initChuninMiniGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const hudScore = document.getElementById('hud-score');
  const hudHighScore = document.getElementById('hud-highscore');
  const hudChakraFill = document.getElementById('hud-chakra-fill');
  const hudRank = document.getElementById('hud-rank');

  const overlay = document.getElementById('game-overlay');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');
  const btnStart = document.getElementById('btn-start-game');

  // Mobile Pad Buttons
  const mBtnLeft = document.getElementById('m-btn-left');
  const mBtnRight = document.getElementById('m-btn-right');
  const mBtnJump = document.getElementById('m-btn-jump');
  const mBtnSpecial = document.getElementById('m-btn-special');

  let width = canvas.width = 800;
  let height = canvas.height = 420;

  let isPlaying = false;
  let score = 0;
  let highScore = parseInt(localStorage.getItem('shinobi-high-score') || '0', 10);
  hudHighScore.textContent = highScore;

  let chakra = 0; // 0 to 100
  let rasenganActive = false;
  let rasenganTimer = 0;

  const player = {
    x: width / 2 - 20,
    y: height - 80,
    width: 36,
    height: 52,
    speed: 7,
    vx: 0,
    vy: 0,
    isJumping: false,
    facingRight: true
  };

  const keys = {
    left: false,
    right: false,
    up: false
  };

  let items = []; // falling chakra orbs and footballs
  let obstacles = []; // falling kunai
  let spawnTimer = 0;
  let particles = [];

  // Key Listeners
  window.addEventListener('keydown', (e) => {
    if (!isPlaying) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      keys.left = true;
      e.preventDefault();
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      keys.right = true;
      e.preventDefault();
    }
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      if (!player.isJumping) {
        player.vy = -13;
        player.isJumping = true;
      }
      e.preventDefault();
    }
    if (e.key === 'z' || e.key === 'Z' || e.key === 'r' || e.key === 'R') {
      triggerRasengan();
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
  });

  // Mobile Button Handlers
  function bindTouch(btn, onDown, onUp) {
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('mouseup', onUp);
  }

  bindTouch(mBtnLeft, () => { keys.left = true; }, () => { keys.left = false; });
  bindTouch(mBtnRight, () => { keys.right = true; }, () => { keys.right = false; });
  bindTouch(mBtnJump, () => {
    if (!player.isJumping && isPlaying) {
      player.vy = -13;
      player.isJumping = true;
    }
  }, () => {});
  bindTouch(mBtnSpecial, () => { triggerRasengan(); }, () => {});

  btnStart.addEventListener('click', startGame);

  function startGame() {
    isPlaying = true;
    score = 0;
    chakra = 0;
    rasenganActive = false;
    items = [];
    obstacles = [];
    particles = [];
    player.x = width / 2 - 20;
    player.y = height - 80;
    player.vx = 0;
    player.vy = 0;
    player.isJumping = false;
    overlay.classList.add('hidden');
    updateHUD();
    if (soundEnabled) playJutsuChime();
  }

  function gameOver() {
    isPlaying = false;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('shinobi-high-score', highScore);
      hudHighScore.textContent = highScore;
    }
    overlayTitle.textContent = 'EXAM COMPLETED!';
    overlayDesc.innerHTML = `You scored <strong class="text-fire">${score} pts</strong>!<br>Shinobi Rank Attained: <strong class="text-fire">${getRankTitle(score)}</strong>`;
    btnStart.querySelector('span').textContent = 'TRY AGAIN (再挑戦)';
    overlay.classList.remove('hidden');
    if (soundEnabled) playHurtSound();
  }

  function triggerRasengan() {
    if (chakra >= 100 && !rasenganActive && isPlaying) {
      rasenganActive = true;
      rasenganTimer = 240; // ~4 seconds at 60fps
      chakra = 0;
      score += 500;
      updateHUD();
      createBurstEffect(player.x + 18, player.y + 26, '#00f0ff', 40);
      playRasenganExplosion();
      // Destroy all obstacles currently on screen
      obstacles = [];
    }
  }

  function getRankTitle(pts) {
    if (pts < 500) return 'ACADEMY STUDENT';
    if (pts < 1500) return 'GENIN';
    if (pts < 3000) return 'CHUNIN';
    if (pts < 5000) return 'JONIN';
    return 'GAME HOKAGE';
  }

  function updateHUD() {
    hudScore.textContent = score;
    hudChakraFill.style.width = `${Math.min(100, chakra)}%`;
    hudRank.textContent = getRankTitle(score);
  }

  function createBurstEffect(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: color,
        life: 30
      });
    }
  }

  // Main Game Loop
  function gameLoop() {
    ctx.clearRect(0, 0, width, height);

    // Background Arena Draw
    drawGameArena();

    if (isPlaying) {
      updateGame();
    }

    drawGameEntities();

    requestAnimationFrame(gameLoop);
  }

  function drawGameArena() {
    // Ground
    ctx.fillStyle = '#111420';
    ctx.fillRect(0, height - 30, width, 30);
    ctx.fillStyle = 'rgba(255, 107, 0, 0.4)';
    ctx.fillRect(0, height - 32, width, 2);

    // Subtle arena speedlines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
  }

  function updateGame() {
    // Player horizontal movement
    if (keys.left) {
      player.vx = -player.speed;
      player.facingRight = false;
    } else if (keys.right) {
      player.vx = player.speed;
      player.facingRight = true;
    } else {
      player.vx *= 0.7; // friction
    }

    player.x += player.vx;
    if (player.x < 0) player.x = 0;
    if (player.x > width - player.width) player.x = width - player.width;

    // Gravity & Vertical movement
    player.vy += 0.65; // gravity
    player.y += player.vy;
    if (player.y >= height - 30 - player.height) {
      player.y = height - 30 - player.height;
      player.vy = 0;
      player.isJumping = false;
    }

    // Rasengan timer
    if (rasenganActive) {
      rasenganTimer--;
      if (rasenganTimer <= 0) {
        rasenganActive = false;
      }
    }

    // Spawning items & obstacles
    spawnTimer++;
    if (spawnTimer % 45 === 0) {
      const isFootball = Math.random() > 0.5;
      items.push({
        x: Math.random() * (width - 40) + 20,
        y: -30,
        type: isFootball ? 'football' : 'chakra',
        speed: Math.random() * 2 + 2.5,
        radius: 14,
        rot: 0
      });
    }

    // Spawn Kunai obstacles
    const kunaiInterval = Math.max(25, 65 - Math.floor(score / 200));
    if (spawnTimer % kunaiInterval === 0) {
      obstacles.push({
        x: Math.random() * (width - 30) + 15,
        y: -30,
        speed: Math.random() * 2.5 + 3.5,
        width: 14,
        height: 28
      });
    }

    // Update items
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;
      item.rot += 0.05;

      // Check collision with player
      if (
        player.x < item.x + item.radius &&
        player.x + player.width > item.x - item.radius &&
        player.y < item.y + item.radius &&
        player.y + player.height > item.y - item.radius
      ) {
        if (item.type === 'football') {
          score += 200;
          chakra = Math.min(100, chakra + 25);
        } else {
          score += 150;
          chakra = Math.min(100, chakra + 20);
        }
        createBurstEffect(item.x, item.y, item.type === 'football' ? '#ffd166' : '#00f0ff', 12);
        playScoreChime();
        updateHUD();
        items.splice(i, 1);
        continue;
      }

      if (item.y > height - 20) {
        items.splice(i, 1);
      }
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.y += obs.speed;

      // Check collision with player
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        if (rasenganActive) {
          // Rasengan vaporizes kunai!
          createBurstEffect(obs.x + 7, obs.y + 14, '#ff6b00', 16);
          score += 100;
          updateHUD();
          obstacles.splice(i, 1);
          continue;
        } else {
          gameOver();
          return;
        }
      }

      if (obs.y > height - 20) {
        obstacles.splice(i, 1);
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawGameEntities() {
    // Draw Particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Draw Items
    items.forEach(it => {
      ctx.save();
      ctx.translate(it.x, it.y);
      ctx.rotate(it.rot);
      if (it.type === 'football') {
        // Football icon
        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚽', 0, 0);
      } else {
        // Chakra orb
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🌀', 0, 0);
      }
      ctx.restore();
    });

    // Draw Obstacles (Kunai)
    obstacles.forEach(ob => {
      ctx.save();
      ctx.translate(ob.x + 7, ob.y + 14);
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🗡️', 0, 0);
      ctx.restore();
    });

    // Draw Player
    ctx.save();
    ctx.translate(player.x, player.y);

    // Rasengan Shield Aura
    if (rasenganActive) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(player.width / 2, player.height / 2, 38, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Player Body (Sohel with Naruto Headband & Orange Tracksuit)
    // Legs
    ctx.fillStyle = '#1c1f2b';
    ctx.fillRect(6, 36, 10, 16);
    ctx.fillRect(20, 36, 10, 16);

    // Jacket (Orange)
    ctx.fillStyle = '#ff6b00';
    ctx.fillRect(4, 18, 28, 20);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(15, 18, 6, 20); // white zipper strip

    // Head
    ctx.fillStyle = '#f5c292';
    ctx.fillRect(8, 4, 20, 15);

    // Headband Fabric & Plate
    ctx.fillStyle = '#191b24';
    ctx.fillRect(6, 4, 24, 6);
    ctx.fillStyle = '#dcdfe8';
    ctx.fillRect(12, 5, 12, 4);

    // Hair
    ctx.fillStyle = '#111';
    ctx.fillRect(6, 0, 24, 4);

    // Eyes
    ctx.fillStyle = '#111';
    if (player.facingRight) {
      ctx.fillRect(20, 10, 3, 3);
    } else {
      ctx.fillRect(13, 10, 3, 3);
    }

    ctx.restore();
  }

  gameLoop();
}

/* ==========================================================================
   11. EASTER EGG (SECRET CHAKRA BURST)
   ========================================================================== */
function initEasterEgg() {
  const eggBtn = document.getElementById('easter-egg-btn');
  if (!eggBtn) return;

  eggBtn.addEventListener('click', () => {
    if (soundEnabled) playRasenganExplosion();
    document.body.style.animation = 'screenShake 0.4s ease';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 450);

    alert('🔥 "I never go back on my word, and I never leave a game project unfinished. That is my Nindo!" — Sohel Khan');
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes screenShake {
      0% { transform: translate(0, 0); }
      20% { transform: translate(-6px, 4px); }
      40% { transform: translate(6px, -4px); }
      60% { transform: translate(-4px, -2px); }
      80% { transform: translate(4px, 2px); }
      100% { transform: translate(0, 0); }
    }
  `;
  document.head.appendChild(style);
}
