/* ============================================================
   FRYCUISINE – Main Script
   ============================================================ */

   (function() {
    'use strict';

    // ----- DOM REFS -----
    const header = document.getElementById('mainHeader');
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const heroSlider = document.getElementById('heroSlider');
    const slides = heroSlider.querySelectorAll('.slide');
    const dotsContainer = heroSlider.querySelector('.slider-dots');
    const prevBtn = heroSlider.querySelector('.slider-arrow.prev');
    const nextBtn = heroSlider.querySelector('.slider-arrow.next');
    const newsletterForm = document.getElementById('newsletterForm');

    let currentSlide = 0;
    let slideInterval = null;
    const SLIDE_DELAY = 5000;

    // ----- HEADER SCROLL -----
    function handleHeaderScroll() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ----- MOBILE MENU -----
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('open');
        document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click (mobile)
    mainNav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // ----- SEARCH TOGGLE -----
    searchToggle.addEventListener('click', function() {
        searchBar.classList.toggle('open');
        if (searchBar.classList.contains('open')) {
            searchBar.querySelector('input').focus();
        }
    });

    // ----- HERO SLIDER -----
    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.dataset.index = i;
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.dataset.index));
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        slides.forEach(function(slide, i) {
            slide.classList.toggle('active', i === index);
        });
        dotsContainer.querySelectorAll('span').forEach(function(dot, i) {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        goToSlide(next);
    }

    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) prev = slides.length - 1;
        goToSlide(prev);
    }

    function startInterval() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, SLIDE_DELAY);
    }

    function resetInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, SLIDE_DELAY);
        }
    }

    // Event listeners for slider controls
    nextBtn.addEventListener('click', function() {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', function() {
        prevSlide();
        resetInterval();
    });

    // Pause on hover
    heroSlider.addEventListener('mouseenter', function() {
        if (slideInterval) clearInterval(slideInterval);
    });

    heroSlider.addEventListener('mouseleave', function() {
        startInterval();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        }
    });

    // Init slider
    createDots();
    startInterval();

    // ----- NEWSLETTER FORM -----
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            if (email) {
                // Simulate subscription
                const btn = this.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Subscribed! ✓';
                btn.style.background = '#2e7d32';
                setTimeout(function() {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    newsletterForm.querySelector('input[type="email"]').value = '';
                }, 2500);
            }
        });
    }

    // ----- SCROLL REVEAL (Intersection Observer) -----
    const revealElements = document.querySelectorAll('.section-title, .trending-card, .cuisine-card, .recipe-card, .guide-card, .category-item, .masonry-item, .split-content, .split-image, .newsletter-content');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Also add fade-up to children if needed
                if (entry.target.classList.contains('section-title')) {
                    // title is already animated
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Also observe individual card items inside grids for staggered effect
    document.querySelectorAll('.trending-card, .cuisine-card, .recipe-card, .guide-card, .category-item, .masonry-item').forEach(function(card, index) {
        card.style.transitionDelay = (index % 4) * 0.08 + 's';
    });

    // ----- PARALLAX EFFECT ON NEWSLETTER (subtle) -----
    const newsletterSection = document.getElementById('newsletter');
    if (newsletterSection) {
        window.addEventListener('scroll', function() {
            const rect = newsletterSection.getBoundingClientRect();
            const offset = rect.top / window.innerHeight;
            if (offset > -0.5 && offset < 1.5) {
                const bgPos = 50 + (offset * 8);
                newsletterSection.style.backgroundPosition = 'center ' + bgPos + '%';
            }
        }, { passive: true });
    }

    // ----- RIPPLE EFFECT ON BUTTONS -----
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, #newsletterForm button').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                        position: absolute;
                        top: ${y}px;
                        left: ${x}px;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.5);
                        transform: scale(0);
                        animation: rippleAnim 0.6s ease-out forwards;
                        pointer-events: none;
                    `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(function() { ripple.remove(); }, 700);
        });
    });

    // Inject ripple keyframe if not exists
    if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = `
                    @keyframes rippleAnim {
                        to { transform: scale(20); opacity: 0; }
                    }
                `;
        document.head.appendChild(style);
    }

    // ----- RESIZE HANDLER: close mobile menu on resize -----
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('open');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ----- INITIAL HEADER STATE -----
    handleHeaderScroll();

    console.log('🍽️ FryCuisine – Premium Food Blog loaded successfully.');
})();