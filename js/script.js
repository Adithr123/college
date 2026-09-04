// ========================================
// Custom Cursor
// ========================================
const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        if (mouseX && mouseY) {
            // Smooth easing
            const ease = 0.15;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;

            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        requestAnimationFrame(animateCursor);
    };

    animateCursor();
}

// ========================================
// Particle Background
// ========================================
const canvas = document.getElementById('bg-particles');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    let width, height;
    let particles = [];
    const particleCount = 60;
    const particleSpeed = 0.3;
    const particleSize = 1.5;

    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.alpha = Math.random() * 0.3 + 0.1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(123, 211, 137, ${this.alpha})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    };

    animate();
}

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// Intersection Observer for Reveal Animations
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Already animated
            return;
        }

        const element = entry.target;
        const className = element.classList;

        if (className.contains('reveal-left')) {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = '';
        } else if (className.contains('reveal-up')) {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = '';
        }
    });
}, observerOptions);

// Observe elements with reveal classes
document.querySelectorAll('.reveal-left, .reveal-up').forEach(el => {
    observer.observe(el);
});

// ========================================
// Active Navigation Highlight
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

const onScroll = () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', onScroll);

// ========================================
// Typing Effect (Optional)
// ========================================
// You can uncomment the following to add a typing effect to the hero title

/*
const heroTitle = document.querySelector('.hero-title span.accent-text');

if (heroTitle) {
    const name = heroTitle.textContent;
    let i = 0;
    let isDeleting = false;
    let cycleCount = 0;

    const typeEffect = () => {
        const currentText = name.slice(0, i);
        
        if (isDeleting) {
            heroTitle.textContent = currentText;
            i--;
        } else {
            heroTitle.textContent = currentText;
            i++;
        }

        const typeSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 200 : 0;

        if (!isDeleting && i === name.length) {
            setTimeout(() => { isDeleting = true; }, typeSpeed + pauseTime);
        } else if (isDeleting && i === 0) {
            isDeleting = false;
            cycleCount++;
            if (cycleCount < 2) {
                setTimeout(typeEffect, typeSpeed + pauseTime);
            }
        } else {
            setTimeout(typeEffect, typeSpeed);
        }
    };

    setTimeout(typeEffect, 1000);
}
*/

console.log('Portfolio loaded successfully');