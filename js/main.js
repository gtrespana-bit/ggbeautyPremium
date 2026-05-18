document.addEventListener('DOMContentLoaded', function() {
    // ========== LOADER ==========
    let loaderProgress = 0;
    const loaderPercent = document.getElementById('loaderPercent');
    const loader = document.getElementById('loader');
    const loaderTimeout = setTimeout(() => { if(loader && !loader.classList.contains('hidden')) loader.classList.add('hidden'); }, 5000);
    
    if(loaderPercent && loader) {
        const loaderInterval = setInterval(() => {
            loaderProgress += Math.floor(Math.random() * 8) + 2;
            if(loaderProgress >= 100) { loaderProgress = 100; clearInterval(loaderInterval); clearTimeout(loaderTimeout); setTimeout(() => loader.classList.add('hidden'), 500); }
            loaderPercent.textContent = loaderProgress + '%';
        }, 100);
    } else { if(loader) loader.classList.add('hidden'); clearTimeout(loaderTimeout); }

    // ========== CUSTOM CURSOR ==========
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursorDot');
    if(cursor && cursorDot) {
        document.addEventListener('mousemove', e => {
            cursorDot.style.left = e.clientX - 2.5 + 'px'; cursorDot.style.top = e.clientY - 2.5 + 'px';
            requestAnimationFrame(() => { cursor.style.left = e.clientX - 12 + 'px'; cursor.style.top = e.clientY - 12 + 'px'; });
        });
        document.querySelectorAll('a, button, .service-card, .gallery-item, .team-card, .testimonial-dot, .hamburger, .magnetic').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // ========== PARTICLES ==========
    const particlesContainer = document.getElementById('particles');
    if(particlesContainer) {
        for(let i=0; i<35; i++) {
            const p = document.createElement('div'); p.classList.add('particle');
            p.style.left = Math.random()*100+'%'; p.style.width = p.style.height = Math.random()*2+1+'px';
            p.style.animationDuration = Math.random()*15+12+'s'; p.style.animationDelay = Math.random()*15+'s'; p.style.opacity = Math.random()*0.4+0.1;
            particlesContainer.appendChild(p);
        }
    }

    // ========== NAVBAR & SCROLL ==========
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY; const docH = document.documentElement.scrollHeight - window.innerHeight;
        if(navbar) navbar.classList.toggle('scrolled', scrollY > 100);
        if(backToTop) backToTop.classList.toggle('visible', scrollY > 500);
        if(progressBar) progressBar.style.width = (scrollY/docH*100)+'%';
    });

    // ========== SCROLL REVEAL (GLOBAL) ==========
    window.revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.14, rootMargin: '0px 0px -45px 0px' });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => window.revealObserver.observe(el));

    // ========== COUNTERS ==========
    let countersDone = false;
    const counterObserver = new IntersectionObserver(entries => {
        if(entries[0].isIntersecting && !countersDone) {
            countersDone = true;
            document.querySelectorAll('[data-count]').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const dur = 2000, start = performance.now();
                function animate(now) {
                    const p = Math.min((now-start)/dur, 1); const ease = 1-Math.pow(1-p,3);
                    counter.textContent = Math.floor(ease*target)+'+';
                    if(p<1) requestAnimationFrame(animate); else counter.textContent = target+'+';
                }
                requestAnimationFrame(animate);
            });
        }
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(c => counterObserver.observe(c));

    // ========== TESTIMONIALS ==========
    const tItems = document.querySelectorAll('.testimonial-item');
    const tDots = document.querySelectorAll('.testimonial-dot');
    let tCurrent = 0;
    function showT(i) { tItems.forEach(it=>it.classList.remove('active')); tDots.forEach(d=>d.classList.remove('active')); tItems[i].classList.add('active'); tDots[i].classList.add('active'); tCurrent = i; }
    tDots.forEach(d => d.addEventListener('click', () => showT(+d.dataset.index)));
    if(tItems.length>0) setInterval(()=>showT((tCurrent+1)%tItems.length), 5500);

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    if(hamburger && mobileMenu && mobileClose) {
        hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
        mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    }
    function closeMobile() { if(mobileMenu) mobileMenu.classList.remove('open'); }

    // ========== MAGNETIC EFFECT ==========
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect(); const x = e.clientX - r.left - r.width/2; const y = e.clientY - r.top - r.height/2;
            el.style.transform = `translate(${x*0.12}px, ${y*0.12}px)`;
        });
        el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
    });

    // ========== PARALLAX ORBS ==========
    document.addEventListener('mousemove', e => {
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        const x = (e.clientX/window.innerWidth-0.5)*2; const y = (e.clientY/window.innerHeight-0.5)*2;
        orbs.forEach((orb,i) => { const s=(i+1)*14; orb.style.transform=`translate(${x*s}px, ${y*s}px)`; });
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => { e.preventDefault(); const t=document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth',block:'start'}); });
    });

    // ========== FORM ==========
    function handleSubmit(e) {
        e.preventDefault();
        const btn = e.target.querySelector('.form-submit');
        if(btn) { const orig=btn.textContent; btn.textContent='✓ SOLICITUD ENVIADA'; btn.style.background='linear-gradient(135deg,#4CAF50,#45a049)'; setTimeout(()=>{btn.textContent=orig; btn.style.background=''; e.target.reset();},3000); }
    }

    // ========== TILT SERVICE CARDS ==========
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect(); const x = (e.clientX-r.left)/r.width-0.5; const y = (e.clientY-r.top)/r.height-0.5;
            card.style.transform = `translateY(-10px) perspective(1000px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });

    // ========== PAGE TITLE ON BLUR ==========
    document.addEventListener('visibilitychange', () => { document.title = document.hidden ? '✨ GG Beauty te espera — Lanzarote' : 'GG Beauty Aesthetics — Genoveva Ganeva | Tías, Lanzarote'; });

    // ========== VIDEO FALLBACK ==========
    const heroVideo = document.querySelector('.hero-video');
    if(heroVideo) { heroVideo.addEventListener('error', ()=>console.log('Video fallback activated')); heroVideo.play().catch(()=>{}); }
});