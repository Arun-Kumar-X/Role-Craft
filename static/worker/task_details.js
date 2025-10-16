// ==== Interactive Particle Background ====
const canvas = document.getElementById("bgAnimation");
const ctx = canvas.getContext("2d");
let particlesArray = [];
const numParticles = 90; // slightly more for richer effect


// Resize canvas
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.zIndex=-1
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// Track mouse
const mouse = { x: null, y: null };
window.addEventListener("mousemove", (event) => {
mouse.x = event.x;
mouse.y = event.y;
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
this.alpha = Math.random() * 0.6 + 0.2; // glow variation
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
const distance = Math.sqrt(dx * dx + dy * dy);
if (distance < 150) {
    this.x -= dx / 20;
    this.y -= dy / 20;
}
}


draw() {
ctx.beginPath();
const gradient = ctx.createRadialGradient(
    this.x,
    this.y,
    0,
    this.x,
    this.y,
    this.size * 3
);
gradient.addColorStop(0, `${this.color}`);
gradient.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = gradient;
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


// Connect particles with lines
function connectParticles() {
for (let a = 0; a < particlesArray.length; a++) {
for (let b = a; b < particlesArray.length; b++) {
    const dx = particlesArray[a].x - particlesArray[b].x;
    const dy = particlesArray[a].y - particlesArray[b].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 130) {
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
for (let i = 0; i < particlesArray.length; i++) {
particlesArray[i].update();
particlesArray[i].draw();
}
connectParticles();
requestAnimationFrame(animate);
}


init();
animate();

// Timer functionality
let timerSeconds = 9255; // 2:34:15 in seconds
let timerInterval;
let isTaskStarted = false;

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    document.getElementById('timer').textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Toggle task start/pause
function toggleTask() {
    const startBtn = document.getElementById('startBtn');
    const completeBtn = document.getElementById('completeBtn');
    
    if (!isTaskStarted) {
        // Start task
        startTimer();
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Task';
        completeBtn.classList.remove('hidden');
        isTaskStarted = true;
    } else {
        // Pause task
        stopTimer();
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume Task';
        isTaskStarted = false;
    }
}

// Complete task
function completeTask() {
    if (confirm('Are you sure you want to mark this task as complete?')) {
        stopTimer();
        alert('Task marked as complete! Redirecting to dashboard...');
        // Redirect to dashboard or handle completion
        // window.location.href = '/dashboard';
    }
}

// Save notes
function saveNotes() {
    const notes = document.getElementById('taskNotes').value;
    // Here you would typically send the notes to the server
    alert('Notes saved successfully!');
}

// Contact supervisor
function contactSupervisor(method) {
    switch(method) {
        case 'email':
            alert('Opening email client...');
            // window.location.href = 'mailto:john.davidson@company.com';
            break;
        case 'chat':
            alert('Opening chat...');
            break;
        case 'call':
            alert('Initiating call...');
            break;
    }
}

// Initialize
updateTimerDisplay();
