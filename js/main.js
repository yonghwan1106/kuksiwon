// Main JavaScript for AI Question Generator Prototype
// 2025년도 한국보건의료인국가시험원 대국민 혁신제안 공모전 제출용

// Global functions for inline onclick events - must be defined before DOM loads
function switchPage(pageId) {
    console.log('switchPage called with:', pageId);
    
    // Remove active class from all nav items and pages
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(nav => nav.classList.remove('active'));
    pages.forEach(page => page.classList.remove('active'));
    
    // Add active class to clicked nav item
    const clickedNav = document.querySelector(`[data-page="${pageId}"]`);
    if (clickedNav) {
        clickedNav.classList.add('active');
    }
    
    // Show corresponding page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`Switched to ${pageId} page successfully`);
        
        // Load page-specific content if needed
        switch(pageId) {
            case 'generator':
                console.log('Loading generator page content');
                break;
            case 'review':
                console.log('Loading review page content');
                break;
            case 'analytics':
                console.log('Loading analytics page content');
                break;
            default:
                console.log('Loading dashboard page content');
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
    } else {
        console.error(`Page element not found: ${pageId}-page`);
    }
}

// Mobile Navigation Functions - Global scope for HTML onclick
function toggleMobileNav() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.querySelector('.mobile-nav-toggle i');
    
    if (mobileNavMenu && mobileNavMenu.classList.contains('active')) {
        closeMobileNav();
    } else {
        if (mobileNavMenu) mobileNavMenu.classList.add('active');
        if (mobileNavOverlay) mobileNavOverlay.style.display = 'block';
        if (toggleBtn) {
            toggleBtn.classList.remove('fa-bars');
            toggleBtn.classList.add('fa-times');
        }
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNav() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.querySelector('.mobile-nav-toggle i');
    
    if (mobileNavMenu) mobileNavMenu.classList.remove('active');
    if (mobileNavOverlay) mobileNavOverlay.style.display = 'none';
    if (toggleBtn) {
        toggleBtn.classList.remove('fa-times');
        toggleBtn.classList.add('fa-bars');
    }
    document.body.style.overflow = '';
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Set up navigation
    setupNavigation();
    
    // Load dashboard data
    loadDashboard();
    
    // Setup charts
    setTimeout(() => {
        setupCharts();
    }, 100);
    
    // Initialize mobile optimizations
    initializeMobileOptimizations();
});

// Close mobile nav when window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileNav();
    }
});

function initializeApp() {
    console.log('AI Question Generator Prototype - 한국보건의료인국가시험원');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding page
            const pageId = item.getAttribute('data-page');
            const targetPage = document.getElementById(`${pageId}-page`);
            
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Load page-specific content if needed
                switch(pageId) {
                    case 'generator':
                        console.log('Switching to generator page');
                        break;
                    case 'review':
                        console.log('Switching to review page');
                        break;
                    case 'analytics':
                        console.log('Switching to analytics page');
                        setTimeout(() => {
                            if (typeof setupAnalyticsCharts === 'function') {
                                setupAnalyticsCharts();
                            }
                        }, 200);
                        break;
                    default:
                        console.log('Switching to dashboard page');
                        loadDashboard();
                }
                
                // Scroll to top of the page
                window.scrollTo(0, 0);
            } else {
                console.error(`Page element not found: ${pageId}-page`);
            }
        });
    });
}

function loadDashboard() {
    // Already loaded in HTML, but we can update with real-time data
    updateMetrics();
    updateRecentActivities();
    updatePerformanceTable();
}

function updateMetrics() {
    const stats = mockData.dashboardStats;
    
    // Update metric cards
    const metrics = document.querySelectorAll('.metric-card');
    if (metrics.length >= 4) {
        metrics[0].querySelector('h3').textContent = formatNumber(stats.total_questions);
        metrics[1].querySelector('h3').textContent = formatNumber(stats.ai_generated_questions);
        metrics[2].querySelector('h3').textContent = `${stats.avg_generation_time}초`;
        metrics[3].querySelector('h3').textContent = `${stats.success_rate}%`;
    }
}

function updateRecentActivities() {
    const activitiesList = document.querySelector('.activities-list');
    if (!activitiesList) return;
    
    activitiesList.innerHTML = '';
    
    mockData.recentActivities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activitiesList.appendChild(activityElement);
    });
}

