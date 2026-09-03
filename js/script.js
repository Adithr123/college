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
    const revealElements = document.querySelectorAll('.reveal');
    let hasIntersected = false;

    function revealOnScroll() {
        const windowHeight = window.innerHeight;

        revealElements.forEach(function (el) {
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 120;

            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    }

    // Use IntersectionObserver for better performance
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
            rootMargin: '0px 0px -80px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        window.addEventListener('scroll', revealOnScroll, { passive: true });
        revealOnScroll();
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

                    // Ease out cubic
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
        const rate = scrolled * 0.15;

        const title = heroShell.querySelector('.hero-title');
        const subtitle = heroShell.querySelector('.hero-subtitle');
        const stats = heroShell.querySelector('.hero-stats');

        if (title) title.style.transform = 'translateY(' + rate * 0.3 + 'px)';
        if (subtitle) subtitle.style.transform = 'translateY(' + rate * 0.5 + 'px)';
        if (stats) stats.style.transform = 'translateY(' + rate * 0.7 + 'px)';
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

            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;

            card.style.transform =
                'translateY(-4px) perspective(1000px) rotateX(' +
                rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });
})();

/* ========================================
   PAGE LOAD ANIMATION
======================================== */
(function () {
    // Fade in hero content
    const heroContent = document.querySelectorAll('.hero-shell > .container > .row > *');
    heroContent.forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease ' + (i * 0.15) + 's, transform 0.6s ease ' + (i * 0.15) + 's';

        setTimeout(function () {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    // Fade in other sections on scroll
    document.querySelectorAll('section:not(#hero)').forEach(function (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('section:not(#hero)').forEach(function (section) {
        sectionObserver.observe(section);
    });
})();
