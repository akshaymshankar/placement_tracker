// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Loading Screen Management
    const loadingScreen = document.getElementById('loadingScreen');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Initialize animations after loading screen disappears
        setTimeout(() => {
            initializeAnimations();
        }, 500);
    }, 2500);

    // Smooth Scrolling Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    function initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger counter animations
                    if (entry.target.classList.contains('stat-card')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animateElements = document.querySelectorAll('.service-card, .process-step, .stat-card, .video-preview, .package-card, .faq-item');
        animateElements.forEach(el => observer.observe(el));
    }

    // Counter Animation
    function animateCounter(statCard) {
        const numberElement = statCard.querySelector('.stat-number');
        const target = parseInt(numberElement.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                numberElement.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = target;
            }
        };

        // Add a small delay for effect
        setTimeout(() => {
            updateCounter();
        }, 200);
    }

    // Testimonials Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showNextTestimonial() {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }

    // Auto-rotate testimonials every 4 seconds
    setInterval(showNextTestimonial, 4000);

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Enhanced Hover Effects for Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            const icon = card.querySelector('.service-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            const icon = card.querySelector('.service-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Magnetic Effect for CTA Buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            this.style.boxShadow = '0 15px 40px rgba(0, 212, 255, 0.5)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.4)';
        });

        // Click animation
        button.addEventListener('click', function() {
            this.style.transform = 'translateY(-2px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px) scale(1.05)';
            }, 150);
        });
    });

    // Package Button Hover Effects
    const packageButtons = document.querySelectorAll('.package-button');
    packageButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.3)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Video Preview Hover Effects
    const videoPreviews = document.querySelectorAll('.video-preview');
    videoPreviews.forEach(preview => {
        preview.addEventListener('mouseenter', function() {
            const playButton = this.querySelector('.play-button');
            playButton.style.transform = 'scale(1.2)';
            playButton.style.background = 'rgba(0, 212, 255, 0.9)';
        });

        preview.addEventListener('mouseleave', function() {
            const playButton = this.querySelector('.play-button');
            playButton.style.transform = 'scale(1)';
            playButton.style.background = 'rgba(0, 0, 0, 0.7)';
        });

        // Click effect for video previews
        preview.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.05)';
            }, 150);
        });
    });

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });

        // Parallax for gradient overlay
        const gradientOverlay = document.querySelector('.gradient-overlay');
        if (gradientOverlay) {
            gradientOverlay.style.transform = `translateY(${rate}px)`;
        }

        // Nav background opacity based on scroll
        const nav = document.getElementById('nav');
        const opacity = Math.min(scrolled / 100, 1);
        nav.style.background = `rgba(0, 0, 0, ${0.7 + opacity * 0.3})`;
    });

    // Process Steps Animation Enhancement
    const processSteps = document.querySelectorAll('.process-step');
    processSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) rotateY(5deg)';
            const icon = this.querySelector('.step-icon');
            icon.style.transform = 'scale(1.3) rotate(15deg)';
        });

        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0deg)';
            const icon = this.querySelector('.step-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Enhanced Package Card Interactions
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            if (this.classList.contains('premium')) {
                this.style.boxShadow = '0 25px 60px rgba(0, 212, 255, 0.3)';
            } else {
                this.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.4)';
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
        });
    });

    // Typing Effect for Hero Title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Add subtle animations to navigation links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.textShadow = '0 4px 8px rgba(0, 212, 255, 0.4)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.textShadow = 'none';
        });
    });

    // Add breathing effect to gradient text
    const gradientTexts = document.querySelectorAll('.gradient-text');
    gradientTexts.forEach(text => {
        setInterval(() => {
            text.style.filter = 'brightness(1.2) drop-shadow(0 0 10px rgba(0, 212, 255, 0.3))';
            setTimeout(() => {
                text.style.filter = 'brightness(1)';
            }, 1000);
        }, 3000);
    });

    // Enhanced FAQ animations
    faqItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        
        const question = item.querySelector('.faq-question');
        question.addEventListener('mouseenter', function() {
            if (!item.classList.contains('active')) {
                this.style.background = 'rgba(0, 212, 255, 0.05)';
                this.style.borderLeft = '4px solid rgba(0, 212, 255, 0.5)';
            }
        });

        question.addEventListener('mouseleave', function() {
            if (!item.classList.contains('active')) {
                this.style.background = 'var(--dark-black)';
                this.style.borderLeft = 'none';
            }
        });
    });

    // Add subtle floating animation to service icons
    const serviceIcons = document.querySelectorAll('.service-icon');
    serviceIcons.forEach((icon, index) => {
        setInterval(() => {
            icon.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                icon.style.transform = 'translateY(0)';
            }, 1000);
        }, 2000 + (index * 500));
    });

    // Add glow effect to stat cards when visible
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const color = this.querySelector('.stat-number').style.color;
            this.style.boxShadow = `0 15px 40px ${color}30`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
        });
    });

    // Smooth reveal animation for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        sectionObserver.observe(section);
    });

    // Add click ripple effect to buttons
    function addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Add ripple effect to all buttons
    const allButtons = document.querySelectorAll('button, .nav-link');
    allButtons.forEach(addRippleEffect);

    // CSS animation for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    console.log('ViralCuts website initialized successfully!');
});