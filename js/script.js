/* ========================================
   CUSTOM CURSOR
======================================== */
(function () {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let currentScale = 1;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot follows instantly
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        
        // Update ring position
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        
        // Dynamic scale based on mouse speed
        const dist = Math.sqrt((mouseX - ringX) ** 2 + (mouseY - ringY) ** 2);
        currentScale = Math.min(Math.max(1 + dist * 0.001, 1), 1.5);
        ring.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    });

    // Hover states for interactive elements
    const hoverTargets = 'a, button, .glass-card, .stat-card, .lang-chip, input, textarea, .achievement-card, .timeline-card';
    document.addEventListener('mouseover', function (e) {
        if (e.target.closest(hoverTargets)) {
            dot.classList.add('hover');
            ring.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', function (e) {
        if (e.target.closest(hoverTargets)) {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        }
    });
})();

/* ========================================
   PARTICLE BACKGROUND
======================================== */
(function () {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;

    // Only run on desktop and tablet
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 767) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Adjust particle count based on screen size
    const PARTICLE_COUNT = window.innerWidth < 1024 ? 30 : 50;
    const CONNECTION_DISTANCE = window.innerWidth < 1024 ? 100 : 150;
    const REPULSION_DISTANCE = window.innerWidth < 1024 ? 80 : 120;
    const REPULSION_FORCE = window.innerWidth < 1024 ? 0.4 : 0.5;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.15
            });
        }
    }
    createParticles();

    // Mouse interaction
    let mouseParticle = { x: canvas.width / 2, y: canvas.height / 2 };
    let mouseVelocity = { x: 0, y: 0 };
    let lastMousePosition = { x: canvas.width / 2, y: canvas.height / 2 };
    let mouseMoved = false;

    document.addEventListener('mousemove', function (e) {
        mouseVelocity.x = e.clientX - lastMousePosition.x;
        mouseVelocity.y = e.clientY - lastMousePosition.y;
        lastMousePosition = { x: e.clientX, y: e.clientY };
        mouseMoved = true;
        mouseParticle.x = e.clientX;
        mouseParticle.y = e.clientY;
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(function (p) {
            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Add mouse influence
            if (mouseMoved) {
                const dx = p.x - mouseParticle.x;
                const dy = p.y - mouseParticle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < REPULSION_DISTANCE) {
                    const force = (REPULSION_DISTANCE - dist) / REPULSION_DISTANCE * REPULSION_FORCE;
                    p.vx += (dx / dist) * force * 0.1;
                    p.vy += (dy / dist) * force * 0.1;
                }
            }

            // Dampen velocity
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(123, 211, 137, ' + p.opacity + ')';
            ctx.fill();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(123, 211, 137, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        mouseMoved = false;
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ========================================
   NAVBAR SCROLL EFFECT
======================================== */
(function () {
    const navbar = document.getElementById('top');
    let lastScroll = 0;

    function handleScroll() {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
})();

/* ========================================
   SMOOTH SCROLL FOR NAV LINKS
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Close mobile nav
        const navCollapse = document.querySelector('.navbar-collapse');
        if (navCollapse && navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) bsCollapse.hide();
        }
    });
});

/* ========================================
   ACTIVE NAV LINK ON SCROLL
======================================== */
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
})();

/* ========================================
   SCROLL REVEAL ANIMATIONS
======================================== */
(function () {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }
})();

/* ========================================
   COUNTER ANIMATION FOR STATS
======================================== */
(function () {
    const statNumbers = document.querySelectorAll('.stat-card strong');
    let animated = false;

    function animateCounters() {
        if (animated) return;

        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            animated = true;

            statNumbers.forEach(function (el) {
                const targetText = el.textContent.trim();
                const targetNum = parseFloat(targetText);

                if (isNaN(targetNum)) return;

                const hasPlus = targetText.includes('+');
                const hasDot = targetText.includes('.');
                const duration = 1500;
                const startTime = performance.now();

                function update(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * targetNum;

                    if (hasDot) {
                        el.textContent = current.toFixed(2) + (hasPlus ? '+' : '');
                    } else {
                        el.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.textContent = targetText;
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();
})();

/* ========================================
   PARALLAX-LIKE HERO ELEMENTS
======================================== */
(function () {
    const heroShell = document.querySelector('.hero-shell');
    if (!heroShell) return;

    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.08;

        const title = heroShell.querySelector('.hero-title');
        const subtitle = heroShell.querySelector('.hero-subtitle');
        const stats = heroShell.querySelector('.hero-stats');

        if (title) title.style.transform = 'translateY(' + rate * 0.3 + 'px) scale(' + (1 - rate * 0.0005) + ')';
        if (subtitle) subtitle.style.transform = 'translateY(' + rate * 0.5 + 'px) scale(' + (1 - rate * 0.0003) + ')';
        if (stats) stats.style.transform = 'translateY(' + rate * 0.7 + 'px) scale(' + (1 - rate * 0.0002) + ')';
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
})();

/* ========================================
   TILT EFFECT ON CARDS
======================================== */
(function () {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform =
                'translateY(-6px) perspective(1000px) rotateX(' +
                rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
})();

/* ========================================
   MAGNETIC BUTTON EFFECT
======================================== */
(function () {
    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0, 0)';
        });
    });
})();

/* ========================================
   PAGE LOAD ANIMATION
======================================== */
(function () {
    // Fade in hero content with staggered animation
    const heroContent = document.querySelectorAll('.hero-shell > .container > .row > *');
    heroContent.forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.95)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.12) + 's, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.12) + 's';

        setTimeout(function () {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, 100);
    });

    // Fade in other sections on scroll
    document.querySelectorAll('section:not(#hero)').forEach(function (section, index) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px) scale(0.98)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ' + (index * 0.08 + 0.2) + 's, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ' + (index * 0.08 + 0.2) + 's';
    });

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('section:not(#hero)').forEach(function (section) {
        sectionObserver.observe(section);
    });
})();
