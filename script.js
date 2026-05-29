/* ==========================================================================
   Soleil Premium French Bistro - JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const body = document.body;
    const preloader = document.getElementById('preloader');
    const scrollProgress = document.getElementById('scroll-progress');
    const customCursor = document.getElementById('custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const backToTopBtn = document.getElementById('back-to-top');

    // Elementos de la Navbar
    const navbar = document.getElementById('navbar');
    const hamburgerToggle = document.querySelector('.hamburger-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section, header[id]');

    // Elementos del Hero
    const heroContent = document.querySelector('.hero-content');
    const botanicalTopRight = document.querySelector('.botanical-top-right');
    const botanicalBottomLeft = document.querySelector('.botanical-bottom-left');

    // Inicializar estado de carga
    body.classList.add('preloader-active');

    /* ━━━ PRELOADER LOGIC ━━━ */
    setTimeout(() => {
        // Fase 1: Desvanecer el preloader
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 1200);

    setTimeout(() => {
        // Fase 2: Ocultar y activar página
        if (preloader) {
            preloader.style.display = 'none';
        }
        body.classList.remove('preloader-active');
        body.classList.add('page-ready');
        
        // Activar animación de revelado de texto para el Hero después de ocultar el preloader
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.classList.add('heading-visible');
        }
    }, 1600);


    /* ━━━ NAVBAR, SCROLL PROGRESS BAR & BACK TO TOP & PARALLAX ━━━ */
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;
    let ticking = false;

    // Throttle helper to limit execution frequency of scroll events (16ms throttle)
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    const handleScroll = () => {
        const scrollTop = lastScrollY;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // 1. Estado de la Navbar (Scrolled)
        if (navbar) {
            if (scrollTop > 80) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }

        // 2. Scroll Spy: Detectar sección activa
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // offset para activar antes
            const sectionHeight = section.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // 3. Actualizar barra de progreso de scroll
        if (scrollHeight > 0) {
            const progress = (scrollTop / scrollHeight) * 100;
            if (scrollProgress) {
                scrollProgress.style.width = `${progress}%`;
            }
        } else if (scrollProgress) {
            scrollProgress.style.width = '0%';
        }

        // 4. Mostrar/Ocultar botón Back to Top
        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // 5. Parallax y Desvanecimiento del Hero (dinámico según ancho de pantalla)
        const windowWidth = window.innerWidth;
        let parallaxFactor = 1.0;
        if (windowWidth <= 600) {
            parallaxFactor = 0;
        } else if (windowWidth <= 900) {
            parallaxFactor = 0.5;
        }

        const heroBgRadial = document.querySelector('.hero-bg-radial');
        const heroBgNoise = document.querySelector('.hero-bg-noise');
        const heroOverlay = document.querySelector('.hero-overlay');

        if (parallaxFactor > 0) {
            if (scrollTop <= window.innerHeight) {
                const bgShift = scrollTop * 0.4 * parallaxFactor;
                if (heroBgRadial) {
                    heroBgRadial.style.willChange = 'transform';
                    heroBgRadial.style.transform = `translate3d(0, ${bgShift}px, 0)`;
                }
                if (heroBgNoise) {
                    heroBgNoise.style.willChange = 'transform';
                    heroBgNoise.style.transform = `translate3d(0, ${bgShift}px, 0)`;
                }
                if (heroOverlay) {
                    heroOverlay.style.willChange = 'transform';
                    heroOverlay.style.transform = `translate3d(0, ${bgShift}px, 0)`;
                }

                const botanicalShift = scrollTop * 0.15 * parallaxFactor;
                const opacity = Math.max(0, 0.15 - (scrollTop / window.innerHeight) * 0.15);
                
                if (botanicalTopRight) {
                    botanicalTopRight.style.willChange = 'transform, opacity';
                    botanicalTopRight.style.transform = `translate3d(0, ${botanicalShift}px, 0)`;
                    botanicalTopRight.style.opacity = opacity;
                }
                if (botanicalBottomLeft) {
                    botanicalBottomLeft.style.willChange = 'transform, opacity';
                    botanicalBottomLeft.style.transform = `translate3d(0, ${botanicalShift}px, 0) scale(-1, 1) rotate(180deg)`;
                    botanicalBottomLeft.style.opacity = opacity;
                }
                
                const heroContentOpacity = Math.max(0, 1 - (scrollTop / (window.innerHeight * 0.75)));
                if (heroContent) {
                    heroContent.style.willChange = 'transform, opacity';
                    heroContent.style.transform = `translate3d(0, ${scrollTop * 0.15 * parallaxFactor}px, 0)`;
                    heroContent.style.opacity = heroContentOpacity;
                }
            } else {
                if (heroBgRadial) heroBgRadial.style.willChange = '';
                if (heroBgNoise) heroBgNoise.style.willChange = '';
                if (heroOverlay) heroOverlay.style.willChange = '';
                if (heroContent) {
                    heroContent.style.willChange = '';
                    heroContent.style.opacity = '0';
                }
                if (botanicalTopRight) {
                    botanicalTopRight.style.willChange = '';
                    botanicalTopRight.style.opacity = '0';
                }
                if (botanicalBottomLeft) {
                    botanicalBottomLeft.style.willChange = '';
                    botanicalBottomLeft.style.opacity = '0';
                }
            }
        } else {
            // Limpiar estilos si está desactivado (móviles)
            if (heroBgRadial) {
                heroBgRadial.style.transform = '';
                heroBgRadial.style.willChange = '';
            }
            if (heroBgNoise) {
                heroBgNoise.style.transform = '';
                heroBgNoise.style.willChange = '';
            }
            if (heroOverlay) {
                heroOverlay.style.transform = '';
                heroOverlay.style.willChange = '';
            }
            if (botanicalTopRight) {
                botanicalTopRight.style.transform = '';
                botanicalTopRight.style.opacity = '';
                botanicalTopRight.style.willChange = '';
            }
            if (botanicalBottomLeft) {
                botanicalBottomLeft.style.transform = '';
                botanicalBottomLeft.style.opacity = '';
                botanicalBottomLeft.style.willChange = '';
            }
            if (heroContent) {
                heroContent.style.transform = '';
                heroContent.style.opacity = '';
                heroContent.style.willChange = '';
            }
        }

        // 6. Paralaje en la Sección del Chef y Galería (desactivados para evitar parpadeos)
        // Las imágenes ahora permanecen estáticas.
        
        ticking = false;
    };

    const onScroll = () => {
        lastScrollY = window.scrollY || document.documentElement.scrollTop;
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    };

    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ━━━ MOBILE OVERLAY NAVIGATION ━━━ */
    const openMobileMenu = () => {
        if (navbar) navbar.classList.add('menu-open');
        if (mobileOverlay) {
            mobileOverlay.classList.add('menu-open');
            mobileOverlay.setAttribute('aria-hidden', 'false');
        }
        if (hamburgerToggle) hamburgerToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden';
        body.style.touchAction = 'none';
    };

    const closeMobileMenu = () => {
        if (navbar) navbar.classList.remove('menu-open');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('menu-open');
            mobileOverlay.setAttribute('aria-hidden', 'true');
        }
        if (hamburgerToggle) hamburgerToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        body.style.touchAction = '';
    };

    const toggleMobileMenu = () => {
        const isOpen = navbar && navbar.classList.contains('menu-open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };

    if (hamburgerToggle) {
        hamburgerToggle.addEventListener('click', toggleMobileMenu);
    }

    // ━━━ SMOOTH SCROLL WITH NAVBAR OFFSET ━━━
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();

                const isMobileMenuOpen = navbar && navbar.classList.contains('menu-open');
                
                // Si el menú móvil está abierto, cerrarlo primero
                if (isMobileMenuOpen) {
                    closeMobileMenu();
                }

                // Esperar a que comience la animación de cierre en móvil si es necesario
                setTimeout(() => {
                    // Calcular altura de la navbar (dinámica según estado)
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, isMobileMenuOpen ? 300 : 0);
            }
        });
    });


    /* ━━━ CUSTOM CURSOR WITH LERP ━━━ */
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isMoving = false;
    let cursorVisible = false;

    // Detectar si el dispositivo es táctil
    const isTouchDevice = () => {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    };

    const updateCustomCursorStatus = () => {
        if (!customCursor) return;
        if (!isTouchDevice() && window.innerWidth > 900) {
            body.classList.add('custom-cursor-active');
            customCursor.style.display = '';
        } else {
            body.classList.remove('custom-cursor-active');
            customCursor.style.display = 'none';
        }
    };

    updateCustomCursorStatus();

    if (customCursor) {
        // Inicializar event listeners del cursor, pero solo procesar movimientos y hovers si debe estar activo
        const updateCursorPosition = (e) => {
            if (isTouchDevice() || window.innerWidth <= 900) return;
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Mostrar el cursor al primer movimiento del mouse
            if (!cursorVisible) {
                customCursor.style.opacity = '1';
                cursorVisible = true;
            }

            // El cursor-dot sigue inmediatamente al mouse
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        };

        window.addEventListener('mousemove', updateCursorPosition, { passive: true });

        // Interpolación (Lerp) para el cursor-ring
        const lerp = (start, end, amt) => {
            return (1 - amt) * start + amt * end;
        };

        const renderCursor = () => {
            if (!(isTouchDevice() || window.innerWidth <= 900)) {
                // Factor de suavizado (lerp): entre menos sea, más retardo tendrá el anillo
                const lerpFactor = 0.15;
                ringX = lerp(ringX, mouseX, lerpFactor);
                ringY = lerp(ringY, mouseY, lerpFactor);

                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
            }
            requestAnimationFrame(renderCursor);
        };

        // Iniciar el ciclo de renderizado del cursor
        requestAnimationFrame(renderCursor);

        // Ocultar/Mostrar cursor al salir/entrar al documento y limpiar estados
        document.addEventListener('mouseleave', () => {
            if (isTouchDevice() || window.innerWidth <= 900) return;
            customCursor.style.opacity = '0';
            cursorVisible = false;
            cursorRing.classList.remove('hover-interactive', 'hover-image');
        });

        document.addEventListener('mouseenter', () => {
            if (isTouchDevice() || window.innerWidth <= 900) return;
            customCursor.style.opacity = '1';
            cursorVisible = true;
        });

        // ━━━ CURSOR INTERACTIONS (HOVER STATES) ━━━
        document.addEventListener('mouseover', (e) => {
            if (isTouchDevice() || window.innerWidth <= 900) return;
            const target = e.target;
            if (!target) return;

            const interactive = target.closest('a, button, .service-card, [role="button"]');
            const img = target.closest('img, .image-hover-target');

            if (interactive) {
                cursorRing.classList.add('hover-interactive');
            } else {
                cursorRing.classList.remove('hover-interactive');
            }

            if (img) {
                cursorRing.classList.add('hover-image');
            } else {
                cursorRing.classList.remove('hover-image');
            }
        });
    }

    // ━━━ SPLIT TEXT REVEAL ━━━
    const splitNode = (node, charCounter) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) return;
            
            const fragment = document.createDocumentFragment();
            const words = text.split(/(\s+)/);
            
            words.forEach(word => {
                if (word.trim() === '') {
                    fragment.appendChild(document.createTextNode(word));
                } else {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'word';
                    wordSpan.setAttribute('aria-hidden', 'true');
                    wordSpan.style.display = 'inline-block';
                    
                    const chars = word.split('');
                    chars.forEach(char => {
                        const charSpan = document.createElement('span');
                        charSpan.className = 'char';
                        charSpan.setAttribute('aria-hidden', 'true');
                        charSpan.textContent = char;
                        charSpan.style.display = 'inline-block';
                        charSpan.style.transitionDelay = `${charCounter.count * 20}ms`;
                        charCounter.count++;
                        
                        wordSpan.appendChild(charSpan);
                    });
                    
                    fragment.appendChild(wordSpan);
                }
            });
            
            node.parentNode.replaceChild(fragment, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'br') return;
            
            const children = Array.from(node.childNodes);
            children.forEach(child => splitNode(child, charCounter));
        }
    };

    const initSplitText = () => {
        const headings = document.querySelectorAll('h1, h2');
        headings.forEach(heading => {
            const rawText = heading.textContent.trim().replace(/\s+/g, ' ');
            heading.setAttribute('aria-label', rawText);
            
            const charCounter = { count: 0 };
            const children = Array.from(heading.childNodes);
            children.forEach(child => splitNode(child, charCounter));
        });
    };

    initSplitText();

    // ━━━ INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ━━━
    const setupScrollAnimations = () => {
        const triggers = document.querySelectorAll('.scroll-trigger-left, .scroll-trigger-right, .scroll-trigger-up');
        
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                threshold: 0.05, // Menor umbral para activación más rápida en móviles
                rootMargin: '0px 0px -20px 0px'
            };

            const triggerObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            triggers.forEach(trigger => triggerObserver.observe(trigger));

            const sectionObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const sectionsToObserve = document.querySelectorAll('section:not(#hero), footer');
            sectionsToObserve.forEach(section => sectionObserver.observe(section));

            const headingObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('heading-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const headings = document.querySelectorAll('h2');
            headings.forEach(h => headingObserver.observe(h));

        } else {
            triggers.forEach(trigger => trigger.classList.add('animated'));
            document.querySelectorAll('section, footer').forEach(section => section.classList.add('section-visible'));
            document.querySelectorAll('h1, h2').forEach(h => h.classList.add('heading-visible'));
        }
    };
    
    setupScrollAnimations();

    // ━━━ MAGNETIC BUTTONS ━━━
    const initMagneticButtons = () => {
        const buttons = document.querySelectorAll('.btn');
        
        window.addEventListener('mousemove', (e) => {
            buttons.forEach(btn => {
                if (window.innerWidth <= 900 || isTouchDevice()) {
                    btn.style.transform = '';
                    btn.style.transition = '';
                    btn.dataset.isMagnetized = 'false';
                    return;
                }

                const rect = btn.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;
                
                const dx = e.clientX - btnCenterX;
                const dy = e.clientY - btnCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    btn.dataset.isMagnetized = 'true';
                    btn.style.transition = 'none';
                    
                    const strength = (100 - distance) / 100;
                    const angle = Math.atan2(dy, dx);
                    const targetX = Math.cos(angle) * strength * 12;
                    const targetY = Math.sin(angle) * strength * 12;
                    
                    btn.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
                } else if (btn.dataset.isMagnetized === 'true') {
                    btn.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    btn.style.transform = 'translate3d(0, 0, 0)';
                    btn.dataset.isMagnetized = 'false';
                    
                    setTimeout(() => {
                        if (btn.dataset.isMagnetized !== 'true') {
                            btn.style.transition = '';
                        }
                    }, 600);
                }
            });
        });

        document.addEventListener('mouseleave', () => {
            buttons.forEach(btn => {
                if (btn.dataset.isMagnetized === 'true') {
                    btn.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    btn.style.transform = 'translate3d(0, 0, 0)';
                    btn.dataset.isMagnetized = 'false';
                    setTimeout(() => {
                        btn.style.transition = '';
                    }, 600);
                }
            });
        });
    };
    
    // initMagneticButtons();

    // ━━━ IMAGE HOVER TILT & GLARE EFFECT ━━━
    const initTiltEffect = () => {
        const cards = document.querySelectorAll('.menu-card, .event-card, .gallery-item');
        
        cards.forEach(card => {
            let shine = card.querySelector('.shine-overlay');
            if (!shine) {
                shine = document.createElement('div');
                shine.className = 'shine-overlay';
                card.appendChild(shine);
            }
            
            card.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 900 || isTouchDevice()) return;
                
                card.dataset.isHovered = 'true';
                
                const rect = card.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                
                const x = e.clientX - rect.left - width / 2;
                const y = e.clientY - rect.top - height / 2;
                
                const rx = -(y / (height / 2)) * 8;
                const ry = (x / (width / 2)) * 8;
                
                card.style.transition = 'none';
                card.dataset.tiltX = rx;
                card.dataset.tiltY = ry;
                
                const parallaxY = parseFloat(card.dataset.parallaxY) || 0;
                if (card.classList.contains('gallery-item')) {
                    card.style.transform = `translate3d(0, ${parallaxY}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
                } else {
                    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
                }
                
                const shineX = e.clientX - rect.left;
                const shineY = e.clientY - rect.top;
                shine.style.background = `radial-gradient(circle at ${shineX}px ${shineY}px, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 60%)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.dataset.isHovered = 'false';
                card.dataset.tiltX = '0';
                card.dataset.tiltY = '0';
                
                card.style.transition = 'transform 0.5s ease';
                
                const parallaxY = parseFloat(card.dataset.parallaxY) || 0;
                if (card.classList.contains('gallery-item')) {
                    card.style.transform = `translate3d(0, ${parallaxY}px, 0)`;
                } else {
                    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                }
            });
        });
    };
    
    // initTiltEffect();

    // Resize handler to clean up styles and adjust cursor state
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCustomCursorStatus();
            
            const heroBgRadial = document.querySelector('.hero-bg-radial');
            const heroBgNoise = document.querySelector('.hero-bg-noise');
            const heroOverlay = document.querySelector('.hero-overlay');
            const heroContent = document.querySelector('.hero-content');
            if (window.innerWidth <= 600) {
                [heroBgRadial, heroBgNoise, heroOverlay, heroContent].forEach(el => {
                    if (el) {
                        el.style.transform = '';
                        el.style.willChange = '';
                    }
                });
            }
            
            if (window.innerWidth <= 900 || isTouchDevice()) {
                // Limpiar botones magnéticos
                const buttons = document.querySelectorAll('.btn');
                buttons.forEach(btn => {
                    btn.style.transform = '';
                    btn.style.transition = '';
                    btn.dataset.isMagnetized = 'false';
                });
                
                // Limpiar efectos tilt
                const cards = document.querySelectorAll('.menu-card, .event-card, .gallery-item');
                cards.forEach(card => {
                    card.style.transform = '';
                    card.style.transition = '';
                    card.dataset.isHovered = 'false';
                    card.dataset.tiltX = '0';
                    card.dataset.tiltY = '0';
                    
                    const shine = card.querySelector('.shine-overlay');
                    if (shine) {
                        shine.style.background = '';
                    }
                });
            }
        }, 100);
    });

    // ━━━ SMOOTH COUNTER WITH EASING ━━━
    const initCounters = () => {
        const counters = document.querySelectorAll('[data-target]');
        if (counters.length === 0) return;

        const easeOutExpo = (t) => {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        };

        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target')) || 0;
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;

            const update = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutExpo(progress);
                const currentValue = startValue + (target - startValue) * easedProgress;

                if (Number.isInteger(target)) {
                    counter.textContent = Math.floor(currentValue);
                } else {
                    counter.textContent = currentValue.toFixed(1);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(update);
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            counters.forEach(counter => observer.observe(counter));
        } else {
            counters.forEach(counter => {
                counter.textContent = counter.getAttribute('data-target');
            });
        }
    };

    initCounters();

    // ━━━ MENU FILTER LOGIC ━━━
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    if (filterButtons.length > 0 && menuCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Actualizar estado activo en botones e indicador ARIA
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                const filterValue = btn.getAttribute('data-filter');

                // 2. Transición y animación de tarjetas sin saltos
                menuCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const isMatch = filterValue === 'all' || category === filterValue;

                    if (isMatch) {
                        // Cancelar cualquier temporizador de ocultación pendiente
                        if (card.hideTimeout) {
                            clearTimeout(card.hideTimeout);
                            card.hideTimeout = null;
                        }
                        if (card.style.display === 'none') {
                            card.style.display = 'flex';
                            // Forzar recalculado de layout (reflow) para habilitar transición
                            void card.offsetHeight;
                        }
                        card.classList.remove('hidden-card');
                    } else {
                        // Iniciar desvanecimiento de salida (duración: 100ms definida en CSS)
                        card.classList.add('hidden-card');
                        
                        // Establecer temporizador para ocultar físicamente en el DOM tras terminar transición
                        if (!card.hideTimeout) {
                            card.hideTimeout = setTimeout(() => {
                                if (card.classList.contains('hidden-card')) {
                                    card.style.display = 'none';
                                }
                                card.hideTimeout = null;
                            }, 100);
                        }
                    }
                });
            });
        });
    }

    // ━━━ GALLERY LIGHTBOX LOGIC ━━━
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxImageView = document.querySelector('.lightbox-image-view');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    let currentPhotoIndex = -1; // Almacena el índice de la foto activa (0-7 para los 8 items)

    if (galleryItems.length > 0 && lightbox) {
        // Función para actualizar contenido del lightbox con transición de fundido rápida
        const updateLightboxContent = (index) => {
            const item = galleryItems[index];
            if (!item) return;

            const labelText = item.querySelector('.gallery-item-label').textContent;
            // Obtener el gradiente de fondo computado de la tarjeta
            const gradientDiv = item.querySelector('.gallery-gradient');
            const bgGradient = window.getComputedStyle(gradientDiv).backgroundImage;

            // Transición de fundido de la imagen
            if (lightboxImageView) {
                lightboxImageView.style.opacity = '0';
                lightboxImageView.style.transform = 'scale(0.95)';
                lightboxImageView.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                
                setTimeout(() => {
                    lightboxImageView.style.backgroundImage = bgGradient;
                    if (lightboxCaption) {
                        lightboxCaption.textContent = labelText;
                    }
                    lightboxImageView.style.opacity = '1';
                    lightboxImageView.style.transform = 'scale(1)';
                }, 150);
            } else {
                if (lightboxCaption) {
                    lightboxCaption.textContent = labelText;
                }
            }

            // Actualizar aria-current para el elemento activo de la galería
            galleryItems.forEach((gItem, idx) => {
                if (idx === index) {
                    gItem.setAttribute('aria-current', 'true');
                } else {
                    gItem.removeAttribute('aria-current');
                }
            });

            currentPhotoIndex = index;
        };

        const openLightbox = (index) => {
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
            updateLightboxContent(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
            
            // Remover aria-current de todos los elementos al cerrar
            galleryItems.forEach(gItem => {
                gItem.removeAttribute('aria-current');
            });
        };

        const nextImage = () => {
            let nextIndex = currentPhotoIndex + 1;
            if (nextIndex >= galleryItems.length) {
                nextIndex = 0; // Volver al inicio (bucle)
            }
            updateLightboxContent(nextIndex);
        };

        const prevImage = () => {
            let prevIndex = currentPhotoIndex - 1;
            if (prevIndex < 0) {
                prevIndex = galleryItems.length - 1; // Ir al final (bucle)
            }
            updateLightboxContent(prevIndex);
        };

        // Click en los items de galería (desactivados a petición del usuario para evitar abrir el lightbox)
        /*
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });
        */

        // Click en botón cerrar
        if (lightboxClose) {
            lightboxClose.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });
        }

        // Click en botones navegación
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                prevImage();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                nextImage();
            });
        }

        // Cerrar al hacer clic en el overlay (fondo oscuro) pero no en la imagen/caption/botones
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navegación por teclado (Flechas y Escape)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });
    }

    // ━━━ RESERVATIONS FORM LOGIC ━━━
    const resForm = document.getElementById('reservation-form');
    const resSuccess = document.querySelector('.success-message');
    
    if (resForm) {
        const formInputs = resForm.querySelectorAll('input, select, textarea');
        const dateInput = document.getElementById('reservation-date');
        
        // Función para cerrar todos los selectores y datepickers abiertos
        const closeAllCustomDropdowns = (exceptWrapper = null) => {
            document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
                if (wrapper !== exceptWrapper) {
                    wrapper.classList.remove('is-open');
                    const parent = wrapper.closest('.input-group');
                    if (parent) parent.classList.remove('select-open');
                }
            });
            
            const datepickerPopup = document.querySelector('.custom-datepicker-popup');
            if (datepickerPopup && (!exceptWrapper || !exceptWrapper.contains(datepickerPopup))) {
                datepickerPopup.classList.remove('is-open');
                const parent = datepickerPopup.closest('.input-group');
                if (parent) parent.classList.remove('datepicker-open');
            }
        };

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-select-wrapper') && 
                !e.target.closest('.custom-datepicker-popup') && 
                e.target !== dateInput) {
                closeAllCustomDropdowns();
            }
        });

        // 1. Lógica de Floating Labels
        const updateInputState = (input) => {
            const parent = input.closest('.input-group');
            if (!parent) return;
            
            if (input.value !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        };

        formInputs.forEach(input => {
            // Inicializar estado al cargar
            updateInputState(input);
            
            // Listeners de eventos
            input.addEventListener('input', () => updateInputState(input));
            input.addEventListener('change', () => updateInputState(input));
            input.addEventListener('focus', () => {
                const parent = input.closest('.input-group');
                if (parent) parent.classList.add('is-focused');
            });
            input.addEventListener('blur', () => {
                const parent = input.closest('.input-group');
                if (parent) {
                    parent.classList.remove('is-focused');
                    // Validar campo individualmente al perder foco si ya se intentó enviar
                    if (resForm.classList.contains('was-validated')) {
                        validateField(input);
                    }
                }
            });
        });

        // Inicializar Custom Selects (para Time y Occasion)
        const selects = resForm.querySelectorAll('select');
        selects.forEach(select => {
            const parent = select.closest('.input-group');
            if (!parent) return;

            // Ocultar select original para mantener la accesibilidad y validaciones
            select.classList.add('hidden-select');

            // Crear Wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'custom-select-wrapper';

            // Crear Trigger
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            
            if (select.value && select.value !== '') {
                trigger.textContent = select.options[select.selectedIndex].text;
            } else {
                trigger.innerHTML = '&nbsp;'; // Mantiene la altura para que el label flote adecuadamente
            }
            wrapper.appendChild(trigger);

            // Crear contenedor de opciones
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'custom-select-options';

            // Llenar opciones
            Array.from(select.options).forEach(opt => {
                if (opt.value === '' && (opt.disabled || opt.hidden)) return;

                const customOpt = document.createElement('div');
                customOpt.className = 'custom-select-option';
                customOpt.dataset.value = opt.value;
                customOpt.textContent = opt.text;

                if (opt.selected && opt.value !== '') {
                    customOpt.classList.add('is-selected');
                }

                customOpt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    select.value = opt.value;
                    trigger.textContent = opt.text;
                    
                    optionsContainer.querySelectorAll('.custom-select-option').forEach(item => {
                        item.classList.remove('is-selected');
                    });
                    customOpt.classList.add('is-selected');
                    
                    wrapper.classList.remove('is-open');
                    parent.classList.remove('select-open');
                    
                    // Disparar eventos para validar y actualizar estado de floating label
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    select.dispatchEvent(new Event('input', { bubbles: true }));
                });

                optionsContainer.appendChild(customOpt);
            });

            wrapper.appendChild(optionsContainer);
            select.after(wrapper);

            // Evento Click en el Trigger
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = wrapper.classList.contains('is-open');
                
                closeAllCustomDropdowns();
                
                if (!isOpen) {
                    wrapper.classList.add('is-open');
                    parent.classList.add('select-open');
                }
            });
        });

        // Inicializar Custom Datepicker
        if (dateInput) {
            const parent = dateInput.closest('.input-group');
            
            // Crear popup de datepicker
            const popup = document.createElement('div');
            popup.className = 'custom-datepicker-popup';
            popup.innerHTML = `
                <div class="datepicker-header">
                    <button type="button" class="datepicker-nav-btn prev-month" aria-label="Previous month">&lt;</button>
                    <span class="datepicker-month-year"></span>
                    <button type="button" class="datepicker-nav-btn next-month" aria-label="Next month">&gt;</button>
                </div>
                <div class="datepicker-weekdays">
                    <span>Su</span>
                    <span>Mo</span>
                    <span>Tu</span>
                    <span>We</span>
                    <span>Th</span>
                    <span>Fr</span>
                    <span>Sa</span>
                </div>
                <div class="datepicker-days"></div>
            `;
            
            dateInput.after(popup);
            
            let currentDate = new Date();
            const months = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
            ];
            
            const renderCalendar = () => {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                
                popup.querySelector('.datepicker-month-year').textContent = `${months[month]} ${year}`;
                
                const daysContainer = popup.querySelector('.datepicker-days');
                daysContainer.innerHTML = '';
                
                const firstDayIndex = new Date(year, month, 1).getDay();
                const totalDays = new Date(year, month + 1, 0).getDate();
                
                // Celdas vacías previas
                for (let i = 0; i < firstDayIndex; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'datepicker-day empty';
                    daysContainer.appendChild(emptyDay);
                }
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                let selectedDateObj = null;
                if (dateInput.value !== '') {
                    const parsed = Date.parse(dateInput.value);
                    if (!isNaN(parsed)) {
                        selectedDateObj = new Date(parsed);
                        selectedDateObj.setHours(0, 0, 0, 0);
                    }
                }
                
                // Renderizar celdas de días
                for (let day = 1; day <= totalDays; day++) {
                    const dayCell = document.createElement('div');
                    dayCell.className = 'datepicker-day';
                    dayCell.textContent = day;
                    
                    const cellDate = new Date(year, month, day);
                    cellDate.setHours(0, 0, 0, 0);
                    
                    // Deshabilitar lunes (Soleil cerrado) y fechas pasadas
                    const isMonday = cellDate.getDay() === 1;
                    const isPast = cellDate < today;
                    
                    if (isMonday || isPast) {
                        dayCell.classList.add('disabled');
                    } else {
                        if (selectedDateObj && cellDate.getTime() === selectedDateObj.getTime()) {
                            dayCell.classList.add('selected');
                        }
                        
                        dayCell.addEventListener('click', (e) => {
                            e.stopPropagation();
                            
                            // Formato elegante de visualización
                            const formattedDate = `${months[month]} ${day}, ${year}`;
                            dateInput.value = formattedDate;
                            
                            popup.classList.remove('is-open');
                            parent.classList.remove('datepicker-open');
                            
                            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
                            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
                        });
                    }
                    
                    daysContainer.appendChild(dayCell);
                }
            };
            
            // Navegar meses
            popup.querySelector('.prev-month').addEventListener('click', (e) => {
                e.stopPropagation();
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
            
            popup.querySelector('.next-month').addEventListener('click', (e) => {
                e.stopPropagation();
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
            
            // Abrir selector
            const openDatePicker = () => {
                const isOpen = popup.classList.contains('is-open');
                closeAllCustomDropdowns();
                if (!isOpen) {
                    popup.classList.add('is-open');
                    parent.classList.add('datepicker-open');
                    
                    if (dateInput.value !== '') {
                        const parsed = Date.parse(dateInput.value);
                        if (!isNaN(parsed)) {
                            currentDate = new Date(parsed);
                        } else {
                            currentDate = new Date();
                        }
                    } else {
                        currentDate = new Date();
                    }
                    renderCalendar();
                }
            };
            
            let justFocused = false;

            dateInput.addEventListener('click', (e) => {
                e.stopPropagation();
                if (justFocused) return;
                
                const isOpen = popup.classList.contains('is-open');
                if (isOpen) {
                    closeAllCustomDropdowns();
                } else {
                    openDatePicker();
                }
            });
            
            dateInput.addEventListener('focus', (e) => {
                justFocused = true;
                openDatePicker();
                setTimeout(() => {
                    justFocused = false;
                }, 300);
            });
        }

        // 3. Custom Stepper de Comensales (Party Size)
        const btnMinus = resForm.querySelector('.btn-minus');
        const btnPlus = resForm.querySelector('.btn-plus');
        const stepperDisplay = document.getElementById('party-size-display');
        const stepperInput = document.getElementById('party-size-input');

        if (btnMinus && btnPlus && stepperDisplay && stepperInput) {
            let currentValue = parseInt(stepperInput.value, 10) || 2;
            
            const updateStepper = (val) => {
                currentValue = Math.max(1, Math.min(12, val));
                stepperDisplay.textContent = currentValue;
                stepperInput.value = currentValue;
            };

            btnMinus.addEventListener('click', (e) => {
                e.preventDefault();
                updateStepper(currentValue - 1);
            });

            btnPlus.addEventListener('click', (e) => {
                e.preventDefault();
                updateStepper(currentValue + 1);
            });
        }

        // 4. Función de validación individual de campos
        const validateField = (input) => {
            const parent = input.closest('.input-group');
            if (!parent) return true;
            
            const errorSpan = parent.querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';

            // Saltarse si es opcional y está vacío (Special Requests)
            if (input.id === 'special-requests' && input.value.trim() === '') {
                parent.classList.remove('has-error');
                if (errorSpan) errorSpan.textContent = '';
                return true;
            }

            // Validar requerido
            if (input.hasAttribute('required') && input.value.trim() === '') {
                isValid = false;
                errorMessage = 'This field is required.';
            } else if (input.type === 'email' && input.value.trim() !== '') {
                // Formato de email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            } else if (input.id === 'reservation-date' && input.value !== '') {
                // Validar fecha futura o hoy
                let selectedDate = null;
                const parsed = Date.parse(input.value);
                if (!isNaN(parsed)) {
                    selectedDate = new Date(parsed);
                    selectedDate.setHours(0, 0, 0, 0);
                } else {
                    selectedDate = new Date(input.value + 'T00:00:00');
                }
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                
                if (!selectedDate || selectedDate < todayDate) {
                    isValid = false;
                    errorMessage = 'Date must be today or in the future.';
                } else if (selectedDate.getDay() === 1) {
                    isValid = false;
                    errorMessage = 'Soleil is closed on Mondays.';
                }
            }

            if (!isValid) {
                parent.classList.add('has-error');
                if (errorSpan) errorSpan.textContent = errorMessage;
            } else {
                parent.classList.remove('has-error');
                if (errorSpan) errorSpan.textContent = '';
            }

            return isValid;
        };

        // 5. Envío y validación del formulario
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            resForm.classList.add('was-validated');
            
            let isFormValid = true;
            formInputs.forEach(input => {
                const isFieldValid = validateField(input);
                if (!isFieldValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Efecto de envío exitoso
                resForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                resForm.style.opacity = '0';
                resForm.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    resForm.style.display = 'none';
                    if (resSuccess) {
                        resSuccess.style.display = 'flex';
                        // Forzar redibujado para animación del checkmark SVG
                        const checkmarkCheck = resSuccess.querySelector('.checkmark-check');
                        if (checkmarkCheck) {
                            checkmarkCheck.style.animation = 'none';
                            void checkmarkCheck.offsetHeight; // reflow
                            checkmarkCheck.style.animation = null;
                        }
                    }
                }, 400);
            } else {
                // Hacer scroll hasta el primer campo con error de forma suave
                const firstError = resForm.querySelector('.input-group.has-error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // ━━━ NEWSLETTER SIGNUP INTERACTION ━━━
    const newsletterForm = document.getElementById('footer-newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const messageSpan = newsletterForm.querySelector('.newsletter-message');
        let hideTimeout;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (hideTimeout) clearTimeout(hideTimeout);
            
            if (!email) {
                showMessage('Please enter an email address.', '#ff5f5f');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', '#ff5f5f');
                return;
            }
            
            // Simular éxito
            showMessage('Merci! Welcome to our table.', 'var(--color-gold)');
            emailInput.value = '';
            
            // Ocultar mensaje tras 5 segundos
            hideTimeout = setTimeout(() => {
                fadeOutMessage();
            }, 5000);
        });

        const showMessage = (msg, color) => {
            if (messageSpan) {
                messageSpan.textContent = msg;
                messageSpan.style.color = color;
                messageSpan.style.display = 'block';
                messageSpan.style.opacity = '1';
                messageSpan.style.transition = 'none';
            }
        };

        const fadeOutMessage = () => {
            if (messageSpan && messageSpan.style.display !== 'none') {
                messageSpan.style.transition = 'opacity 0.5s ease';
                messageSpan.style.opacity = '0';
                setTimeout(() => {
                    if (messageSpan.style.opacity === '0') {
                        messageSpan.style.display = 'none';
                    }
                }, 500);
            }
        };
    }
});
