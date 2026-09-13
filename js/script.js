// Custom cursor
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const interactives = document.querySelectorAll('a, button, .btn-email');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });

        document.addEventListener('mousemove', (e) => {
            if (cursorRing.classList.contains('hover')) {
                cursorDot.classList.add('hover');
            } else {
                cursorDot.classList.remove('hover');
            }
        });
    }
});

// Scroll Progress Animation
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgressPercent = (window.scrollY / totalHeight) * 100;
    
    scrollProgress.style.width = `${scrollProgressPercent}%`;
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress(); // Initialize

// Molecular Animation Canvas
function initMolecularAnimation() {
    const canvas = document.getElementById('molecules');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Particle class for molecular animation
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `hsla(${Math.random() * 60 + 180}, 70%, 50%, ${Math.random() * 0.5})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Draw connection lines between nearby particles
            particles.forEach(particle => {
                const distance = Math.hypot(this.x - particle.x, this.y - particle.y);
                if (distance < 150) {
                    ctx.strokeStyle = `${this.color} ${0.2 - distance / 750}`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                }
            });
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function animateMolecules() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Add new particles occasionally
        if (Math.random() < 0.02) {
            particles.push(new Particle());
        }
        
        // Limit particle count for performance
        if (particles.length > 50) {
            particles.splice(0, particles.length - 50);
        }
        
        animationId = requestAnimationFrame(animateMolecules);
    }
    
    // Initialize
    resizeCanvas();
    animateMolecules();
    
    // Handle resize events
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

// Initialize molecular animation
initMolecularAnimation();

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.nav-mobile-toggle');
    const mobileMenu = document.getElementById('nav-mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking links
        document.querySelectorAll('.nav-mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
});

// Avatar Ring Animation
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.hero-avatar');
    const avatarRing = document.querySelector('.avatar-ring');
    
    if (avatar && avatarRing) {
        avatar.addEventListener('mouseenter', () => {
            avatarRing.style.animation = 'pulse 2s infinite';
        });
        
        avatar.addEventListener('mouseleave', () => {
            avatarRing.style.animation = 'none';
        });
    }
});

// Enhanced Section Animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const allRevealElements = document.querySelectorAll(
        '.hero-about-card, .experience-card, .education-card, .achievement-card, .section-header'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Add stagger effect for cards
                    if (entry.target.classList.contains('education-card') || 
                        entry.target.classList.contains('achievement-card')) {
                        entry.target.style.transitionDelay = '0.1s';
                    }
                }
            });
        }, observerOptions);
        
        allRevealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
});

// Smooth scroll for anchor links
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

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Reveal animation on scroll (Intersection Observer with fallback)
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
};

const cards = document.querySelectorAll('.hero-about-card, .experience-card');

// Check if IntersectionObserver is supported
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
} else {
    // Fallback: show all cards immediately
    cards.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'none';
    });
}

// Email copy button interaction
const emailBtn = document.getElementById('email-copy-btn');
const copyToast = document.getElementById('copy-toast');

if (emailBtn) {
    emailBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('adith08@gmail.com');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = 'adith08@gmail.com';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        copyToast.classList.add('show');
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2000);
    });
}

console.log('Portfolio loaded successfully');

// Footer email copy functionality
const emailBtnFooter = document.getElementById('email-copy-btn-footer');
if (emailBtnFooter && copyToast) {
    emailBtnFooter.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('adith08@gmail.com');
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = 'adith08@gmail.com';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        copyToast.classList.add('show');
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2000);
    });
}