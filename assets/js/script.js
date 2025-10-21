    // Compute dynamic header height and expose as CSS var --header-offset
    function updateHeaderOffset() {
        try {
            const header = document.querySelector('.header');
            if (!header) return;
            const h = Math.ceil(header.getBoundingClientRect().height);
            document.documentElement.style.setProperty('--header-offset', `${h}px`);
        } catch (_) { /* ignore */ }
    }

    // Initial and on resize (debounced)
    updateHeaderOffset();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateHeaderOffset, 120);
    });
// Hero Image Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Auto-rotate slides every 5 seconds
setInterval(nextSlide, 5000);

// Add click event listeners to indicators
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animationDelay = `${index * 0.1}s`;
                            card.classList.add('slide-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Header background on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.5)';
            header.style.borderBottom = '1px solid #3D3D3D';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.85)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
            header.style.borderBottom = '1px solid #3D3D3D';
        }
    });

    // Interactive background effect
    document.querySelectorAll('.interactive-bg').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            element.style.setProperty('--mouse-x', `${x}%`);
            element.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Service card click effect
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(76, 175, 80, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Contact item hover effects
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    let heroTypingTimers = [];
    function clearHeroTyping() {
        heroTypingTimers.forEach(t => clearTimeout(t));
        heroTypingTimers = [];
    }
    function startHeroTyping(delay = 600) {
        const titleEl = document.querySelector('.hero h1');
        if (!titleEl) return;
        clearHeroTyping();

        const isUrdu = document.documentElement.getAttribute('lang') === 'ur';
        const primary = titleEl.getAttribute(isUrdu ? 'data-i18n-ur' : 'data-i18n-en') || titleEl.textContent;
        const alternate = titleEl.getAttribute(isUrdu ? 'data-i18n-ur-alt' : 'data-i18n-en-alt');
        const phrases = alternate ? [primary, alternate] : [primary];

        let phraseIndex = 0;
        function typePhrase(text, onDone) {
            titleEl.textContent = '';
            let i = 0;
            function step() {
                if (i < text.length) {
                    titleEl.textContent += text.charAt(i++);
                    heroTypingTimers.push(setTimeout(step, 70));
                } else if (onDone) {
                    heroTypingTimers.push(setTimeout(onDone, 1200));
                }
            }
            heroTypingTimers.push(setTimeout(step, delay));
        }
        function erasePhrase(onDone) {
            const text = titleEl.textContent;
            let i = text.length;
            function step() {
                if (i > 0) {
                    titleEl.textContent = text.slice(0, --i);
                    heroTypingTimers.push(setTimeout(step, 35));
                } else if (onDone) {
                    onDone();
                }
            }
            heroTypingTimers.push(setTimeout(step, 400));
        }
        function loop() {
            const text = phrases[phraseIndex % phrases.length];
            typePhrase(text, () => erasePhrase(() => {
                phraseIndex++;
                delay = 200;
                loop();
            }));
        }
        loop();
    }

    // Parallax effect for background images
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            // Recalculate header height when menu expands/collapses
            setTimeout(updateHeaderOffset, 50);
        });
    }

    // Emergency banner pulse effect
    const emergencyBanner = document.querySelector('.emergency-banner');
    if (emergencyBanner) {
        setInterval(() => {
            emergencyBanner.style.transform = 'scale(1.02)';
            setTimeout(() => {
                emergencyBanner.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }

    // Doctor card interactive effect
    const doctorCard = document.querySelector('.doctor-card');
    if (doctorCard) {
        doctorCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        doctorCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
        });
    }

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        updateHeaderOffset();
        
        // Animate elements on load
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            });
        }, 500);

        // One-time celebration confetti on first load
        try {
            const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const alreadyCelebrated = sessionStorage.getItem('site_celebrated') === '1';
            if (!prefersReduced && !alreadyCelebrated) {
                sessionStorage.setItem('site_celebrated', '1');
                launchConfetti(4000);
            }
        } catch (_) { /* ignore */ }
    });

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(90deg, #D73D80, #FC75AF)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.3s ease';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Language switcher: EN / UR
    const rootEl = document.documentElement;
    const langButtons = document.querySelectorAll('.lang-btn');

    function applyLanguage(lang) {
        const i18nNodes = document.querySelectorAll('[data-i18n-en]');
        i18nNodes.forEach(node => {
            const text = node.getAttribute(lang === 'ur' ? 'data-i18n-ur' : 'data-i18n-en');
            if (typeof text === 'string' && text.length) {
                node.textContent = text;
            }
        });

        // Direction and lang on <html>
        rootEl.setAttribute('lang', lang === 'ur' ? 'ur' : 'en');
        rootEl.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
        document.body.classList.toggle('rtl', lang === 'ur');

        // Toggle button states
        langButtons.forEach(btn => {
            const isActive = btn.getAttribute('data-lang') === lang;
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            btn.classList.toggle('active', isActive);
        });
    }

    function setLanguage(lang) {
        // persist in new versioned key to avoid old cached preferences
        localStorage.setItem('site_lang_v2', lang);
        // keep old key in sync for safety
        localStorage.setItem('site_lang', lang);
        applyLanguage(lang);
        // Restart typing effect for the new language
        startHeroTyping(200);
        // Language changes can alter header height due to text width
        setTimeout(updateHeaderOffset, 50);
    }

    // Init language with migration: new key defaults to Urdu
    let savedLang = localStorage.getItem('site_lang_v2');
    if (!savedLang) {
        const old = localStorage.getItem('site_lang');
        if (old === 'ur') {
            localStorage.setItem('site_lang_v2', 'ur');
            savedLang = 'ur';
        } else {
            // Force-persist Urdu as the brand default for first-time visitors
            localStorage.setItem('site_lang_v2', 'ur');
            localStorage.setItem('site_lang', 'ur');
            savedLang = 'ur';
        }
    }
    const initialLang = savedLang || 'ur';
    applyLanguage(initialLang);
    // Start typing after language has been applied
    startHeroTyping(600);

    // Bind header buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang') === 'ur' ? 'ur' : 'en';
            setLanguage(lang);
        });
    });

    // Simple website view counter (CountAPI) with robust fallbacks
    (function() {
        const el = document.getElementById('viewCount');
        if (!el) return;

        const NAMESPACE = 'alhayathealthcare.site'; // ensure uniqueness
        const KEY = 'site_views_v1';                // bump to reset remotely

        const getUrl = `https://api.countapi.xyz/get/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;
        const hitUrl = `https://api.countapi.xyz/hit/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(KEY)}`;

        function setNumber(n) {
            el.textContent = Number(n).toLocaleString();
        }

        function localFallback(increment) {
            try {
                const k = 'local_view_count_v1';
                let v = parseInt(localStorage.getItem(k) || '0', 10);
                if (increment) v += 1;
                localStorage.setItem(k, String(v));
                setNumber(v);
            } catch (_) {
                // last resort
                setNumber('0');
            }
        }

        function fetchJSON(url) {
            return fetch(url, { cache: 'no-store' }).then(r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            });
        }

        const alreadyCounted = sessionStorage.getItem('site_viewed') === '1';

        if (alreadyCounted) {
            // Just read current value
            fetchJSON(getUrl)
                .then(d => setNumber(d && d.value))
                .catch(err => {
                    console.warn('CountAPI get failed:', err);
                    localFallback(false);
                });
            return;
        }

        // Try to hit (increment), then fall back to get, then local fallback
        fetchJSON(hitUrl)
            .then(d => {
                setNumber(d && d.value);
                sessionStorage.setItem('site_viewed', '1');
            })
            .catch(err => {
                console.warn('CountAPI hit failed, falling back to get:', err);
                fetchJSON(getUrl)
                    .then(d => setNumber(d && d.value))
                    .catch(err2 => {
                        console.warn('CountAPI get failed, using local fallback:', err2);
                        localFallback(true);
                    });
            });
    })();
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slide-in-up {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .slide-in-up {
        animation: slide-in-up 0.6s ease-out forwards;
    }
    
    body.loaded {
        overflow-x: hidden;
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #1C222A;
        box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        padding: 1rem;
        border-radius: 0 0 12px 12px;
    }
    
    .mobile-menu-toggle.active {
        transform: rotate(90deg);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex;
        }
    }
