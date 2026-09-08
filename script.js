/**
 * Happy Birthday ANIK - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const page3 = document.getElementById('page-3');
  const page4 = document.getElementById('page-4');
  const page5 = document.getElementById('page-5');

  const btnOpen = document.getElementById('btn-open');
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  const btnClickNow = document.getElementById('btn-click-now');

  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const musicIcon = document.getElementById('music-icon');

  const CORRECT_PASSWORD = '0894';

  // --- Page Navigation Helper ---
  function goToPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    fromPage.classList.add('hidden');

    setTimeout(() => {
      toPage.classList.remove('hidden');
      toPage.classList.add('active');
    }, 150);
  }

  // --- Audio Management ---
  let isPlaying = false;

  function initAudio() {
    musicToggle.classList.remove('hidden');
    bgMusic.volume = 0.5;

    // Play attempt
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
      musicIcon.textContent = '🎵';
    }).catch(() => {
      isPlaying = false;
      musicToggle.classList.remove('playing');
      musicIcon.textContent = '🔇';
    });
  }

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
      musicIcon.textContent = '🔇';
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicIcon.textContent = '🎵';
      }).catch(err => console.log('Audio playback info:', err));
    }
  });

  // --- Event Listeners ---

  // Page 1 -> Page 2
  btnOpen.addEventListener('click', () => {
    initAudio();
    goToPage(page1, page2);
  });

  // Page 2: NO button -> Nothing happens
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    // Do nothing as requested
  });

  // Page 2: YES button -> Page 3
  btnYes.addEventListener('click', () => {
    goToPage(page2, page3);
    setTimeout(() => {
      passwordInput.focus();
    }, 400);
  });

  // Page 3: Password verification
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();

    if (entered === CORRECT_PASSWORD) {
      passwordError.classList.add('hidden');
      goToPage(page3, page4);
      triggerBirthdayConfetti();
    } else {
      passwordError.classList.remove('hidden');
      // Trigger re-animation
      passwordError.style.animation = 'none';
      passwordError.offsetHeight; // Reflow
      passwordError.style.animation = 'shake 0.4s ease-in-out';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  // Page 4 -> Page 5
  btnClickNow.addEventListener('click', () => {
    goToPage(page4, page5);
    triggerBirthdayConfetti();
  });

  // ==========================================================================
  // BACKGROUND PARTICLES CANVAS (Floating Hearts, Stars & Rose Petals)
  // ==========================================================================
  const pCanvas = document.getElementById('particles-canvas');
  const pCtx = pCanvas.getContext('2d');

  let width = (pCanvas.width = window.innerWidth);
  let height = (pCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = pCanvas.width = window.innerWidth;
    height = pCanvas.height = window.innerHeight;
  });

  const particles = [];
  const particleSymbols = ['❤️', '✨', '💖', '🌸', '🌹', '⭐'];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 16 + 10; // Font size in px
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.symbol = particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.5 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      pCtx.save();
      pCtx.translate(this.x, this.y);
      pCtx.rotate(this.rotation);
      pCtx.globalAlpha = this.opacity;
      pCtx.font = `${this.size}px sans-serif`;
      pCtx.textAlign = 'center';
      pCtx.textBaseline = 'middle';
      pCtx.fillText(this.symbol, 0, 0);
      pCtx.restore();
    }
  }

  // Create particle pool
  const maxParticles = Math.min(Math.floor(width / 20), 40);
  for (let i = 0; i < maxParticles; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // initial spread
    particles.push(p);
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // ==========================================================================
  // CONFETTI ANIMATION CANVAS
  // ==========================================================================
  const cCanvas = document.getElementById('confetti-canvas');
  const cCtx = cCanvas.getContext('2d');

  cCanvas.width = window.innerWidth;
  cCanvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;
  });

  let confettiList = [];
  let confettiAnimId = null;

  class ConfettiItem {
    constructor() {
      this.x = Math.random() * cCanvas.width;
      this.y = -20 - Math.random() * 100;
      this.size = Math.random() * 8 + 6;
      this.color = ['#ff3366', '#ffd700', '#ff69b4', '#00e5ff', '#76ff03', '#ffffff'][
        Math.floor(Math.random() * 6)
      ];
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.opacity = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y > cCanvas.height - 50) {
        this.opacity -= 0.015;
      }
    }

    draw() {
      cCtx.save();
      cCtx.translate(this.x, this.y);
      cCtx.rotate((this.rotation * Math.PI) / 180);
      cCtx.globalAlpha = Math.max(0, this.opacity);
      cCtx.fillStyle = this.color;
      cCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      cCtx.restore();
    }
  }

  function triggerBirthdayConfetti() {
    confettiList = [];
    for (let i = 0; i < 120; i++) {
      confettiList.push(new ConfettiItem());
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

    function animateConfetti() {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      confettiList = confettiList.filter(c => c.opacity > 0 && c.y <= cCanvas.height);

      for (let i = 0; i < confettiList.length; i++) {
        confettiList[i].update();
        confettiList[i].draw();
      }

      if (confettiList.length > 0) {
        confettiAnimId = requestAnimationFrame(animateConfetti);
      } else {
        cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
      }
    }

    animateConfetti();
  }
});