function createActivityElement(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    
    div.innerHTML = `
        <div class="activity-icon ${activity.color}">
            <i class="fas fa-${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <p><strong>${activity.user_name}</strong>님이 ${activity.action}했습니다</p>
            <span class="activity-title">${activity.target}</span>
            <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
        </div>
    `;
    
    return div;
}

function updatePerformanceTable() {
    const tbody = document.querySelector('.performance-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    mockData.examinerPerformance.forEach((examiner, index) => {
        const row = createPerformanceRow(examiner, index);
        tbody.appendChild(row);
    });
}

function createPerformanceRow(examiner, index) {
    const tr = document.createElement('tr');
    
    const avatars = [
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=32&h=32&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1594824723358-85883d3ece7d?w=32&h=32&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face'
    ];
    
    const progressPercent = (examiner.monthly_completed / examiner.monthly_target) * 100;
    const badgeClass = examiner.approved_rate >= 90 ? 'success' : 'warning';
    const efficiencyClass = examiner.efficiency_score >= 90 ? 'excellent' : 'good';
    
    tr.innerHTML = `
        <td>
            <div class="examiner-info">
                <img src="${avatars[index]}" alt="${examiner.examiner_name}">
                <span>${examiner.examiner_name}</span>
            </div>
        </td>
        <td>${examiner.total_questions}</td>
        <td><span class="badge ${badgeClass}">${examiner.approved_rate}%</span></td>
        <td>${examiner.avg_rating} ⭐</td>
        <td>${examiner.monthly_target}</td>
        <td>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(progressPercent, 100)}%"></div>
            </div>
            <span>${examiner.monthly_completed}/${examiner.monthly_target}</span>
        </td>
        <td><span class="efficiency-score ${efficiencyClass}">${examiner.efficiency_score}</span></td>
    `;
    
    return tr;
}

function setupCharts() {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: mockData.monthlyData.labels,
            datasets: [
                {
                    label: 'AI 생성',
                    data: mockData.monthlyData.ai_generated,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: '수동 작성',
                    data: mockData.monthlyData.human_generated,
                    backgroundColor: 'rgba(240, 147, 251, 0.8)',
                    borderColor: 'rgba(245, 87, 108, 1)',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    },
                    ticks: {
                        color: '#6c757d',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6c757d',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 6
                }
            }
        }
    });
}

// Mobile Optimization Functions
function initializeMobileOptimizations() {
    if (isMobileDevice()) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Optimize images loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
        
        // Show table scroll hint
        setTimeout(showTableScrollHint, 1000);
        addTableScrollListener();
        
        // Add touch support
        addTouchSupport();
        
        // Optimize chart rendering
        optimizeChartsForMobile();
    }
}

function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isMobile();
}

function addTouchSupport() {
    const cards = document.querySelectorAll('.metric-card, .dashboard-card, .mode-btn');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

function optimizeChartsForMobile() {
    if (isMobile()) {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.height = '200px';
        });
    }
}

function showTableScrollHint() {
    if (isMobile()) {
        const hint = document.querySelector('.table-scroll-hint');
        const table = document.querySelector('.performance-table table');
        
        if (hint && table && table.scrollWidth > table.clientWidth) {
            hint.style.display = 'flex';
            
            // Hide hint after 5 seconds
            setTimeout(() => {
                hint.style.display = 'none';
            }, 5000);
        }
    }
}

function addTableScrollListener() {
    const tableContainer = document.querySelector('.performance-table');
    if (tableContainer && isMobile()) {
        let isScrolling = false;
        
        tableContainer.addEventListener('scroll', function() {
            if (!isScrolling) {
                const hint = document.querySelector('.table-scroll-hint');
                if (hint) {
                    hint.style.display = 'none';
                }
                isScrolling = true;
            }
        });
    }
}

// Utility Functions
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
}

function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

// Page loading functions
function loadGeneratorPage() {
    console.log('Loading generator page...');
    // Generator page content is already in HTML
}

function loadReviewPage() {
    console.log('Loading review page...');
    // Review page content is already in HTML
}

function loadAnalyticsPage() {
    console.log('Loading analytics page...');
    // Analytics page content is already in HTML
}

function setupAnalyticsCharts() {
    console.log('Setting up analytics charts...');
    // Analytics charts setup
}