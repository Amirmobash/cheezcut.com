/**
 * CheezCut — Lightweight static site enhancements
 * No external dependencies. Defensive, performant, accessible.
 */

(function() {
    'use strict';

    // ========================
    // 1. Mobile Navigation Toggle
    // ========================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // Create overlay for mobile menu backdrop (optional but improves UX)
        let overlay = document.querySelector('.nav-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            overlay.setAttribute('aria-hidden', 'true');
            document.body.appendChild(overlay);
        }

        const closeMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };

        const openMenu = () => {
            menuToggle.setAttribute('aria-expanded', 'true');
            navLinks.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const toggleMenu = () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            if (expanded) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close menu when a nav link is clicked (smooth navigation)
        const navAnchors = navLinks.querySelectorAll('a');
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', closeMenu);
        });

        // Handle window resize: if resizing to desktop, ensure menu is closed and styles reset
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
                    closeMenu();
                }
            }, 150);
        });
    }

    // ========================
    // 2. Sticky Header (lightweight)
    // ========================
    const header = document.querySelector('.header');
    if (header) {
        let stickyOffset = header.offsetTop;
        let isSticky = false;

        const handleSticky = () => {
            if (window.pageYOffset > stickyOffset + 10) {
                if (!isSticky) {
                    header.classList.add('header-sticky');
                    isSticky = true;
                    // Add padding to main content to prevent jump
                    const main = document.querySelector('main');
                    if (main && !main.style.paddingTop) {
                        const headerHeight = header.offsetHeight;
                        main.style.paddingTop = `${headerHeight}px`;
                    }
                }
            } else {
                if (isSticky) {
                    header.classList.remove('header-sticky');
                    isSticky = false;
                    const main = document.querySelector('main');
                    if (main) {
                        main.style.paddingTop = '';
                    }
                }
            }
        };

        // Throttled scroll handler for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleSticky();
                    ticking = false;
                });
                ticking = true;
            }
        });
        handleSticky(); // initial check
    }

    // ========================
    // 3. Reveal-on-scroll with reduced-motion support
    // ========================
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Only enable reveal animations if user hasn't requested reduced motion
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal');
        
        if (revealElements.length > 0 && 'IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Optional: unobserve after revealing to improve performance
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -20px 0px'  // Slight offset for better timing
            });
            
            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback: make all reveal elements visible immediately if no observer support
            revealElements.forEach(el => el.classList.add('visible'));
        }
    } else {
        // If reduced motion is preferred, immediately show all reveal elements
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }

    // ========================
    // 4. Active navigation highlighting (based on current URL)
    // ========================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a, .footer-links a');
    
    navLinksAll.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Normalize href to filename
            const linkPath = href.split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
                // If it's inside nav-links, also ensure parent styling if needed
                if (link.closest('.nav-links')) {
                    link.setAttribute('aria-current', 'page');
                }
            } else {
                // Remove any stale active states (ensures consistency)
                link.classList.remove('active');
                if (link.hasAttribute('aria-current')) {
                    link.removeAttribute('aria-current');
                }
            }
        }
    });

    // Special handling for root path (index.html)
    if (currentPath === '' || currentPath === '/' || currentPath === 'index.html') {
        const homeLinks = document.querySelectorAll('.nav-links a[href="index.html"], .nav-links a[href="./"], .nav-links a[href="/"]');
        homeLinks.forEach(link => {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });
    }

    // ========================
    // 5. Small gallery interaction (if gallery exists on visuals.html)
    // ========================
    // Defensive: only if gallery thumbnails are present
    const galleryThumbs = document.querySelectorAll('.gallery-thumb, .visual-thumb, [data-gallery-thumb]');
    const galleryMain = document.querySelector('.gallery-main img, .visual-main-img');
    
    if (galleryThumbs.length > 0 && galleryMain) {
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', function(e) {
                e.preventDefault();
                const largeSrc = this.getAttribute('data-large') || this.getAttribute('src');
                if (largeSrc && galleryMain) {
                    galleryMain.src = largeSrc;
                    galleryMain.alt = this.getAttribute('alt') || 'CheezCut visual';
                    // Update active class on thumbnails
                    galleryThumbs.forEach(t => t.classList.remove('active-thumb'));
                    this.classList.add('active-thumb');
                }
            });
        });
    }

    // ========================
    // 6. Smooth scroll for anchor links (optional but improves UX)
    // ========================
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header ? header.offsetHeight : 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping (optional)
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ========================
    // 7. Add ARIA and minor accessibility enhancements
    // ========================
    // Ensure all images have meaningful alt (fallback if missing)
    document.querySelectorAll('img:not([alt])').forEach(img => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'CheezCut visual content');
        }
    });
    
    // Add role and ARIA for skip link if exists
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
                setTimeout(() => mainContent.removeAttribute('tabindex'), 500);
            }
        });
    }
    
    // ========================
    // 8. Lazy load images if they have loading="lazy" attribute (native)
    // ========================
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        // Native lazy loading is supported — no extra work needed.
        // But we can add a small fallback for older browsers? Not needed.
    } else {
        // Very lightweight fallback for older browsers: load images in viewport
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (lazyImages.length && 'IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        lazyObserver.unobserve(img);
                    }
                });
            });
            lazyImages.forEach(img => lazyObserver.observe(img));
        }
    }

    // ========================
    // 9. Small console grace note (optional, no impact)
    // ========================
    // For debugging but not intrusive — only in dev mode? We keep silent.
    // Ensure that no errors propagate
    window.addEventListener('error', (e) => {
        // Silently fail only for missing elements; we don't want to break UX
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });
})();
