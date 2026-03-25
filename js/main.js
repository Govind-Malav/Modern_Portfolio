/**
 * main.js
 * Initialises: GSAP + ScrollTrigger, Typed.js, custom cursor, scroll
 * progress bar, mobile menu, skill-bar animations, reveal animations,
 * contact form handler, and smooth scroll.
 *
 * Loaded as a regular <script src="js/main.js"> (deferred).
 */

// ── GSAP + ScrollTrigger ──────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Typed.js – Hero Typing Effect ─────────────────────────────────────────────
const typed = new Typed('#typing-text', {
    strings: [
        'Full Stack Developer',
        'MERN Stack Specialist',
        'Problem Solver',
        'CS Engineering Student'
    ],
    typeSpeed:  50,
    backSpeed:  30,
    backDelay:  2000,
    loop:       true
});

// ── Custom Cursor ─────────────────────────────────────────────────────────────
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const hoverables    = document.querySelectorAll('.hoverable');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.transform = `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)`;

    cursorOutline.animate(
        { transform: `translate3d(calc(${posX}px - 50%), calc(${posY}px - 50%), 0)` },
        { duration: 500, fill: 'forwards' }
    );
});

hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
});

// ── Magnetic Buttons (Premium UI Effect) ─────────────────────────────────────
const magneticElements = document.querySelectorAll('.hoverable.group, .magnetic, a[href="#contact"], .service-card, .achievement-card, .tech-icon');

magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(elem, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.5,
            ease: "power2.out",
        });
    });

    elem.addEventListener('mouseleave', () => {
        gsap.to(elem, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)",
        });
    });
});

// ── Scroll: Progress Bar, Back-to-Top, Navbar ────────────────────────────────
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollTop      = window.scrollY;
            const docHeight      = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent  = (scrollTop / docHeight) * 100;

            // Progress bar
            const scrollProgress = document.getElementById('scrollProgress');
            if (scrollProgress) scrollProgress.style.width = scrollPercent + '%';

            // Back-to-top button
            const backToTop = document.getElementById('backToTop');
            if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);

            // Navbar glass effect
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.classList.toggle('glass-strong', scrollTop > 50);

            isScrolling = false;
        });
        isScrolling = true;
    }
});

// ── Mobile Menu ───────────────────────────────────────────────────────────────
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

// Expose to global scope so inline onclick="toggleMenu()" on the button works
window.toggleMenu = toggleMenu;

// ── Skill Bars – Animate on Scroll ───────────────────────────────────────────
document.querySelectorAll('.skill-bar').forEach(bar => {
    const width = bar.getAttribute('data-width');

    ScrollTrigger.create({
        trigger:  bar,
        start:    'top 85%',
        onEnter:  () => { bar.style.width = width; }
    });
});

// ── Reveal Animations (fade + slide up) ──────────────────────────────────────
document.querySelectorAll('.reveal-up').forEach((element, index) => {
    gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        {
            scrollTrigger: {
                trigger:       element,
                start:         'top 85%',
                toggleActions: 'play none none reverse'
            },
            y:        0,
            opacity:  1,
            duration: 0.6,
            delay:    index * 0.1,
            ease:     'power3.out'
        }
    );
});

// ── Contact Form ──────────────────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const btn          = e.target.querySelector('button');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.classList.remove('from-primary', 'to-secondary');
    btn.classList.add('bg-green-500');

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.add('from-primary', 'to-secondary');
        btn.classList.remove('bg-green-500');
        e.target.reset();
    }, 3000);
});

// ── Smooth Scroll for Anchor Links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.getElementById('mobileMenu').classList.add('hidden');
        }
    });
});
