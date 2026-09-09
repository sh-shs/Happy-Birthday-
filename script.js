/**
 * Happy Birthday ANIK - Main Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const page4 = document.getElementById('page-4');
  const page5 = document.getElementById('page-5');

  const btnOpen = document.getElementById('btn-open');
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const btnClickNow = document.getElementById('btn-click-now');

  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');

  // --- Page Navigation Helper ---
  function goToPage(fromPage, toPage) {
    fromPage.classList.remove('active');
    fromPage.classList.add('hidden');

    setTimeout(() => {
      toPage.classList.remove('hidden');
      toPage.classList.add('active');
    }, 180);
  }

  // --- Web Audio Synthesizer for Soft Gentle Background Music ---
  let audioCtx = null;
  let isPlaying = false;
  let musicInterval = null;

  function createSoftTone(freq, duration, type = 'sine', gainVal = 0.08) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(gainVal, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio note error:', e);
    }
  }

  function playMelodySequence() {
    if (!isPlaying || !audioCtx) return;

    // Gentle pentatonic lullaby melody notes (frequencies in Hz)
    const melody = [
      { f: 523.25, d: 0.8 }, // C5
      { f: 659.25, d: 0.8 }, // E5
      { f: 783.99, d: 1.0 }, // G5
      { f: 880.00, d: 0.8 }, // A5
      { f: 783.99, d: 1.2 }, // G5
      { f: 659.25, d: 0.8 }, // E5
      { f: 587.33, d: 0.8 }, // D5
      { f: 523.25, d: 1.5 }  // C5
    ];

    let step = 0;
    if (musicInterval) clearInterval(musicInterval);

    musicInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(musicInterval);
        return;
      }
      const note = melody[step % melody.length];
      createSoftTone(note.f, note.d, 'sine', 0.06);
      // Soft harmony note
      if (step % 2 === 0) {
        createSoftTone(note.f / 2, note.d * 1.2, 'triangle', 0.03);
      }
      step++;
    }, 700);
  }

  function toggleMusicState() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isPlaying) {
      isPlaying = false;
      if (musicInterval) clearInterval(musicInterval);
      musicToggle.classList.remove('playing');
      musicIcon.textContent = '🔇';
    } else {
      isPlaying = true;
      musicToggle.classList.add('playing');
      musicIcon.textContent = '🎵';
      playMelodySequence();
    }
  }

  musicToggle.addEventListener('click', toggleMusicState);

  // --- Event Listeners ---

  // Screen 1 -> Screen 2
  btnOpen.addEventListener('click', () => {
    musicToggle.classList.remove('hidden');
    toggleMusicState();
    goToPage(page1, page2);
  });

  // Screen 2: NO button -> NO operation (stay on same screen, no alert, no action)
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Absolutely nothing happens
  });

  // Screen 2: YES button -> Screen 4 (Birthday Reveal)
  btnYes.addEventListener('click', () => {
    goToPage(page2, page4);
    triggerBirthdayConfetti();
  });

  // Screen 4 -> Screen 5
  btnClickNow.addEventListener('click', () => {
    goToPage(page4, page5);
    triggerBirthdayConfetti();
  });

  // ==========================================================================
  // BACKGROUND PARTICLES CANVAS (Floating Hearts, Stars, Sparkles & Rose Petals)
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
      this.size = Math.random() * 16 + 10;
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
    p.y = Math.random() * height;
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
