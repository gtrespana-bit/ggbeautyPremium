document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // 1. SISTEMA DE TRADUCCIONES (Robusto)
    // ==========================================
    let translations = {};
    let currentLang = localStorage.getItem('gg_lang') || 'es';

    async function loadTranslations() {
        try {
            const res = await fetch('data/translations.json');
            if (!res.ok) throw new Error('No se pudo cargar translations.json');
            translations = await res.json();
            applyLanguage(currentLang);
        } catch (e) {
            console.warn('Error cargando traducciones:', e);
        }
    }

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('gg_lang', lang);
        document.documentElement.lang = lang;

        // Actualizar textos estáticos
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                el.innerHTML = translations[key][lang];
            }
        });

        // Sincronizar selector
        const selector = document.getElementById('languageSelect');
        if (selector) selector.value = lang;

        // Re-renderizar servicios dinámicos
        if (typeof window.renderServices === 'function') {
            window.renderServices(lang);
        }
    }

    // Exponer globalmente
    window.changeLanguage = applyLanguage;

    // Vincular evento al selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => applyLanguage(e.target.value));
    }

    // Iniciar carga
    loadTranslations();

    // ==========================================
    // 2. UI & ANIMACIONES
    // ==========================================
    const loader = document.getElementById('loader');
    const loaderPercent = document.getElementById('loaderPercent');
    if (loader && loaderPercent) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => loader.classList.add('hidden'), 400);
            }
            loaderPercent.textContent = progress + '%';
        }, 80);
    }

    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', e => {
            cursorDot.style.left = e.clientX - 2.5 + 'px';
            cursorDot.style.top = e.clientY - 2.5 + 'px';
            requestAnimationFrame(() => {
                cursor.style.left = e.clientX - 12 + 'px';
                cursor.style.top = e.clientY - 12 + 'px';
            });
        });
        document.querySelectorAll('a, button, .service-card, .gallery-item, .team-card, .testimonial-dot, .hamburger, .magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 35; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.width = p.style.height = Math.random() * 2 + 1 + 'px';
            p.style.animationDuration = Math.random() * 15 + 12 + 's';
            p.style.animationDelay = Math.random() * 15 + 's';
            p.style.opacity = Math.random() * 0.4 + 0.1;
            particlesContainer.appendChild(p);
        }
    }

    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        if (navbar) navbar.classList.toggle('scrolled', scrollY > 80);
        if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
        if (progressBar) progressBar.style.width = (scrollY / docH * 100) + '%';
    });

    window.revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => window.revealObserver.observe(el));

    let countersDone = false;
    const counterObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !countersDone) {
            countersDone = true;
            document.querySelectorAll('[data-count]').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const dur = 2000, start = performance.now();
                const animate = now => {
                    const p = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    counter.textContent = Math.floor(ease * target) + '+';
                    if (p < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            });
        }
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(c => counterObserver.observe(c));

    const tItems = document.querySelectorAll('.testimonial-item');
    const tDots = document.querySelectorAll('.testimonial-dot');
    let tCurrent = 0;
    const showT = (i) => {
        tItems.forEach(it => it.classList.remove('active'));
        tDots.forEach(d => d.classList.remove('active'));
        tItems[i].classList.add('active');
        tDots[i].classList.add('active');
        tCurrent = i;
    };
    tDots.forEach(d => d.addEventListener('click', () => showT(+d.dataset.index)));
    if (tItems.length > 0) setInterval(() => showT((tCurrent + 1) % tItems.length), 6000);

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    if (hamburger && mobileMenu && mobileClose) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }
    window.closeMobile = function() {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        el.addEventListener('mouseleave', () => el.style.transform = '');
    });

    document.addEventListener('mousemove', e => {
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs.forEach((orb, i) => {
            orb.style.transform = `translate(${x * (i + 1) * 15}px, ${y * (i + 1) * 15}px)`;
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Form handler ya no es necesario (Web3Forms maneja el submit)
    // Se mantiene por compatibilidad si se usa otro método

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `translateY(-8px) perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });

    document.addEventListener('visibilitychange', () => {
        document.title = document.hidden 
            ? '✨ GG Beauty te espera — Lanzarote' 
            : 'GG Beauty Aesthetics — Genoveva Ganeva | Tías, Lanzarote';
    });

    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.addEventListener('error', () => console.log('Video fallback activated'));
        heroVideo.play().catch(() => {});
    }
});
