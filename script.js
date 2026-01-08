// ========================================
// Particle Background System
// Interactive particles with connection lines and mouse repulsion
// ========================================
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = (canvas.width * canvas.height) / 9000; // Adjust density

// Mouse object for interaction
let mouse = {
  x: null,
  y: null,
  radius: 150
};

// Update mouse position
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Reset mouse when leaving window
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Particle class
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 4 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  }

  // Update position and handle mouse interaction
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off walls
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.speedY = -this.speedY;
    }

    // Mouse repulsion
    if (mouse.x && mouse.y) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        let force = mouse.radius / distance;
        this.x -= dx * force * 0.05;
        this.y -= dy * force * 0.05;
      }
    }
  }

  // Draw particle
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
function initParticles() {
  particlesArray = [];
  let count = (canvas.width * canvas.height) / 9000;
  for (let i = 0; i < count; i++) {
    particlesArray.push(new Particle());
  }
}

// Connect nearby particles with lines
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.hypot(dx, dy);

      if (distance < 120) {
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
        ctx.globalAlpha = 1 - (distance / 120);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(particle => {
    particle.update();
    particle.draw();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}

// Start everything
initParticles();
animateParticles();

// ========================================
// Typing Effect for Main Title
// ========================================
const typingText = "Welcome to My Developer Portfolio";
const typingElement = document.querySelector('.typing');
let charIndex = 0;

function typeCharacter() {
  if (charIndex < typingText.length) {
    typingElement.textContent += typingText.charAt(charIndex);
    charIndex++;
    setTimeout(typeCharacter, 100);
  }
}

// Start typing after page load
window.addEventListener('load', () => {
  setTimeout(typeCharacter, 500);
});

// ========================================
// Scroll Fade-In Animations
// ========================================
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target); // Only animate once
    }
  });
}, observerOptions);

fadeElements.forEach(el => {
  fadeObserver.observe(el);
});

// ========================================
// Mobile Menu Toggle
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Close menu when clicking a link (mobile)
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    menuToggle.textContent = '☰';
  });
});

// ========================================
// Theme Toggle (Dark/Light Mode)
// ========================================
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  // Update button icon
  if (document.body.classList.contains('light-mode')) {
    themeToggle.textContent = '☀';
    // Re-init particles to update accent color
    initParticles();
  } else {
    themeToggle.textContent = '🌙';
    initParticles();
  }
});

// Set initial icon based on default (dark)
themeToggle.textContent = '🌙';