`;
document.head.appendChild(style);

// Lightweight canvas confetti
function launchConfetti(durationMs = 4000) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '9998';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);

    const colors = ['#D73D80', '#FC75AF', '#25D366', '#1877F2', '#F58529', '#DD2A7B', '#ffffff'];
    const count = Math.min(220, Math.floor(W / 6));
    const gravity = 0.25;
    const drag = 0.003;
    const terminal = 6;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const confetti = Array.from({ length: count }).map(() => ({
        x: rand(0, W), y: rand(-H, 0), w: rand(6, 12), h: rand(8, 18),
        color: colors[(Math.random() * colors.length) | 0],
        tilt: rand(-0.5, 0.5), angle: rand(0, Math.PI * 2),
        vx: rand(-2, 2), vy: rand(1, 3), rot: rand(-0.08, 0.08)
    }));

    const start = performance.now();
    let rafId;
    function frame(ts) {
        const elapsed = ts - start;
        ctx.clearRect(0, 0, W, H);
        confetti.forEach(p => {
            p.vy = Math.min(p.vy + gravity, terminal);
            p.vx += (Math.random() - 0.5) * 0.15;
            p.x += p.vx * (1 - drag);
            p.y += p.vy * (1 - drag);
            p.angle += p.rot;
            p.tilt += Math.sin(p.angle) * 0.2;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.9;
            ctx.fillRect(-p.w / 2 + p.tilt, -p.h / 2, p.w, p.h);
            ctx.restore();

            // recycle when out of view
            if (p.y - 20 > H) { p.y = -10; p.x = rand(0, W); p.vy = rand(1, 3); p.vx = rand(-2, 2); }
        });

        if (elapsed < durationMs) {
            rafId = requestAnimationFrame(frame);
        } else {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', onResize);
            canvas.remove();
        }
    }
    rafId = requestAnimationFrame(frame);
}
