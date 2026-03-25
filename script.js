document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    // ===================== Navbar =====================
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

    // ===================== Mobile Nav =====================
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

    // ===================== Scroll Reveal =====================
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

    // ===================== Interactive Canvas Particle Network =====================
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let mouse = { x: -1000, y: -1000 };
    let particles = [];
    const CONNECT_DIST = 150;
    const MOUSE_RADIUS = 200;
    const PARTICLE_COUNT = 80;
    const palette = [
        [0, 200, 255],
        [120, 80, 255],
        [255, 60, 100],
        [0, 230, 170],
        [251, 191, 36],
        [99, 102, 241],
    ];

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.color = palette[Math.floor(Math.random() * palette.length)];
            this.baseAlpha = Math.random() * 0.5 + 0.3;
            this.alpha = this.baseAlpha;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.vx += dx * force * 0.003;
                this.vy += dy * force * 0.003;
                this.alpha = this.baseAlpha + force * 0.5;
                this.radius = Math.min(this.radius + force * 0.3, 4);
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 2) {
                this.vx *= 0.98;
                this.vy *= 0.98;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const opacity = (1 - dist / CONNECT_DIST) * 0.25;
                    const midX = (particles[i].x + particles[j].x) / 2;
                    const midY = (particles[i].y + particles[j].y) / 2;
                    const mouseDist = Math.sqrt(
                        (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
                    );
                    const boost = mouseDist < MOUSE_RADIUS ? 0.3 : 0;

                    const c1 = particles[i].color;
                    const c2 = particles[j].color;
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `rgba(${c1[0]},${c1[1]},${c1[2]},${opacity + boost})`);
                    gradient.addColorStop(1, `rgba(${c2[0]},${c2[1]},${c2[2]},${opacity + boost})`);

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = (1 - dist / CONNECT_DIST) * 1.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // ===================== Global Mouse Spotlight =====================
    const spotlight = document.getElementById('mouseSpotlight');
    let spotX = 0, spotY = 0, currentX = 0, currentY = 0;

    document.addEventListener('mousemove', e => {
        spotX = e.clientX;
        spotY = e.clientY;
    });

    function updateSpotlight() {
        currentX += (spotX - currentX) * 0.08;
        currentY += (spotY - currentY) * 0.08;
        spotlight.style.left = currentX + 'px';
        spotlight.style.top = currentY + 'px';
        requestAnimationFrame(updateSpotlight);
    }
    updateSpotlight();

    // ===================== 3D Card Tilt =====================
    const tiltCards = document.querySelectorAll('.about-card, .service-card, .region-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            const glowX = (x / rect.width) * 100;
            const glowY = (y / rect.height) * 100;
            card.style.setProperty('--glow-x', glowX + '%');
            card.style.setProperty('--glow-y', glowY + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });

    // ===================== Ripple Effect on Buttons =====================
    document.querySelectorAll('.hero-btn, .cta-btn, .form-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('btn-ripple');
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ===================== Parallax Floating Elements =====================
    let scrollY = 0;
    const parallaxSections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    function updateParallax() {
        parallaxSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const shift = (progress - 0.5) * 30;
                section.style.setProperty('--parallax-y', shift + 'px');
            }
        });
        requestAnimationFrame(updateParallax);
    }
    updateParallax();

    // ===================== Animated Counter for Service Numbers =====================
    const serviceNumbers = document.querySelectorAll('.service-number');
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('counted');
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    serviceNumbers.forEach(el => counterObserver.observe(el));

    // ===================== Contact Form =====================
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

    // ===================== Smooth Scroll =====================
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
