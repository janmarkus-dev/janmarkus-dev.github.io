/* ========================================
   LANCRE.SK – Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initNavbar();
    initMobileNav();
    initVideoPlaceholders();
    initCursorGlow();
    initSmoothScroll();
    initParallaxShapes();
    initSectionParallax();
});

/* ---- Reveal on Scroll (Intersection Observer) ---- */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
}

/* ---- Sticky Navbar with blur on scroll ---- */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    // Scroll class
    function onScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section tracking
        let current = '';
        document.querySelectorAll('.section').forEach((section) => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ---- Mobile Navigation ---- */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('open');
            links.classList.remove('open');
        }
    });
}

/* ---- YouTube Lazy-Load Placeholders ---- */
function initVideoPlaceholders() {
    document.querySelectorAll('.video-placeholder').forEach((placeholder) => {
        placeholder.addEventListener('click', () => {
            const container = placeholder.closest('.video-container');
            const videoId = container.getAttribute('data-video-id');
            if (!videoId) return;

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.title = 'YouTube video';

            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.remove();
                container.appendChild(iframe);
            }, 300);
        });
    });
}

/* ---- Cursor Glow Effect ---- */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.matchMedia('(hover: none)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ---- Smooth Scrolling for anchor links ---- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        });
    });
}

/* ---- Parallax Background Shapes ---- */
function initParallaxShapes() {
    const shapes = document.querySelectorAll('.shape');
    if (!shapes.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                shapes.forEach((shape, i) => {
                    const speed = (i + 1) * 0.03;
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* ---- Section Parallax Elements ---- */
function initSectionParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function update() {
        const windowHeight = window.innerHeight;
        elements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0;
            const parent = el.closest('.section') || el.parentElement;
            const rect = parent.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const offset = (sectionCenter - windowHeight / 2) * speed;
            el.style.transform = `translateY(${offset}px)`;
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    update();
}
