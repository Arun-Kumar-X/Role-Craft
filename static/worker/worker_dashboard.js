// ==== Particle Background for Worker Dashboard ====

const canvas = document.getElementById("bgAnimation");
const ctx = canvas.getContext("2d");
let particlesArray = [];
const numParticles = 90;

// Resize canvas to full window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Track mouse position
const mouse = { x: null, y: null };
window.addEventListener("mousemove", e => {
  mouse.x = e.x;
  mouse.y = e.y;
});

// Particle class
class Particle {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce from edges
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Mouse interaction
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      this.x -= dx / 20;
      this.y -= dy / 20;
    }
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 3
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
function init() {
  particlesArray = [];
  for (let i = 0; i < numParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const speedX = (Math.random() - 0.5) * 0.7;
    const speedY = (Math.random() - 0.5) * 0.7;
    const colors = ["#FFF2F2", "#A9B5DF", "#7886C7", "#2D336B"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
  }
}

// Connect nearby particles with lines
function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.strokeStyle = "rgba(45, 51, 107, 0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animate background
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

// Initialize and start animation
init();
animate();
