document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });

    // Scroll reveal animations
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    fadeEls.forEach(el => observer.observe(el));

    // Hero particles with varied colors
    const particlesContainer = document.getElementById('particles');
    const particleCount = 45;
    const colors = [
        'rgba(0, 200, 255, 0.5)',
        'rgba(120, 0, 255, 0.45)',
        'rgba(255, 50, 100, 0.4)',
        'rgba(0, 255, 170, 0.35)',
        'rgba(251, 191, 36, 0.35)',
        'rgba(99, 102, 241, 0.45)',
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 4 + 1;
        particle.style.width = particle.style.height = size + 'px';
        particle.style.animationDuration = (Math.random() * 18 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 12) + 's';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        if (size > 3) particle.style.filter = 'blur(1px)';
        particlesContainer.appendChild(particle);
    }

    // Contact form (demo)
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.form-btn');
        btn.textContent = 'Sent!';
        btn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.style.background = '';
            form.reset();
        }, 2500);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
});
