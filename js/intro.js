/**
 * AI 기반 시험 문제 출제 지원 시스템 - 소개 페이지 스크립트
 * Interactive features and animations
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('🚀 Initializing intro page...');
    
    // Initialize components
    initNavigation();
    initScrollAnimations();
    initBenefitsChart();
    initFloatingElements();
    initSmoothScrolling();
    
    console.log('✅ Intro page initialized successfully');
}

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for blur effect
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            const icon = mobileToggle.querySelector('i');
            
            if (navMenu.classList.contains('mobile-active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }
    
    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for grid items
                const gridItems = entry.target.querySelectorAll('.challenge-item, .feature-card, .innovation-card, .tech-item');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.section-header, .challenge-item, .feature-card, .innovation-card, .tech-category, .solution-content, .benefits-content');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Benefits chart using Chart.js
function initBenefitsChart() {
    const chartCanvas = document.getElementById('benefitsChart');
    
    if (!chartCanvas) {
        console.warn('Benefits chart canvas not found');
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Chart data
    const chartData = {
        labels: ['현재', 'AI 도입 후'],
        datasets: [{
            label: '업무시간 (시간/월)',
            data: [40, 20],
            backgroundColor: [
                'rgba(239, 68, 68, 0.8)',
                'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
                'rgb(239, 68, 68)',
                'rgb(34, 197, 94)'
            ],
            borderWidth: 2
        }, {
            label: '출제 기간 (일)',
            data: [30, 21],
            backgroundColor: [
                'rgba(245, 158, 11, 0.8)',
                'rgba(59, 130, 246, 0.8)'
            ],
            borderColor: [
                'rgb(245, 158, 11)',
                'rgb(59, 130, 246)'
            ],
            borderWidth: 2
        }, {
            label: '품질 점수 (%)',
            data: [75, 95],
            backgroundColor: [
                'rgba(168, 85, 247, 0.8)',
                'rgba(16, 185, 129, 0.8)'
            ],
            borderColor: [
                'rgb(168, 85, 247)',
                'rgb(16, 185, 129)'
            ],
            borderWidth: 2
        }]
    };
    
    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'AI 도입 전후 비교',
                    font: {
                        family: 'Noto Sans KR',
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1f2937'
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Noto Sans KR'
                        },
                        color: '#4b5563',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR',
                            weight: '500'
                        },
                        color: '#6b7280'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            family: 'Noto Sans KR'
                        },
                        color: '#6b7280'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    };
    
    // Create chart with error handling
    try {
        new Chart(ctx, config);
        console.log('✅ Benefits chart created successfully');
    } catch (error) {
        console.error('❌ Error creating benefits chart:', error);
        
        // Fallback: show static message
        chartCanvas.parentElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px; background: #f8fafc; border-radius: 15px; border: 1px solid #e5e7eb;">
                <div style="text-align: center; color: #6b7280;">
                    <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 1rem; color: #667eea;"></i>
                    <p style="font-size: 1.1rem; font-weight: 500;">AI 도입 효과 차트</p>
                    <p style="font-size: 0.9rem;">업무시간 50% 단축, 품질 95% 향상</p>
                </div>
            </div>
        `;
    }
}

// Enhanced floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Random initial positions
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        
        element.style.left = `${randomX}%`;
        element.style.top = `${randomY}%`;
        
        // Add mouse interaction
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.2) rotate(15deg)';
            element.style.color = 'rgba(251, 191, 36, 0.3)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.color = '';
        });
        
        // Continuous floating animation with different speeds
        const duration = 4000 + (index * 500); // Different duration for each element
        element.style.animationDuration = `${duration}ms`;
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-menu-toggle i');
                
                if (navMenu && navMenu.classList.contains('mobile-active')) {
                    navMenu.classList.remove('mobile-active');
                    if (mobileToggle) {
                        mobileToggle.classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
        });
    });
}

// Statistics counter animation
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .metric-value');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/[^0-9]/g, ''));
    const suffix = text.replace(/[0-9]/g, '');
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 60; // 60 frames for 1 second at 60fps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

// Interactive hover effects for cards
function initCardInteractions() {
    const cards = document.querySelectorAll('.challenge-item, .feature-card, .innovation-card, .process-step');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.zIndex = '';
        });
    });
}

// Parallax scrolling effect for hero section
function initParallaxEffects() {
    const heroSection = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Move floating elements at different rates
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize additional features after DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Add slight delay for smoother initialization
    setTimeout(() => {
        initCounterAnimations();
        initCardInteractions();
        initParallaxEffects();
    }, 500);
});

// Handle resize events
window.addEventListener('resize', debounce(() => {
    // Reinitialize components that might need adjustment
    console.log('Window resized - adjusting components');
}, 250));

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Reduce animations on mobile
function optimizeForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        console.log('Mobile optimizations applied');
    }
}

// Apply mobile optimizations
window.addEventListener('load', optimizeForMobile);
window.addEventListener('resize', debounce(optimizeForMobile, 250));

// Accessibility enhancements
function initAccessibility() {
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels for screen readers
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        if (!item.getAttribute('aria-label')) {
            item.setAttribute('aria-label', `Navigate to ${item.textContent.trim()}`);
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Error handling for missing elements
function handleMissingElements() {
    const criticalElements = [
        '.navbar',
        '.hero',
        '.features',
        '.benefits'
    ];
    
    criticalElements.forEach(selector => {
        if (!document.querySelector(selector)) {
            console.warn(`Critical element missing: ${selector}`);
        }
    });
}

// Run error checking after DOM load
document.addEventListener('DOMContentLoaded', handleMissingElements);

// Export functions for potential external use
window.IntroPageApp = {
    initializeApp,
    initNavigation,
    initScrollAnimations,
    initBenefitsChart
};

// Mobile Navigation Functions
function toggleMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    const menu = document.getElementById('mobileNavMenu');
    
    if (overlay && menu) {
        overlay.classList.toggle('active');
        menu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileNav() {
    const overlay = document.getElementById('mobileNavOverlay');
    const menu = document.getElementById('mobileNavMenu');
    
    if (overlay && menu) {
        overlay.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Make functions globally available
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.scrollToSection = scrollToSection;

console.log('📄 Intro page script loaded successfully');