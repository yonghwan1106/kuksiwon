// Main JavaScript for AI Question Generator Prototype
// 2025년도 한국보건의료인국가시험원 대국민 혁신제안 공모전 제출용

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
});

// Mobile Navigation Functions
function toggleMobileNav() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.querySelector('.mobile-nav-toggle i');
    
    if (mobileNavMenu.classList.contains('active')) {
        closeMobileNav();
    } else {
        mobileNavMenu.classList.add('active');
        mobileNavOverlay.style.display = 'block';
        toggleBtn.classList.remove('fa-bars');
        toggleBtn.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileNav() {
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const toggleBtn = document.querySelector('.mobile-nav-toggle i');
    
    mobileNavMenu.classList.remove('active');
    mobileNavOverlay.style.display = 'none';
    toggleBtn.classList.remove('fa-times');
    toggleBtn.classList.add('fa-bars');
    document.body.style.overflow = '';
}

// Close mobile nav when window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileNav();
    }
});

// Global function for inline onclick events
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
                // Setup analytics charts if needed
                setTimeout(() => {
                    if (typeof setupAnalyticsCharts === 'function') {
                        setupAnalyticsCharts();
                    }
                }, 200);
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
    
    // Pre-load all pages content when navigation is set up
    console.log('Setting up navigation and pre-loading pages...');
    setTimeout(() => {
        console.log('Loading generator page...');
        loadGeneratorPage();
        console.log('Loading review page...');
        loadReviewPage();
        console.log('Loading analytics page...');
        loadAnalyticsPage();
        console.log('All pages pre-loaded successfully');
    }, 100);
    
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
                        // Ensure generator page content is loaded
                        console.log('Switching to generator page');
                        if (!targetPage.querySelector('.generator-container')) {
                            console.log('Generator content not found, loading...');
                            loadGeneratorPage();
                        }
                        break;
                    case 'review':
                        // Ensure review page content is loaded
                        console.log('Switching to review page');
                        if (!targetPage.querySelector('.review-container')) {
                            console.log('Review content not found, loading...');
                            loadReviewPage();
                        }
                        break;
                    case 'analytics':
                        // Ensure analytics page content is loaded
                        console.log('Switching to analytics page');
                        if (!targetPage.querySelector('.analytics-container')) {
                            console.log('Analytics content not found, loading...');
                            loadAnalyticsPage();
                        }
                        // Refresh charts when analytics page is shown
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

function loadGeneratorPage() {
    console.log('loadGeneratorPage called');
    const generatorPage = document.getElementById('generator-page');
    if (!generatorPage) {
        console.error('Generator page element not found!');
        return;
    }
    console.log('Generator page element found, loading content...');
    
    generatorPage.innerHTML = `
        <div class="page-header">
            <div class="header-content">
                <h2>AI 문제 생성</h2>
                <p>의료 전문 AI를 활용하여 임상적으로 정확한 고품질 시험 문제를 생성하세요</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="showGenerationHistory()">
                    <i class="fas fa-history"></i> 생성 이력
                </button>
                <button class="btn btn-outline" onclick="showTemplates()">
                    <i class="fas fa-clipboard-list"></i> 템플릿
                </button>
            </div>
        </div>
        
        <div class="generator-container">
            <div class="generator-main">
                <div class="generator-form-card">
                    <div class="card-header">
                        <h3><i class="fas fa-robot"></i> 고급 AI 생성 설정</h3>
                        <div class="generation-mode">
                            <button class="mode-btn active" data-mode="basic" onclick="switchMode('basic')">기본 모드</button>
                            <button class="mode-btn" data-mode="advanced" onclick="switchMode('advanced')">고급 모드</button>
                            <button class="mode-btn" data-mode="batch" onclick="switchMode('batch')">일괄 생성</button>
                        </div>
                    </div>
                    <div class="generator-form">
                        <div id="basicMode" class="mode-content active">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="subject">의료 전공 분야</label>
                                    <select id="subject" class="form-control" onchange="updateSpecialties()">
                                        <option value="">전공을 선택하세요</option>
                                        <option value="internal">내과학</option>
                                        <option value="surgery">외과학</option>
                                        <option value="nursing">성인간호학</option>
                                        <option value="pharmacy">약리학</option>
                                        <option value="pediatrics">소아과학</option>
                                        <option value="obstetrics">산부인과학</option>
                                        <option value="psychiatry">정신의학</option>
                                        <option value="emergency">응급의학</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="specialty">세부 전공 (선택사항)</label>
                                    <select id="specialty" class="form-control" disabled>
                                        <option value="">먼저 전공을 선택하세요</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="difficulty">난이도 설정</label>
                                    <div class="difficulty-slider">
                                        <input type="range" id="difficultySlider" min="1" max="10" value="5" 
                                               oninput="updateDifficultyDisplay(this.value)">
                                        <div class="difficulty-labels">
                                            <span>초급 (1-3)</span>
                                            <span id="currentDifficulty">중급 (5)</span>
                                            <span>고급 (8-10)</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="questionType">문제 유형</label>
                                    <select id="questionType" class="form-control" onchange="updateQuestionSettings()">
                                        <option value="multiple_choice" selected>객관식 5지선다</option>
                                        <option value="scenario_based">임상 상황형</option>
                                        <option value="case_study">증례 분석형</option>
                                        <option value="image_based">영상 판독형</option>
                                        <option value="calculation">계산형 문제</option>
                                        <option value="diagnosis">감별 진단형</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="count">생성할 문제 수</label>
                                    <div class="count-selector">
                                        <button type="button" onclick="adjustCount(-1)">-</button>
                                        <input type="number" id="count" min="1" max="20" value="1" readonly>
                                        <button type="button" onclick="adjustCount(1)">+</button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="language">언어 설정</label>
                                    <select id="language" class="form-control">
                                        <option value="ko" selected>한국어</option>
                                        <option value="en">English</option>
                                        <option value="mixed">혼용 (의학용어 영문)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div id="advancedMode" class="mode-content">
                            <div class="advanced-settings">
                                <div class="form-group">
                                    <label for="clinicalContext">임상 상황 설정</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" value="emergency"> 응급상황</label>
                                        <label><input type="checkbox" value="icu"> 중환자실</label>
                                        <label><input type="checkbox" value="outpatient"> 외래진료</label>
                                        <label><input type="checkbox" value="surgery"> 수술실</label>
                                    </div>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="patientAge">환자 연령대</label>
                                        <select id="patientAge" class="form-control">
                                            <option value="any">제한 없음</option>
                                            <option value="pediatric">소아 (0-18세)</option>
                                            <option value="adult">성인 (19-64세)</option>
                                            <option value="elderly">고령 (65세 이상)</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="gender">성별 고려사항</label>
                                        <select id="gender" class="form-control">
                                            <option value="any">제한 없음</option>
                                            <option value="male">남성</option>
                                            <option value="female">여성</option>
                                            <option value="pregnancy">임신 관련</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="guidelines">참조 가이드라인</label>
                                    <div class="checkbox-group">
                                        <label><input type="checkbox" value="korean"> 한국 진료지침</label>
                                        <label><input type="checkbox" value="international"> 국제 가이드라인</label>
                                        <label><input type="checkbox" value="evidencebased"> 근거중심의학</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="batchMode" class="mode-content">
                            <div class="batch-settings">
                                <div class="form-group">
                                    <label for="batchTemplate">일괄 생성 템플릿</label>
                                    <select id="batchTemplate" class="form-control">
                                        <option value="">템플릿 선택</option>
                                        <option value="comprehensive">종합 시험지 (50문항)</option>
                                        <option value="specialty">전공별 문제집 (30문항)</option>
                                        <option value="difficulty_mix">난이도 혼합 (20문항)</option>
                                        <option value="custom">사용자 정의</option>
                                    </select>
                                </div>
                                
                                <div class="batch-distribution">
                                    <h4>난이도 분포 설정</h4>
                                    <div class="distribution-sliders">
                                        <div class="slider-group">
                                            <label>하급 문제</label>
                                            <input type="range" id="easyRatio" min="0" max="50" value="20">
                                            <span id="easyPercent">20%</span>
                                        </div>
                                        <div class="slider-group">
                                            <label>중급 문제</label>
                                            <input type="range" id="mediumRatio" min="0" max="80" value="60">
                                            <span id="mediumPercent">60%</span>
                                        </div>
                                        <div class="slider-group">
                                            <label>고급 문제</label>
                                            <input type="range" id="hardRatio" min="0" max="50" value="20">
                                            <span id="hardPercent">20%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="keywords">핵심 키워드 및 개념</label>
                            <div class="keyword-input">
                                <input type="text" id="keywordInput" class="form-control" 
                                       placeholder="키워드를 입력하고 Enter를 누르세요" 
                                       onkeypress="addKeyword(event)">
                                <div id="keywordTags" class="keyword-tags"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="context">추가 요구사항 및 특별 지시사항</label>
                            <textarea id="context" class="form-control" rows="4" 
                                      placeholder="예: 최신 가이드라인 반영, 실제 임상 사례 기반, 감별진단 중점 등"></textarea>
                        </div>
                        
                        <div class="generation-options">
                            <div class="option-group">
                                <label>
                                    <input type="checkbox" id="includeImages" onchange="toggleImageOptions()"> 
                                    의료 영상/도표 포함
                                </label>
                                <label>
                                    <input type="checkbox" id="multipleVersions"> 
                                    다양한 버전 생성 (3개)
                                </label>
                                <label>
                                    <input type="checkbox" id="detailedExplanation" checked> 
                                    상세 해설 포함
                                </label>
                                <label>
                                    <input type="checkbox" id="references" checked> 
                                    참고문헌 자동 추가
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button class="btn btn-primary btn-generate" onclick="generateAdvancedQuestions()">
                                <i class="fas fa-magic"></i>
                                <span id="generateBtnText">AI 문제 생성</span>
                                <span id="estimatedTime" class="estimated-time"></span>
                            </button>
                            <button class="btn btn-secondary" onclick="previewSettings()">
                                <i class="fas fa-eye"></i>
                                설정 미리보기
                            </button>
                            <button class="btn btn-outline" onclick="saveAsTemplate()">
                                <i class="fas fa-save"></i>
                                템플릿 저장
                            </button>
                            <button class="btn btn-outline" onclick="resetAdvancedForm()">
                                <i class="fas fa-redo"></i>
                                초기화
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="generation-progress" id="generationProgress" style="display: none;">
                    <div class="progress-header">
                        <h3><i class="fas fa-cog fa-spin"></i> AI 문제 생성 진행중</h3>
                        <button class="btn btn-sm btn-outline" onclick="cancelGeneration()">
                            <i class="fas fa-times"></i> 취소
                        </button>
                    </div>
                    <div class="progress-content">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill" style="width: 0%"></div>
                        </div>
                        <div class="progress-steps">
                            <div class="step active" id="step1">
                                <i class="fas fa-brain"></i>
                                <span>의료 지식 분석</span>
                            </div>
                            <div class="step" id="step2">
                                <i class="fas fa-clipboard-list"></i>
                                <span>문제 구조화</span>
                            </div>
                            <div class="step" id="step3">
                                <i class="fas fa-check-circle"></i>
                                <span>품질 검증</span>
                            </div>
                        </div>
                        <div class="progress-details">
                            <p id="progressText">의료 전문 지식 데이터베이스를 분석하고 있습니다...</p>
                            <div class="progress-stats">
                                <span>예상 소요시간: <span id="remainingTime">45초</span></span>
                                <span>진행률: <span id="progressPercent">0%</span></span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="generation-result" id="generationResult" style="display: none;">
                    <div class="result-header">
                        <h3><i class="fas fa-check-circle"></i> 생성 완료</h3>
                        <div class="result-actions">
                            <button class="btn btn-primary" onclick="saveAllQuestions()">
                                <i class="fas fa-save"></i> 모두 저장
                            </button>
                            <button class="btn btn-outline" onclick="exportQuestions()">
                                <i class="fas fa-download"></i> 내보내기
                            </button>
                            <button class="btn btn-outline" onclick="regenerateAll()">
                                <i class="fas fa-redo"></i> 다시 생성
                            </button>
                        </div>
                    </div>
                    <div class="result-summary">
                        <div class="summary-stats">
                            <div class="stat-item">
                                <span class="stat-label">생성된 문제</span>
                                <span class="stat-value" id="generatedCount">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">품질 점수</span>
                                <span class="stat-value" id="qualityScore">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">생성 시간</span>
                                <span class="stat-value" id="generationTime">0초</span>
                            </div>
                        </div>
                    </div>
                    <div id="generatedQuestions"></div>
                </div>
            </div>
            
            <div class="generator-sidebar">
                <div class="sidebar-card">
                    <h4><i class="fas fa-lightbulb"></i> AI 생성 팁</h4>
                    <ul class="tip-list">
                        <li>구체적인 키워드를 사용하면 더 정확한 문제가 생성됩니다</li>
                        <li>임상 상황을 명확히 설정하면 실제적인 문제를 얻을 수 있습니다</li>
                        <li>난이도는 대상 수험생의 수준에 맞게 조정하세요</li>
                        <li>최신 진료 가이드라인을 반영하면 현실적인 문제가 됩니다</li>
                    </ul>
                </div>
                
                <div class="sidebar-card">
                    <h4><i class="fas fa-chart-line"></i> 생성 통계</h4>
                    <div class="generation-stats">
                        <div class="stat-row">
                            <span>오늘 생성</span>
                            <span class="stat-number">12</span>
                        </div>
                        <div class="stat-row">
                            <span>이번 주</span>
                            <span class="stat-number">45</span>
                        </div>
                        <div class="stat-row">
                            <span>평균 품질</span>
                            <span class="stat-number">92.3</span>
                        </div>
                        <div class="stat-row">
                            <span>승인률</span>
                            <span class="stat-number">87%</span>
                        </div>
                    </div>
                </div>
                
                <div class="sidebar-card">
                    <h4><i class="fas fa-star"></i> 최근 우수 문제</h4>
                    <div class="recent-questions">
                        <div class="recent-item">
                            <span class="question-title">당뇨병성 케톤산증 진단</span>
                            <span class="quality-badge excellent">우수</span>
                        </div>
                        <div class="recent-item">
                            <span class="question-title">급성 심근경색 치료</span>
                            <span class="quality-badge good">양호</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize advanced generator features
    console.log('Generator page content loaded successfully');
    initializeAdvancedGenerator();
    addAdvancedGeneratorStyles();
}

function loadReviewPage() {
    console.log('loadReviewPage called');
    const reviewPage = document.getElementById('review-page');
    if (!reviewPage) {
        console.error('Review page element not found!');
        return;
    }
    console.log('Review page element found, loading content...');
    
    reviewPage.innerHTML = `
        <div class="page-header">
            <div class="header-content">
                <h2>고급 검토 및 승인 시스템</h2>
                <p>AI 생성 문제와 수동 작성 문제의 품질을 체계적으로 검토하고 관리하세요</p>
            </div>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="showReviewStats()">
                    <i class="fas fa-chart-bar"></i> 검토 통계
                </button>
                <button class="btn btn-outline" onclick="exportReviewReport()">
                    <i class="fas fa-file-export"></i> 검토 보고서
                </button>
                <button class="btn btn-primary" onclick="showBulkActions()">
                    <i class="fas fa-tasks"></i> 일괄 처리
                </button>
            </div>
        </div>
        
        <div class="review-container">
            <div class="review-sidebar">
                <div class="review-summary-card">
                    <h4><i class="fas fa-clipboard-check"></i> 검토 현황</h4>
                    <div class="summary-stats">
                        <div class="summary-item">
                            <span class="summary-number pending">142</span>
                            <span class="summary-label">검토 대기</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-number approved">1,650</span>
                            <span class="summary-label">승인됨</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-number rejected">89</span>
                            <span class="summary-label">반려됨</span>
                        </div>
                    </div>
                </div>
                
                <div class="review-filters-card">
                    <h4><i class="fas fa-filter"></i> 고급 필터</h4>
                    <div class="filter-section">
                        <label>검토 상태</label>
                        <div class="checkbox-filter-group">
                            <label><input type="checkbox" value="pending" checked> 검토 대기</label>
                            <label><input type="checkbox" value="approved"> 승인됨</label>
                            <label><input type="checkbox" value="rejected"> 반려됨</label>
                            <label><input type="checkbox" value="draft"> 초안</label>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <label>의료 전공 분야</label>
                        <select class="filter-select" id="reviewSubjectFilter" onchange="applyFilters()">
                            <option value="all">전체 전공</option>
                            <option value="internal">내과학</option>
                            <option value="surgery">외과학</option>
                            <option value="nursing">성인간호학</option>
                            <option value="pharmacy">약리학</option>
                            <option value="pediatrics">소아과학</option>
                            <option value="emergency">응급의학</option>
                        </select>
                    </div>
                    
                    <div class="filter-section">
                        <label>생성 방식</label>
                        <div class="radio-filter-group">
                            <label><input type="radio" name="generationType" value="all" checked> 전체</label>
                            <label><input type="radio" name="generationType" value="ai"> AI 생성</label>
                            <label><input type="radio" name="generationType" value="manual"> 수동 작성</label>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <label>난이도 범위</label>
                        <div class="range-filter">
                            <input type="range" id="minDifficulty" min="1" max="10" value="1" oninput="updateDifficultyRange()">
                            <input type="range" id="maxDifficulty" min="1" max="10" value="10" oninput="updateDifficultyRange()">
                            <div class="range-labels">
                                <span id="difficultyRangeText">난이도 1-10</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <label>품질 점수</label>
                        <select class="filter-select" id="qualityFilter">
                            <option value="all">전체</option>
                            <option value="excellent">우수 (90+)</option>
                            <option value="good">양호 (80-89)</option>
                            <option value="fair">보통 (70-79)</option>
                            <option value="poor">미흡 (70 미만)</option>
                        </select>
                    </div>
                    
                    <div class="filter-section">
                        <label>생성 일자</label>
                        <div class="date-filter">
                            <input type="date" id="startDate" class="form-control">
                            <input type="date" id="endDate" class="form-control">
                        </div>
                    </div>
                    
                    <div class="filter-section">
                        <label>출제위원</label>
                        <select class="filter-select" id="examinerFilter">
                            <option value="all">전체 출제위원</option>
                            <option value="kim">김철수 (내과)</option>
                            <option value="lee">이영희 (외과)</option>
                            <option value="park">박민정 (간호)</option>
                        </select>
                    </div>
                    
                    <div class="filter-actions">
                        <button class="btn btn-primary" onclick="applyAdvancedFilters()">
                            <i class="fas fa-search"></i> 필터 적용
                        </button>
                        <button class="btn btn-outline" onclick="resetFilters()">
                            <i class="fas fa-redo"></i> 초기화
                        </button>
                        <button class="btn btn-outline" onclick="saveFilterPreset()">
                            <i class="fas fa-save"></i> 프리셋 저장
                        </button>
                    </div>
                </div>
                
                <div class="quick-actions-card">
                    <h4><i class="fas fa-bolt"></i> 빠른 액션</h4>
                    <div class="quick-action-buttons">
                        <button class="quick-btn" onclick="reviewHighPriority()">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>긴급 검토</span>
                        </button>
                        <button class="quick-btn" onclick="reviewAIGenerated()">
                            <i class="fas fa-robot"></i>
                            <span>AI 생성 문제</span>
                        </button>
                        <button class="quick-btn" onclick="reviewByDifficulty()">
                            <i class="fas fa-layer-group"></i>
                            <span>난이도별 검토</span>
                        </button>
                        <button class="quick-btn" onclick="reviewBySubject()">
                            <i class="fas fa-stethoscope"></i>
                            <span>전공별 검토</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="review-main">
                <div class="review-toolbar">
                    <div class="toolbar-left">
                        <div class="view-options">
                            <button class="view-btn active" data-view="list" onclick="switchReviewView('list')">
                                <i class="fas fa-list"></i> 목록
                            </button>
                            <button class="view-btn" data-view="grid" onclick="switchReviewView('grid')">
                                <i class="fas fa-th-large"></i> 그리드
                            </button>
                            <button class="view-btn" data-view="detail" onclick="switchReviewView('detail')">
                                <i class="fas fa-eye"></i> 상세
                            </button>
                        </div>
                        
                        <div class="sort-options">
                            <select class="sort-select" onchange="sortQuestions(this.value)">
                                <option value="newest">최신순</option>
                                <option value="oldest">오래된순</option>
                                <option value="priority">우선순위순</option>
                                <option value="quality">품질순</option>
                                <option value="difficulty">난이도순</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="toolbar-right">
                        <div class="search-box">
                            <input type="text" placeholder="문제 제목, 키워드, 내용 검색..." 
                                   id="reviewSearch" onkeyup="searchQuestions(this.value)">
                            <i class="fas fa-search"></i>
                        </div>
                        
                        <div class="bulk-selection">
                            <label>
                                <input type="checkbox" id="selectAll" onchange="toggleSelectAll()">
                                전체 선택
                            </label>
                            <span class="selected-count">0개 선택</span>
                        </div>
                    </div>
                </div>
                
                <div class="questions-review-list" id="questionsReviewList">
                    ${generateAdvancedReviewQuestions()}
                </div>
                
                <div class="review-pagination">
                    <div class="pagination-info">
                        <span>전체 1,247개 중 1-20개 표시</span>
                    </div>
                    <div class="pagination-controls">
                        <button class="page-btn" disabled><i class="fas fa-chevron-left"></i></button>
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">...</button>
                        <button class="page-btn">63</button>
                        <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Detailed Review Modal -->
        <div id="detailReviewModal" class="review-modal" style="display: none;">
            <div class="modal-content-large">
                <div class="modal-header">
                    <h3>상세 검토</h3>
                    <button onclick="closeDetailReview()" class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="detailReviewContent">
                    <!-- Dynamic content loaded here -->
                </div>
            </div>
        </div>
    `;
    
    // Initialize advanced review features
    console.log('Review page content loaded successfully');
    initializeAdvancedReview();
    addAdvancedReviewStyles();
}

function loadAnalyticsPage() {
    console.log('loadAnalyticsPage called');
    const analyticsPage = document.getElementById('analytics-page');
    if (!analyticsPage) {
        console.error('Analytics page element not found!');
        return;
    }
    console.log('Analytics page element found, loading content...');
    
    analyticsPage.innerHTML = `
        <div class="page-header">
            <h2>분석 및 통계</h2>
            <p>시스템 사용 현황과 성과를 다양한 차트와 지표로 분석하세요</p>
        </div>
        
        <div class="analytics-container">
            <div class="analytics-grid">
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>난이도 분포</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="difficultyChart" width="300" height="200"></canvas>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>과목별 문제 수</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="subjectChart" width="300" height="200"></canvas>
                    </div>
                </div>
                
                <div class="analytics-card">
                    <div class="card-header">
                        <h3>시스템 성능 지표</h3>
                    </div>
                    <div class="performance-metrics">
                        <div class="metric-item">
                            <span class="metric-label">평균 생성 시간</span>
                            <span class="metric-value">${mockData.dashboardStats.avg_generation_time}초</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">성공률</span>
                            <span class="metric-value">${mockData.dashboardStats.success_rate}%</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">사용자 만족도</span>
                            <span class="metric-value">${mockData.dashboardStats.user_satisfaction}/5.0</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">일일 활성 사용자</span>
                            <span class="metric-value">${mockData.dashboardStats.daily_active_users}명</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-card full-width">
                    <div class="card-header">
                        <h3>월별 생성 추세</h3>
                    </div>
                    <div class="chart-container">
                        <canvas id="trendChart" width="800" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Setup analytics charts
    console.log('Analytics page content loaded successfully');
    setTimeout(() => {
        setupAnalyticsCharts();
    }, 100);
    
    addAnalyticsStyles();
}

// Question Generation Functions
function generateQuestions() {
    const btn = document.querySelector('.btn-generate');
    const resultDiv = document.getElementById('generationResult');
    const questionsDiv = document.getElementById('generatedQuestions');
    
    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 생성 중...';
    btn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        btn.innerHTML = '<i class="fas fa-magic"></i> AI 문제 생성';
        btn.disabled = false;
        
        // Show result
        resultDiv.style.display = 'block';
        
        // Generate sample question
        questionsDiv.innerHTML = generateSampleQuestion();
        
        // Scroll to result
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
}

function generateSampleQuestion() {
    return `
        <div class="generated-question">
            <div class="question-header">
                <span class="question-badge ai-generated">AI 생성</span>
                <span class="difficulty-badge medium">중급</span>
                <span class="subject-badge">내과학</span>
            </div>
            
            <h4>당뇨병성 케톤산증 진단 및 치료</h4>
            
            <div class="question-content">
                <p>25세 제1형 당뇨병 환자가 구토와 복통을 주소로 응급실에 내원하였다. 
                혈당 450mg/dL, pH 7.25, HCO3- 12mEq/L, 케톤체 양성 소견을 보인다. 
                이 환자의 초기 치료로 가장 적절한 것은?</p>
                
                <div class="choices">
                    <div class="choice">
                        <span class="choice-number">1.</span>
                        <span class="choice-text">즉시 인슐린 대량 투여</span>
                    </div>
                    <div class="choice correct">
                        <span class="choice-number">2.</span>
                        <span class="choice-text">생리식염수 수액 공급 후 인슐린 투여</span>
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="choice">
                        <span class="choice-number">3.</span>
                        <span class="choice-text">중탄산염 즉시 투여</span>
                    </div>
                    <div class="choice">
                        <span class="choice-number">4.</span>
                        <span class="choice-text">경구 혈당강하제 투여</span>
                    </div>
                    <div class="choice">
                        <span class="choice-number">5.</span>
                        <span class="choice-text">수액 제한 후 관찰</span>
                    </div>
                </div>
                
                <div class="explanation">
                    <h5><i class="fas fa-lightbulb"></i> 해설</h5>
                    <p>당뇨병성 케톤산증(DKA)의 치료에서 가장 중요한 것은 탈수 교정입니다. 
                    생리식염수로 수액 공급을 시작한 후, 적절한 용량의 인슐린을 투여하는 것이 표준 치료법입니다.</p>
                </div>
            </div>
            
            <div class="question-actions">
                <button class="btn btn-success" onclick="approveQuestion()">
                    <i class="fas fa-check"></i> 승인
                </button>
                <button class="btn btn-warning" onclick="editQuestion()">
                    <i class="fas fa-edit"></i> 수정
                </button>
                <button class="btn btn-secondary" onclick="regenerateQuestion()">
                    <i class="fas fa-redo"></i> 재생성
                </button>
            </div>
        </div>
    `;
}

function resetForm() {
    document.getElementById('subject').value = '';
    document.getElementById('difficulty').value = 'medium';
    document.getElementById('questionType').value = 'multiple_choice';
    document.getElementById('count').value = '1';
    document.getElementById('keywords').value = '';
    document.getElementById('context').value = '';
    document.getElementById('generationResult').style.display = 'none';
}

function generateReviewQuestions() {
    return mockData.questions.map(question => `
        <div class="question-card">
            <div class="question-card-header">
                <div class="question-info">
                    <h4>${question.title}</h4>
                    <div class="question-meta">
                        <span class="badge ${question.ai_generated ? 'ai-badge' : 'manual-badge'}">
                            ${question.ai_generated ? 'AI 생성' : '수동 작성'}
                        </span>
                        <span class="subject">${question.subject_name}</span>
                        <span class="difficulty">난이도: ${question.difficulty_label}</span>
                        <span class="creator">출제: ${question.creator_name}</span>
                    </div>
                </div>
                <div class="question-status">
                    <span class="status-badge ${getStatusBadgeClass(question.status)}">${getStatusText(question.status)}</span>
                </div>
            </div>
            
            <div class="question-preview">
                <p>${question.content}</p>
            </div>
            
            <div class="question-actions">
                <button class="btn btn-sm btn-primary" onclick="viewQuestion(${question.id})">
                    <i class="fas fa-eye"></i> 상세보기
                </button>
                ${question.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="approveQuestion(${question.id})">
                        <i class="fas fa-check"></i> 승인
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="requestRevision(${question.id})">
                        <i class="fas fa-edit"></i> 수정요청
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'approved': '승인됨',
        'pending': '검토대기',
        'draft': '초안',
        'rejected': '반려됨'
    };
    return statusMap[status] || status;
}

// Analytics Chart Setup
function setupAnalyticsCharts() {
    setupDifficultyChart();
    setupSubjectChart();
    setupTrendChart();
}

function setupDifficultyChart() {
    const canvas = document.getElementById('difficultyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['하급', '중급', '상급'],
            datasets: [{
                data: [554, 924, 369],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(231, 76, 60, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function setupSubjectChart() {
    const canvas = document.getElementById('subjectChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['내과학', '외과학', '간호학', '약리학', '소아과학'],
            datasets: [{
                data: [485, 312, 398, 278, 189],
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 1,
                borderRadius: 6
            }]
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
                    beginAtZero: true
                }
            }
        }
    });
}

function setupTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.monthlyData.labels,
            datasets: [
                {
                    label: 'AI 생성',
                    data: mockData.monthlyData.ai_generated,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '수동 작성',
                    data: mockData.monthlyData.human_generated,
                    borderColor: 'rgba(245, 87, 108, 1)',
                    backgroundColor: 'rgba(245, 87, 108, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Utility Functions
function showGenerator() {
    // Trigger navigation to generator page
    const generatorNav = document.querySelector('[data-page="generator"]');
    if (generatorNav) {
        generatorNav.click();
    }
}

function approveQuestion(id) {
    alert(`문제 ID ${id || ''}가 승인되었습니다.`);
}

function editQuestion(id) {
    alert(`문제 ID ${id || ''}를 수정합니다.`);
}

function regenerateQuestion(id) {
    alert(`문제 ID ${id || ''}를 재생성합니다.`);
}

function viewQuestion(id) {
    alert(`문제 ID ${id}의 상세 내용을 보여줍니다.`);
}

function requestRevision(id) {
    alert(`문제 ID ${id}에 수정을 요청합니다.`);
}

// Advanced Generator Functions
function initializeAdvancedGenerator() {
    // Initialize keyword tags
    const keywordTags = document.getElementById('keywordTags');
    if (keywordTags) {
        keywordTags.innerHTML = '';
    }
    
    // Set up distribution sliders
    setupDistributionSliders();
    
    // Initialize tooltips and help text
    initializeTooltips();
}

function switchMode(mode) {
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });
    
    // Show corresponding content
    document.querySelectorAll('.mode-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = document.getElementById(`${mode}Mode`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Update generation button text
    updateGenerateButtonText(mode);
}

function updateSpecialties() {
    const subject = document.getElementById('subject').value;
    const specialty = document.getElementById('specialty');
    
    if (!specialty) return;
    
    specialty.disabled = false;
    specialty.innerHTML = '<option value="">세부 전공 선택</option>';
    
    const specialties = {
        internal: ['심장내과', '소화기내과', '호흡기내과', '내분비내과', '신장내과'],
        surgery: ['일반외과', '흉부외과', '신경외과', '정형외과', '성형외과'],
        nursing: ['중환자간호', '수술실간호', '응급간호', '정신간호', '지역사회간호'],
        pharmacy: ['임상약학', '병원약학', '산업약학', '약물유전학'],
        pediatrics: ['신생아학', '소아심장학', '소아감염학', '소아내분비학'],
        emergency: ['외상', '중독', '심폐소생술', '응급영상']
    };
    
    if (specialties[subject]) {
        specialties[subject].forEach(spec => {
            const option = document.createElement('option');
            option.value = spec;
            option.textContent = spec;
            specialty.appendChild(option);
        });
    }
}

function updateDifficultyDisplay(value) {
    const display = document.getElementById('currentDifficulty');
    if (!display) return;
    
    let label = '';
    if (value <= 3) label = `초급 (${value})`;
    else if (value <= 7) label = `중급 (${value})`;
    else label = `고급 (${value})`;
    
    display.textContent = label;
    
    // Update estimated time
    updateEstimatedTime();
}

function updateQuestionSettings() {
    const questionType = document.getElementById('questionType').value;
    const includeImages = document.getElementById('includeImages');
    
    // Enable/disable image option based on question type
    if (questionType === 'image_based') {
        includeImages.checked = true;
        includeImages.disabled = true;
    } else {
        includeImages.disabled = false;
    }
    
    updateEstimatedTime();
}

function adjustCount(delta) {
    const countInput = document.getElementById('count');
    if (!countInput) return;
    
    let newValue = parseInt(countInput.value) + delta;
    newValue = Math.max(1, Math.min(20, newValue));
    countInput.value = newValue;
    
    updateEstimatedTime();
}

function addKeyword(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    
    const input = document.getElementById('keywordInput');
    const tagsContainer = document.getElementById('keywordTags');
    const keyword = input.value.trim();
    
    if (keyword && !isDuplicateKeyword(keyword)) {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.innerHTML = `
            ${keyword}
            <button type="button" onclick="removeKeyword(this)" title="제거">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsContainer.appendChild(tag);
        input.value = '';
    }
}

function removeKeyword(button) {
    button.parentElement.remove();
}

function isDuplicateKeyword(keyword) {
    const existingTags = document.querySelectorAll('.keyword-tag');
    return Array.from(existingTags).some(tag => 
        tag.textContent.trim().replace('×', '').trim() === keyword
    );
}

function setupDistributionSliders() {
    const easySlider = document.getElementById('easyRatio');
    const mediumSlider = document.getElementById('mediumRatio');
    const hardSlider = document.getElementById('hardRatio');
    
    if (!easySlider || !mediumSlider || !hardSlider) return;
    
    function updateDistribution() {
        const easy = parseInt(easySlider.value);
        const medium = parseInt(mediumSlider.value);
        const hard = parseInt(hardSlider.value);
        
        document.getElementById('easyPercent').textContent = `${easy}%`;
        document.getElementById('mediumPercent').textContent = `${medium}%`;
        document.getElementById('hardPercent').textContent = `${hard}%`;
    }
    
    easySlider.addEventListener('input', updateDistribution);
    mediumSlider.addEventListener('input', updateDistribution);
    hardSlider.addEventListener('input', updateDistribution);
}

function updateEstimatedTime() {
    const count = parseInt(document.getElementById('count')?.value || 1);
    const difficulty = parseInt(document.getElementById('difficultySlider')?.value || 5);
    const questionType = document.getElementById('questionType')?.value || 'multiple_choice';
    
    let baseTime = 15; // seconds per question
    
    // Adjust for difficulty
    baseTime += difficulty * 2;
    
    // Adjust for question type
    const typeMultipliers = {
        'multiple_choice': 1,
        'scenario_based': 1.5,
        'case_study': 2,
        'image_based': 2.5,
        'calculation': 1.8,
        'diagnosis': 2.2
    };
    
    baseTime *= (typeMultipliers[questionType] || 1);
    
    const totalTime = Math.ceil(baseTime * count);
    
    const estimatedTimeSpan = document.getElementById('estimatedTime');
    if (estimatedTimeSpan) {
        estimatedTimeSpan.textContent = `(약 ${totalTime}초 소요)`;
    }
}

function updateGenerateButtonText(mode) {
    const button = document.getElementById('generateBtnText');
    if (!button) return;
    
    const texts = {
        basic: 'AI 문제 생성',
        advanced: '고급 AI 생성',
        batch: '일괄 생성 시작'
    };
    
    button.textContent = texts[mode] || 'AI 문제 생성';
}

function generateAdvancedQuestions() {
    const progressDiv = document.getElementById('generationProgress');
    const formCard = document.querySelector('.generator-form-card');
    const resultDiv = document.getElementById('generationResult');
    
    // Hide form and result, show progress
    formCard.style.display = 'none';
    resultDiv.style.display = 'none';
    progressDiv.style.display = 'block';
    
    // Start progress animation
    startProgressAnimation();
    
    // Simulate generation process
    setTimeout(() => {
        completeGeneration();
    }, 8000); // 8 seconds for demo
}

function startProgressAnimation() {
    let progress = 0;
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    const remainingTime = document.getElementById('remainingTime');
    
    const steps = [
        { progress: 30, text: '의료 전문 지식 데이터베이스를 분석하고 있습니다...', time: 60 },
        { progress: 60, text: '임상 시나리오를 구성하고 문제를 생성하고 있습니다...', time: 35 },
        { progress: 90, text: '의학적 정확성을 검증하고 품질을 평가하고 있습니다...', time: 10 },
        { progress: 100, text: '생성이 완료되었습니다!', time: 0 }
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
        if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            progress = step.progress;
            
            progressFill.style.width = `${progress}%`;
            progressPercent.textContent = `${progress}%`;
            progressText.textContent = step.text;
            remainingTime.textContent = `${step.time}초`;
            
            // Update step indicators
            updateStepIndicators(stepIndex + 1);
            
            stepIndex++;
        } else {
            clearInterval(interval);
        }
    }, 2000);
}

function updateStepIndicators(activeStep) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (step) {
            step.classList.remove('active', 'completed');
            if (i < activeStep) {
                step.classList.add('completed');
            } else if (i === activeStep) {
                step.classList.add('active');
            }
        }
    }
}

function completeGeneration() {
    const progressDiv = document.getElementById('generationProgress');
    const resultDiv = document.getElementById('generationResult');
    const questionsDiv = document.getElementById('generatedQuestions');
    
    // Hide progress, show results
    progressDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    
    // Update result stats
    const count = parseInt(document.getElementById('count')?.value || 1);
    document.getElementById('generatedCount').textContent = count;
    document.getElementById('qualityScore').textContent = '94.2';
    document.getElementById('generationTime').textContent = '8.3초';
    
    // Generate enhanced sample questions
    questionsDiv.innerHTML = generateEnhancedSampleQuestions(count);
    
    // Scroll to results
    resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateEnhancedSampleQuestions(count) {
    const sampleQuestions = [
        {
            title: "급성 심근경색증의 응급처치",
            content: `55세 남성이 운동 중 갑작스러운 가슴 통증을 호소하며 응급실에 내원했습니다. 
                     환자는 10분 전부터 시작된 압박감 있는 흉통과 호흡곤란, 냉한을 호소하고 있습니다.
                     심전도에서 II, III, aVF 유도에 ST 상승이 관찰되고, troponin I이 12.5 ng/mL로 상승되어 있습니다.
                     혈압 90/60 mmHg, 맥박 110회/분, 체온 36.8°C입니다.
                     이 환자에 대한 가장 적절한 초기 처치는?`,
            choices: [
                { text: "즉시 thrombolytic therapy 시작", correct: false },
                { text: "응급 PCI(경피적 관상동맥중재술) 준비", correct: true },
                { text: "안정 후 24시간 경과 관찰", correct: false },
                { text: "항응고제 투여 후 재검사", correct: false },
                { text: "수액 공급 후 증상 변화 관찰", correct: false }
            ],
            explanation: "ST 상승 심근경색증(STEMI)에서는 증상 발생 후 가능한 빠른 시간 내에 재관류 치료를 시행해야 합니다. 이 환자는 하벽 심근경색으로 추정되며, Primary PCI가 가능한 상황에서는 혈전용해술보다 PCI를 우선해야 합니다.",
            difficulty: "고급",
            subject: "내과학",
            type: "임상상황형",
            tags: ["심혈관", "응급의학", "STEMI", "PCI"],
            qualityScore: 96
        },
        {
            title: "수술 전 항응고제 관리",
            content: `68세 여성이 대퇴골 골절로 수술을 받기로 되어 있습니다. 
                     환자는 심방세동으로 인해 warfarin 5mg을 매일 복용 중이며, 
                     현재 INR 2.3, PT 25초입니다. 수술은 48시간 후 예정되어 있습니다.
                     이 환자의 수술 전 항응고제 관리로 가장 적절한 것은?`,
            choices: [
                { text: "warfarin 중단 없이 수술 진행", correct: false },
                { text: "warfarin 중단 후 heparin bridge therapy", correct: true },
                { text: "warfarin 용량을 절반으로 감량", correct: false },
                { text: "수술 직전까지 warfarin 유지", correct: false },
                { text: "vitamin K 투여 후 즉시 수술", correct: false }
            ],
            explanation: "고위험 환자(심방세동)에서 수술 전 항응고제 관리 시, warfarin을 중단하고 단시간 작용하는 heparin으로 bridge therapy를 시행하는 것이 표준입니다. 이는 출혈 위험을 줄이면서도 혈전 위험을 최소화할 수 있습니다.",
            difficulty: "중급",
            subject: "외과학",
            type: "사례분석형",
            tags: ["항응고제", "수술전관리", "warfarin", "bridge therapy"],
            qualityScore: 93
        }
    ];
    
    let html = '';
    for (let i = 0; i < count; i++) {
        const question = sampleQuestions[i % sampleQuestions.length];
        html += `
            <div class="enhanced-question" data-question-id="${i + 1}">
                <div class="question-header-enhanced">
                    <div class="question-badges">
                        <span class="badge ai-generated">AI 생성</span>
                        <span class="badge difficulty-${question.difficulty === '고급' ? 'hard' : question.difficulty === '중급' ? 'medium' : 'easy'}">${question.difficulty}</span>
                        <span class="badge subject">${question.subject}</span>
                        <span class="badge type">${question.type}</span>
                        <span class="badge quality">품질: ${question.qualityScore}</span>
                    </div>
                    <div class="question-actions-mini">
                        <button class="btn-mini" onclick="favoriteQuestion(${i + 1})" title="즐겨찾기">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="btn-mini" onclick="shareQuestion(${i + 1})" title="공유">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                
                <h4 class="question-title">${question.title}</h4>
                
                <div class="question-content-enhanced">
                    <div class="clinical-scenario">
                        <i class="fas fa-user-md"></i>
                        <div class="scenario-text">${question.content}</div>
                    </div>
                    
                    <div class="answer-choices">
                        ${question.choices.map((choice, idx) => `
                            <div class="choice-enhanced ${choice.correct ? 'correct-choice' : ''}" data-choice="${idx + 1}">
                                <span class="choice-number">${idx + 1}.</span>
                                <span class="choice-text">${choice.text}</span>
                                ${choice.correct ? '<i class="fas fa-check-circle correct-indicator"></i>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="detailed-explanation">
                        <h5><i class="fas fa-graduation-cap"></i> 상세 해설</h5>
                        <p>${question.explanation}</p>
                        
                        <div class="explanation-extras">
                            <div class="clinical-pearls">
                                <h6><i class="fas fa-gem"></i> 임상 포인트</h6>
                                <ul>
                                    <li>STEMI 환자는 Door-to-Balloon time 90분 이내 목표</li>
                                    <li>하벽 심근경색 시 우심실 침범 여부 확인 필요</li>
                                    <li>심인성 쇼크 동반 시 IABP 고려</li>
                                </ul>
                            </div>
                            
                            <div class="references">
                                <h6><i class="fas fa-book"></i> 참고문헌</h6>
                                <ul>
                                    <li>대한심장학회 급성관상동맥증후군 진료지침 2020</li>
                                    <li>ESC Guidelines for STEMI 2017</li>
                                    <li>AHA/ACC STEMI Guidelines 2013</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="question-tags">
                        ${question.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="question-actions-full">
                    <button class="btn btn-success" onclick="approveQuestion(${i + 1})">
                        <i class="fas fa-check"></i> 승인하기
                    </button>
                    <button class="btn btn-primary" onclick="editQuestion(${i + 1})">
                        <i class="fas fa-edit"></i> 수정하기
                    </button>
                    <button class="btn btn-warning" onclick="regenerateQuestion(${i + 1})">
                        <i class="fas fa-redo"></i> 재생성
                    </button>
                    <button class="btn btn-outline" onclick="duplicateQuestion(${i + 1})">
                        <i class="fas fa-copy"></i> 복제하기
                    </button>
                    <button class="btn btn-danger" onclick="deleteQuestion(${i + 1})">
                        <i class="fas fa-trash"></i> 삭제하기
                    </button>
                </div>
            </div>
        `;
    }
    
    return html;
}

// Additional helper functions
function previewSettings() {
    const settings = gatherGenerationSettings();
    showModal('설정 미리보기', `
        <div class="settings-preview">
            <h4>생성 설정 요약</h4>
            <ul>
                <li><strong>전공:</strong> ${settings.subject}</li>
                <li><strong>난이도:</strong> ${settings.difficulty}</li>
                <li><strong>문제 수:</strong> ${settings.count}개</li>
                <li><strong>유형:</strong> ${settings.questionType}</li>
                <li><strong>키워드:</strong> ${settings.keywords.join(', ')}</li>
            </ul>
        </div>
    `);
}

function saveAsTemplate() {
    const templateName = prompt('템플릿 이름을 입력하세요:');
    if (templateName) {
        const settings = gatherGenerationSettings();
        // Save to localStorage for demo
        const templates = JSON.parse(localStorage.getItem('questionTemplates') || '[]');
        templates.push({ name: templateName, settings, createdAt: new Date() });
        localStorage.setItem('questionTemplates', JSON.stringify(templates));
        
        showNotification('템플릿이 저장되었습니다.', 'success');
    }
}

function gatherGenerationSettings() {
    const keywords = Array.from(document.querySelectorAll('.keyword-tag'))
        .map(tag => tag.textContent.replace('×', '').trim());
    
    return {
        subject: document.getElementById('subject')?.value || '',
        difficulty: document.getElementById('difficultySlider')?.value || 5,
        questionType: document.getElementById('questionType')?.value || 'multiple_choice',
        count: parseInt(document.getElementById('count')?.value || 1),
        keywords: keywords,
        context: document.getElementById('context')?.value || ''
    };
}

function resetAdvancedForm() {
    // Reset all form fields
    document.getElementById('subject').value = '';
    document.getElementById('specialty').innerHTML = '<option value="">먼저 전공을 선택하세요</option>';
    document.getElementById('specialty').disabled = true;
    document.getElementById('difficultySlider').value = 5;
    updateDifficultyDisplay(5);
    document.getElementById('questionType').value = 'multiple_choice';
    document.getElementById('count').value = 1;
    document.getElementById('language').value = 'ko';
    document.getElementById('keywordInput').value = '';
    document.getElementById('keywordTags').innerHTML = '';
    document.getElementById('context').value = '';
    
    // Reset checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.id === 'detailedExplanation' || cb.id === 'references';
    });
    
    // Reset to basic mode
    switchMode('basic');
    
    showNotification('폼이 초기화되었습니다.', 'info');
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button onclick="closeModal()" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add dynamic styles
function addAdvancedGeneratorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .generator-container { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 320px; gap: 30px; }
        .generator-main { min-height: 600px; }
        .generator-sidebar { display: flex; flex-direction: column; gap: 20px; }
        
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 0 20px; }
        .header-actions { display: flex; gap: 15px; }
        
        .generator-form-card { background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin-bottom: 30px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; padding: 25px 30px 0; }
        .generation-mode { display: flex; gap: 5px; background: #f8f9fa; padding: 5px; border-radius: 10px; }
        .mode-btn { padding: 8px 16px; border: none; background: none; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
        .mode-btn.active { background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); color: #667eea; }
        
        .generator-form { padding: 30px; }
        .mode-content { display: none; }
        .mode-content.active { display: block; }
        
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; margin-bottom: 10px; font-weight: 600; color: #2c3e50; font-size: 14px; }
        .form-control { width: 100%; padding: 14px 18px; border: 2px solid #e9ecef; border-radius: 12px; font-size: 14px; transition: all 0.3s ease; background: #fafafa; }
        .form-control:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); background: white; }
        
        .difficulty-slider { position: relative; }
        .difficulty-slider input[type="range"] { width: 100%; height: 8px; border-radius: 4px; background: #e9ecef; outline: none; -webkit-appearance: none; }
        .difficulty-slider input[type="range"]::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #667eea; cursor: pointer; }
        .difficulty-labels { display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #6c757d; }
        #currentDifficulty { color: #667eea; font-weight: 600; }
        
        .count-selector { display: flex; align-items: center; gap: 10px; }
        .count-selector button { width: 36px; height: 36px; border: 2px solid #e9ecef; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .count-selector button:hover { border-color: #667eea; color: #667eea; }
        .count-selector input { text-align: center; width: 80px; }
        
        .checkbox-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .checkbox-group label { display: flex; align-items: center; gap: 10px; font-weight: 500; cursor: pointer; }
        .checkbox-group input[type="checkbox"] { width: 18px; height: 18px; }
        
        .keyword-input { position: relative; }
        .keyword-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; min-height: 20px; }
        .keyword-tag { background: #667eea; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 8px; }
        .keyword-tag button { background: none; border: none; color: white; cursor: pointer; padding: 0; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
        
        .distribution-sliders { margin-top: 20px; }
        .slider-group { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
        .slider-group label { min-width: 80px; font-weight: 500; }
        .slider-group input[type="range"] { flex: 1; }
        .slider-group span { min-width: 50px; font-weight: 600; color: #667eea; }
        
        .generation-options { margin: 30px 0; }
        .option-group { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .option-group label { display: flex; align-items: center; gap: 10px; padding: 15px; background: #f8f9fa; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; }
        .option-group label:hover { background: #e9ecef; }
        .option-group input[type="checkbox"] { width: 18px; height: 18px; }
        
        .form-actions { display: flex; gap: 15px; margin-top: 40px; flex-wrap: wrap; }
        .btn { padding: 14px 24px; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 8px; }
        .btn-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-outline { background: white; color: #667eea; border: 2px solid #667eea; }
        .btn-success { background: #28a745; color: white; }
        .btn-warning { background: #ffc107; color: #212529; }
        .btn-danger { background: #dc3545; color: white; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
        .estimated-time { font-size: 12px; color: #6c757d; font-weight: 400; margin-left: 8px; }
        
        .generation-progress { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .progress-bar { width: 100%; height: 12px; background: #e9ecef; border-radius: 6px; overflow: hidden; margin-bottom: 30px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); transition: width 0.5s ease; }
        .progress-steps { display: flex; justify-content: space-between; margin-bottom: 25px; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #6c757d; }
        .step.active { color: #667eea; }
        .step.completed { color: #28a745; }
        .step i { font-size: 24px; }
        .progress-details { text-align: center; }
        .progress-stats { display: flex; justify-content: center; gap: 30px; margin-top: 15px; color: #6c757d; font-size: 14px; }
        
        .generation-result { background: white; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .result-header { display: flex; justify-content: space-between; align-items: center; padding: 25px 30px; border-bottom: 1px solid #e9ecef; }
        .result-actions { display: flex; gap: 10px; }
        .result-summary { padding: 20px 30px; background: #f8f9fa; }
        .summary-stats { display: flex; gap: 40px; justify-content: center; }
        .stat-item { text-align: center; }
        .stat-label { display: block; color: #6c757d; font-size: 12px; margin-bottom: 5px; }
        .stat-value { display: block; color: #2c3e50; font-size: 24px; font-weight: 700; }
        
        .enhanced-question { background: white; border-radius: 16px; margin-bottom: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .question-header-enhanced { padding: 20px 25px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
        .question-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
        .badge.ai-generated { background: rgba(17, 153, 142, 0.1); color: #11998e; }
        .badge.difficulty-easy { background: rgba(40, 167, 69, 0.1); color: #28a745; }
        .badge.difficulty-medium { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .badge.difficulty-hard { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .badge.quality { background: rgba(102, 126, 234, 0.1); color: #667eea; }
        .question-actions-mini { display: flex; gap: 5px; }
        .btn-mini { width: 32px; height: 32px; border: 1px solid #e9ecef; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        
        .question-title { padding: 0 25px; margin: 20px 0; font-size: 18px; font-weight: 700; color: #2c3e50; }
        .question-content-enhanced { padding: 0 25px 25px; }
        .clinical-scenario { display: flex; gap: 15px; background: #f0f7ff; padding: 20px; border-radius: 12px; margin-bottom: 25px; }
        .clinical-scenario i { color: #667eea; font-size: 20px; margin-top: 2px; }
        .scenario-text { flex: 1; line-height: 1.6; }
        
        .answer-choices { margin: 25px 0; }
        .choice-enhanced { display: flex; align-items: flex-start; gap: 15px; padding: 15px; border: 2px solid #f1f3f4; border-radius: 12px; margin-bottom: 10px; transition: all 0.3s ease; }
        .choice-enhanced:hover { border-color: #e9ecef; background: #fafafa; }
        .choice-enhanced.correct-choice { background: rgba(40, 167, 69, 0.05); border-color: #28a745; }
        .choice-number { font-weight: 700; color: #667eea; min-width: 20px; }
        .choice-text { flex: 1; }
        .correct-indicator { color: #28a745; font-size: 18px; }
        
        .detailed-explanation { background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; }
        .detailed-explanation h5 { color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .explanation-extras { margin-top: 25px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .clinical-pearls, .references { }
        .clinical-pearls h6, .references h6 { color: #667eea; margin-bottom: 10px; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .clinical-pearls ul, .references ul { margin-left: 0; padding-left: 20px; }
        .clinical-pearls li, .references li { margin-bottom: 5px; font-size: 13px; color: #6c757d; }
        
        .question-tags { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 4px 10px; border-radius: 12px; font-size: 12px; }
        
        .question-actions-full { padding: 25px; background: #f8f9fa; display: flex; gap: 10px; flex-wrap: wrap; }
        
        .sidebar-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
        .sidebar-card h4 { color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 16px; }
        .tip-list { margin: 0; padding-left: 20px; }
        .tip-list li { margin-bottom: 10px; color: #6c757d; font-size: 13px; line-height: 1.4; }
        .generation-stats { }
        .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f3f4; }
        .stat-row:last-child { border-bottom: none; }
        .stat-number { font-weight: 700; color: #667eea; }
        .recent-questions { }
        .recent-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f3f4; }
        .recent-item:last-child { border-bottom: none; }
        .question-title { font-size: 13px; color: #2c3e50; }
        .quality-badge { padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; }
        .quality-badge.excellent { background: rgba(40, 167, 69, 0.1); color: #28a745; }
        .quality-badge.good { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content { background: white; border-radius: 16px; min-width: 500px; max-width: 80vw; max-height: 80vh; overflow: auto; }
        .modal-header { padding: 20px 25px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; }
        .modal-close { background: none; border: none; font-size: 18px; cursor: pointer; }
        .modal-body { padding: 25px; }
        
        .notification { position: fixed; top: 20px; right: 20px; background: white; border-radius: 12px; padding: 15px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; z-index: 2001; }
        .notification-success { border-left: 4px solid #28a745; }
        .notification-error { border-left: 4px solid #dc3545; }
        .notification-info { border-left: 4px solid #17a2b8; }
        .notification-close { background: none; border: none; margin-left: 10px; cursor: pointer; }
        
        @media (max-width: 1024px) { 
            .generator-container { grid-template-columns: 1fr; }
            .explanation-extras { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) { 
            .form-row { grid-template-columns: 1fr; }
            .checkbox-group { grid-template-columns: 1fr; }
            .option-group { grid-template-columns: 1fr; }
            .summary-stats { flex-direction: column; gap: 20px; }
            .page-header { flex-direction: column; gap: 15px; align-items: stretch; }
        }
    `;
    document.head.appendChild(style);
}

// Additional advanced functions
function initializeTooltips() {
    // Initialize tooltip functionality for help text
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = event.target.dataset.tooltip;
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function favoriteQuestion(id) {
    showNotification(`문제 ${id}가 즐겨찾기에 추가되었습니다.`, 'success');
}

function shareQuestion(id) {
    const url = `${window.location.origin}/questions/${id}`;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('문제 링크가 클립보드에 복사되었습니다.', 'success');
    });
}

function duplicateQuestion(id) {
    showNotification(`문제 ${id}가 복제되었습니다.`, 'success');
}

function deleteQuestion(id) {
    if (confirm('정말로 이 문제를 삭제하시겠습니까?')) {
        showNotification(`문제 ${id}가 삭제되었습니다.`, 'success');
    }
}

function saveAllQuestions() {
    const count = document.querySelectorAll('.enhanced-question').length;
    showNotification(`${count}개의 문제가 모두 저장되었습니다.`, 'success');
}

function exportQuestions() {
    const questions = document.querySelectorAll('.enhanced-question');
    const exportData = Array.from(questions).map((q, index) => ({
        id: index + 1,
        title: q.querySelector('.question-title').textContent,
        difficulty: q.querySelector('.badge.difficulty-easy, .badge.difficulty-medium, .badge.difficulty-hard').textContent
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_questions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('문제가 JSON 파일로 내보내기되었습니다.', 'success');
}

function regenerateAll() {
    if (confirm('모든 문제를 다시 생성하시겠습니까?')) {
        // Show form and hide results
        document.querySelector('.generator-form-card').style.display = 'block';
        document.getElementById('generationResult').style.display = 'none';
        
        showNotification('새로운 생성을 시작할 수 있습니다.', 'info');
    }
}

function cancelGeneration() {
    const progressDiv = document.getElementById('generationProgress');
    const formCard = document.querySelector('.generator-form-card');
    
    progressDiv.style.display = 'none';
    formCard.style.display = 'block';
    
    showNotification('생성이 취소되었습니다.', 'info');
}

function showGenerationHistory() {
    const historyData = JSON.parse(localStorage.getItem('generationHistory') || '[]');
    const historyHTML = historyData.length > 0 
        ? historyData.map(item => `
            <div class="history-item">
                <strong>${item.timestamp}</strong>
                <p>${item.subject} - ${item.count}개 문제</p>
                <small>품질: ${item.quality}/100</small>
            </div>
        `).join('')
        : '<p>생성 이력이 없습니다.</p>';
    
    showModal('생성 이력', `
        <div class="generation-history">
            ${historyHTML}
        </div>
    `);
}

function showTemplates() {
    const templates = JSON.parse(localStorage.getItem('questionTemplates') || '[]');
    const templatesHTML = templates.length > 0
        ? templates.map(template => `
            <div class="template-item">
                <strong>${template.name}</strong>
                <p>생성일: ${new Date(template.createdAt).toLocaleDateString()}</p>
                <button class="btn btn-sm btn-primary" onclick="loadTemplate('${template.name}')">
                    불러오기
                </button>
            </div>
        `).join('')
        : '<p>저장된 템플릿이 없습니다.</p>';
    
    showModal('저장된 템플릿', `
        <div class="template-list">
            ${templatesHTML}
        </div>
    `);
}

function loadTemplate(templateName) {
    const templates = JSON.parse(localStorage.getItem('questionTemplates') || '[]');
    const template = templates.find(t => t.name === templateName);
    
    if (template) {
        const settings = template.settings;
        
        // Load settings into form
        if (settings.subject) document.getElementById('subject').value = settings.subject;
        if (settings.difficulty) document.getElementById('difficultySlider').value = settings.difficulty;
        if (settings.questionType) document.getElementById('questionType').value = settings.questionType;
        if (settings.count) document.getElementById('count').value = settings.count;
        if (settings.context) document.getElementById('context').value = settings.context;
        
        // Load keywords
        const keywordTags = document.getElementById('keywordTags');
        keywordTags.innerHTML = '';
        settings.keywords?.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag';
            tag.innerHTML = `
                ${keyword}
                <button type="button" onclick="removeKeyword(this)" title="제거">
                    <i class="fas fa-times"></i>
                </button>
            `;
            keywordTags.appendChild(tag);
        });
        
        updateDifficultyDisplay(settings.difficulty);
        updateSpecialties();
        
        closeModal();
        showNotification(`템플릿 "${templateName}"이 로드되었습니다.`, 'success');
    }
}

function toggleImageOptions() {
    const includeImages = document.getElementById('includeImages').checked;
    // Add logic to show/hide additional image-related options
    console.log('Image options toggled:', includeImages);
}

// Advanced Review System Functions
function initializeAdvancedReview() {
    setupAdvancedFilters();
    updateDifficultyRange();
    loadReviewPreferences();
}

function generateAdvancedReviewQuestions() {
    const reviewQuestions = [
        {
            id: 1,
            title: "급성 심근경색 진단 및 치료",
            content: "65세 남자 환자가 흉통을 주소로 응급실에 내원하였다...",
            subject: "내과학",
            difficulty: 8,
            qualityScore: 94,
            status: "pending",
            aiGenerated: false,
            creator: "김철수",
            createdAt: "2025-08-06",
            priority: "high",
            reviewComments: 2
        },
        {
            id: 2,
            title: "수술 전 항응고제 관리",
            content: "68세 여성이 대퇴골 골절로 수술을 받기로 되어 있습니다...",
            subject: "외과학",
            difficulty: 6,
            qualityScore: 87,
            status: "pending",
            aiGenerated: true,
            creator: "AI 시스템",
            createdAt: "2025-08-06",
            priority: "medium",
            reviewComments: 0
        },
        {
            id: 3,
            title: "혈압 측정 프로토콜",
            content: "정확한 혈압 측정을 위한 환자 준비사항으로 가장 적절한 것은?",
            subject: "간호학",
            difficulty: 3,
            qualityScore: 92,
            status: "approved",
            aiGenerated: false,
            creator: "박민정",
            createdAt: "2025-08-05",
            priority: "low",
            reviewComments: 1
        }
    ];

    return reviewQuestions.map(question => `
        <div class="review-question-item" data-question-id="${question.id}" data-status="${question.status}">
            <div class="question-checkbox">
                <input type="checkbox" class="question-select" value="${question.id}" onchange="updateSelectionCount()">
            </div>
            
            <div class="question-review-content">
                <div class="question-header-review">
                    <div class="question-title-section">
                        <h4 class="review-question-title">${question.title}</h4>
                        <div class="question-meta-badges">
                            <span class="badge subject-badge">${question.subject}</span>
                            <span class="badge difficulty-badge difficulty-${getDifficultyClass(question.difficulty)}">
                                난이도 ${question.difficulty}
                            </span>
                            <span class="badge quality-badge quality-${getQualityClass(question.qualityScore)}">
                                품질 ${question.qualityScore}
                            </span>
                            <span class="badge generation-badge ${question.aiGenerated ? 'ai-generated' : 'manual'}">
                                ${question.aiGenerated ? 'AI 생성' : '수동 작성'}
                            </span>
                            <span class="badge priority-badge priority-${question.priority}">
                                ${getPriorityText(question.priority)}
                            </span>
                        </div>
                    </div>
                    
                    <div class="question-status-section">
                        <span class="status-indicator status-${question.status}">
                            <i class="fas fa-${getStatusIcon(question.status)}"></i>
                            ${getStatusText(question.status)}
                        </span>
                        <div class="question-actions-mini">
                            <button class="btn-icon" onclick="openDetailReview(${question.id})" title="상세 검토">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button class="btn-icon" onclick="addReviewComment(${question.id})" title="코멘트 추가">
                                <i class="fas fa-comment"></i>
                                ${question.reviewComments > 0 ? `<span class="comment-count">${question.reviewComments}</span>` : ''}
                            </button>
                            <button class="btn-icon" onclick="showQuestionHistory(${question.id})" title="변경 이력">
                                <i class="fas fa-history"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="question-preview">
                    <p class="question-content-preview">${question.content}</p>
                </div>
                
                <div class="question-footer-review">
                    <div class="question-info">
                        <span class="creator-info">
                            <i class="fas fa-user"></i>
                            ${question.creator} • ${question.createdAt}
                        </span>
                    </div>
                    
                    <div class="review-actions">
                        ${question.status === 'pending' ? `
                            <button class="btn btn-sm btn-success" onclick="approveQuestion(${question.id})">
                                <i class="fas fa-check"></i> 승인
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="requestRevision(${question.id})">
                                <i class="fas fa-edit"></i> 수정 요청
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="rejectQuestion(${question.id})">
                                <i class="fas fa-times"></i> 반려
                            </button>
                        ` : question.status === 'approved' ? `
                            <button class="btn btn-sm btn-outline" onclick="revokeApproval(${question.id})">
                                <i class="fas fa-undo"></i> 승인 취소
                            </button>
                        ` : `
                            <button class="btn btn-sm btn-primary" onclick="resubmitQuestion(${question.id})">
                                <i class="fas fa-redo"></i> 재검토 요청
                            </button>
                        `}
                        <button class="btn btn-sm btn-outline" onclick="assignReviewer(${question.id})">
                            <i class="fas fa-user-plus"></i> 검토자 지정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupAdvancedFilters() {
    // Set up date filters with default values
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    document.getElementById('endDate').value = today;
    document.getElementById('startDate').value = lastWeek;
}

function updateDifficultyRange() {
    const minDifficulty = document.getElementById('minDifficulty').value;
    const maxDifficulty = document.getElementById('maxDifficulty').value;
    
    document.getElementById('difficultyRangeText').textContent = `난이도 ${minDifficulty}-${maxDifficulty}`;
}

function switchReviewView(view) {
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // Update view class
    const reviewList = document.getElementById('questionsReviewList');
    reviewList.className = `questions-review-list view-${view}`;
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.question-select');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
    
    updateSelectionCount();
}

function updateSelectionCount() {
    const selected = document.querySelectorAll('.question-select:checked').length;
    document.querySelector('.selected-count').textContent = `${selected}개 선택`;
}

function searchQuestions(query) {
    const questions = document.querySelectorAll('.review-question-item');
    
    questions.forEach(question => {
        const title = question.querySelector('.review-question-title').textContent.toLowerCase();
        const content = question.querySelector('.question-content-preview').textContent.toLowerCase();
        const searchQuery = query.toLowerCase();
        
        if (title.includes(searchQuery) || content.includes(searchQuery)) {
            question.style.display = 'flex';
        } else {
            question.style.display = 'none';
        }
    });
}

function openDetailReview(questionId) {
    const modal = document.getElementById('detailReviewModal');
    const content = document.getElementById('detailReviewContent');
    
    content.innerHTML = `
        <div class="detail-review-content">
            <div class="review-tabs">
                <button class="tab-btn active" onclick="switchReviewTab('question')">문제 내용</button>
                <button class="tab-btn" onclick="switchReviewTab('analysis')">AI 분석</button>
                <button class="tab-btn" onclick="switchReviewTab('comments')">검토 의견</button>
                <button class="tab-btn" onclick="switchReviewTab('history')">변경 이력</button>
            </div>
            
            <div class="tab-content">
                <div class="tab-pane active" id="questionTab">
                    <div class="detailed-question">
                        <h3>급성 심근경색 진단 및 치료</h3>
                        <div class="question-metadata">
                            <span class="meta-item"><strong>출제위원:</strong> 김철수 (내과)</span>
                            <span class="meta-item"><strong>생성일:</strong> 2025-08-06</span>
                            <span class="meta-item"><strong>난이도:</strong> 8/10 (고급)</span>
                            <span class="meta-item"><strong>품질점수:</strong> 94/100</span>
                        </div>
                        
                        <div class="question-full-content">
                            <div class="clinical-case">
                                <h4><i class="fas fa-user-injured"></i> 임상 사례</h4>
                                <p>65세 남자 환자가 흉통을 주소로 응급실에 내원하였다. 심전도에서 V1-V4 유도에 ST분절 상승이 관찰되고, troponin I 수치가 15.2 ng/mL(정상 <0.04)로 상승되어 있다. 이 환자의 가장 적절한 초기 치료는?</p>
                            </div>
                            
                            <div class="answer-choices-detailed">
                                <h4><i class="fas fa-list-ol"></i> 선택지</h4>
                                <div class="choice correct">1. 즉시 경피적 관상동맥중재술(PCI) 시행 ✓</div>
                                <div class="choice">2. 혈전용해제 투여 후 경과 관찰</div>
                                <div class="choice">3. 항응고제 투여 후 24시간 후 재평가</div>
                                <div class="choice">4. 관상동맥조영술 후 수술적 치료 결정</div>
                                <div class="choice">5. 내과적 치료 후 안정화 대기</div>
                            </div>
                            
                            <div class="explanation-detailed">
                                <h4><i class="fas fa-graduation-cap"></i> 상세 해설</h4>
                                <p>ST분절 상승 심근경색(STEMI)의 경우 증상 발생 12시간 이내에 경피적 관상동맥중재술(Primary PCI)을 시행하는 것이 표준 치료입니다...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-pane" id="analysisTab">
                    <div class="ai-analysis">
                        <h4><i class="fas fa-robot"></i> AI 품질 분석</h4>
                        <div class="analysis-metrics">
                            <div class="metric-card">
                                <div class="metric-title">의학적 정확성</div>
                                <div class="metric-score excellent">96%</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-title">문제 구성</div>
                                <div class="metric-score excellent">94%</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-title">난이도 적정성</div>
                                <div class="metric-score good">88%</div>
                            </div>
                        </div>
                        
                        <div class="analysis-details">
                            <div class="analysis-section">
                                <h5>강점</h5>
                                <ul>
                                    <li>최신 진료 가이드라인에 부합</li>
                                    <li>실제 임상 상황을 잘 반영</li>
                                    <li>선택지가 논리적으로 구성됨</li>
                                </ul>
                            </div>
                            <div class="analysis-section">
                                <h5>개선 권장사항</h5>
                                <ul>
                                    <li>혈압 수치 추가로 환자 상태 명확화</li>
                                    <li>오답 선택지의 해설 보완 필요</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-pane" id="commentsTab">
                    <div class="review-comments">
                        <h4><i class="fas fa-comments"></i> 검토 의견</h4>
                        <div class="comment-form">
                            <textarea placeholder="검토 의견을 입력하세요..." class="comment-input"></textarea>
                            <div class="comment-actions">
                                <select class="comment-type">
                                    <option value="general">일반 의견</option>
                                    <option value="correction">수정 요청</option>
                                    <option value="approval">승인 사유</option>
                                    <option value="rejection">반려 사유</option>
                                </select>
                                <button class="btn btn-primary">의견 등록</button>
                            </div>
                        </div>
                        
                        <div class="existing-comments">
                            <!-- Existing comments would be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-review-actions">
                <button class="btn btn-success btn-lg" onclick="approveFromDetail(${questionId})">
                    <i class="fas fa-check"></i> 문제 승인
                </button>
                <button class="btn btn-warning btn-lg" onclick="requestRevisionFromDetail(${questionId})">
                    <i class="fas fa-edit"></i> 수정 요청
                </button>
                <button class="btn btn-danger btn-lg" onclick="rejectFromDetail(${questionId})">
                    <i class="fas fa-times"></i> 문제 반려
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function closeDetailReview() {
    document.getElementById('detailReviewModal').style.display = 'none';
}

function switchReviewTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show corresponding tab pane
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Helper functions for the review system
function getDifficultyClass(difficulty) {
    if (difficulty <= 3) return 'easy';
    if (difficulty <= 7) return 'medium';
    return 'hard';
}

function getQualityClass(score) {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'poor';
}

function getPriorityText(priority) {
    const priorities = { high: '긴급', medium: '보통', low: '낮음' };
    return priorities[priority] || priority;
}

function getStatusIcon(status) {
    const icons = {
        pending: 'clock',
        approved: 'check-circle',
        rejected: 'times-circle',
        draft: 'edit'
    };
    return icons[status] || 'question';
}

function addGeneratorStyles() {
    // This function is kept for backward compatibility but replaced by addAdvancedGeneratorStyles
    addAdvancedGeneratorStyles();
}

// Additional review system helper functions
function loadReviewPreferences() {
    // Load user's preferred filters and view settings
    const preferences = JSON.parse(localStorage.getItem('reviewPreferences') || '{}');
    // Apply saved preferences
}

function applyAdvancedFilters() {
    showNotification('고급 필터가 적용되었습니다.', 'success');
}

function resetFilters() {
    // Reset all filter inputs to default values
    document.querySelectorAll('.checkbox-filter-group input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'pending';
    });
    document.getElementById('reviewSubjectFilter').value = 'all';
    document.querySelectorAll('input[name="generationType"]').forEach(radio => {
        radio.checked = radio.value === 'all';
    });
    
    showNotification('필터가 초기화되었습니다.', 'info');
}

function saveFilterPreset() {
    const presetName = prompt('필터 프리셋 이름을 입력하세요:');
    if (presetName) {
        showNotification(`"${presetName}" 프리셋이 저장되었습니다.`, 'success');
    }
}

function showReviewStats() {
    showModal('검토 통계', `
        <div class="review-stats">
            <div class="stats-grid">
                <div class="stat-card">
                    <h4>이번 주 검토 현황</h4>
                    <div class="stat-number">47</div>
                    <div class="stat-label">검토 완료</div>
                </div>
                <div class="stat-card">
                    <h4>평균 검토 시간</h4>
                    <div class="stat-number">4.2분</div>
                    <div class="stat-label">문제당</div>
                </div>
                <div class="stat-card">
                    <h4>승인률</h4>
                    <div class="stat-number">87%</div>
                    <div class="stat-label">이번 달</div>
                </div>
            </div>
        </div>
    `);
}

function exportReviewReport() {
    showNotification('검토 보고서를 생성 중입니다...', 'info');
    
    setTimeout(() => {
        showNotification('검토 보고서가 다운로드되었습니다.', 'success');
    }, 2000);
}

function showBulkActions() {
    const selected = document.querySelectorAll('.question-select:checked');
    if (selected.length === 0) {
        showNotification('먼저 문제를 선택해주세요.', 'error');
        return;
    }
    
    showModal('일괄 처리', `
        <div class="bulk-actions">
            <p>${selected.length}개의 문제가 선택되었습니다.</p>
            <div class="bulk-action-buttons">
                <button class="btn btn-success" onclick="bulkApprove()">일괄 승인</button>
                <button class="btn btn-warning" onclick="bulkRequestRevision()">일괄 수정 요청</button>
                <button class="btn btn-danger" onclick="bulkReject()">일괄 반려</button>
                <button class="btn btn-outline" onclick="bulkAssign()">검토자 일괄 지정</button>
            </div>
        </div>
    `);
}

function addAdvancedReviewStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .review-container { display: grid; grid-template-columns: 300px 1fr; gap: 30px; max-width: 1600px; margin: 0 auto; }
        
        .review-sidebar { display: flex; flex-direction: column; gap: 20px; }
        .review-sidebar .sidebar-card, .review-summary-card, .review-filters-card, .quick-actions-card { 
            background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); 
        }
        .review-sidebar h4 { color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; font-size: 16px; }
        
        .summary-stats { display: flex; flex-direction: column; gap: 15px; }
        .summary-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .summary-number { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
        .summary-number.pending { color: #ffc107; }
        .summary-number.approved { color: #28a745; }
        .summary-number.rejected { color: #dc3545; }
        .summary-label { font-size: 12px; color: #6c757d; }
        
        .filter-section { margin-bottom: 20px; }
        .filter-section label { display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50; font-size: 13px; }
        .checkbox-filter-group, .radio-filter-group { display: flex; flex-direction: column; gap: 8px; }
        .checkbox-filter-group label, .radio-filter-group label { font-weight: 400; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .filter-select { width: 100%; padding: 8px 12px; border: 1px solid #e9ecef; border-radius: 6px; font-size: 13px; }
        
        .range-filter { display: flex; flex-direction: column; gap: 10px; }
        .range-filter input[type="range"] { width: 100%; }
        .range-labels { text-align: center; font-size: 12px; color: #667eea; font-weight: 600; }
        
        .date-filter { display: flex; flex-direction: column; gap: 8px; }
        .date-filter input { padding: 6px 8px; border: 1px solid #e9ecef; border-radius: 6px; font-size: 12px; }
        
        .filter-actions { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
        .filter-actions .btn { padding: 10px 16px; font-size: 13px; }
        
        .quick-action-buttons { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .quick-btn { background: white; border: 2px solid #e9ecef; padding: 15px; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        .quick-btn:hover { border-color: #667eea; background: #f8f9ff; }
        .quick-btn i { font-size: 18px; color: #667eea; }
        .quick-btn span { font-size: 12px; font-weight: 500; color: #2c3e50; }
        
        .review-main { min-height: 600px; }
        .review-toolbar { background: white; padding: 20px 25px; border-radius: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .toolbar-left { display: flex; align-items: center; gap: 20px; }
        .toolbar-right { display: flex; align-items: center; gap: 20px; }
        
        .view-options { display: flex; gap: 5px; background: #f8f9fa; padding: 5px; border-radius: 8px; }
        .view-btn { padding: 8px 12px; border: none; background: none; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 6px; }
        .view-btn.active { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #667eea; }
        
        .sort-select { padding: 8px 12px; border: 1px solid #e9ecef; border-radius: 8px; font-size: 13px; }
        
        .search-box { position: relative; }
        .search-box input { padding: 10px 40px 10px 16px; border: 2px solid #e9ecef; border-radius: 25px; width: 300px; font-size: 14px; }
        .search-box i { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: #6c757d; }
        
        .bulk-selection { display: flex; align-items: center; gap: 15px; }
        .bulk-selection label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; }
        .selected-count { font-size: 12px; color: #6c757d; }
        
        .questions-review-list { display: flex; flex-direction: column; gap: 15px; }
        .review-question-item { display: flex; gap: 15px; background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); transition: all 0.3s ease; }
        .review-question-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        
        .question-checkbox { display: flex; align-items: flex-start; padding-top: 5px; }
        .question-checkbox input[type="checkbox"] { width: 18px; height: 18px; }
        
        .question-review-content { flex: 1; }
        .question-header-review { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
        .question-title-section { flex: 1; }
        .review-question-title { margin-bottom: 10px; font-size: 16px; font-weight: 600; color: #2c3e50; }
        .question-meta-badges { display: flex; gap: 8px; flex-wrap: wrap; }
        .question-meta-badges .badge { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; }
        .subject-badge { background: rgba(102, 126, 234, 0.1); color: #667eea; }
        .difficulty-badge.difficulty-easy { background: rgba(40, 167, 69, 0.1); color: #28a745; }
        .difficulty-badge.difficulty-medium { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .difficulty-badge.difficulty-hard { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .quality-badge.quality-excellent { background: rgba(40, 167, 69, 0.1); color: #28a745; }
        .quality-badge.quality-good { background: rgba(23, 162, 184, 0.1); color: #17a2b8; }
        .quality-badge.quality-fair { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .quality-badge.quality-poor { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .generation-badge.ai-generated { background: rgba(17, 153, 142, 0.1); color: #11998e; }
        .generation-badge.manual { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
        .priority-badge.priority-high { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .priority-badge.priority-medium { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .priority-badge.priority-low { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
        
        .question-status-section { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
        .status-indicator { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-indicator.status-pending { background: rgba(255, 193, 7, 0.1); color: #ffc107; }
        .status-indicator.status-approved { background: rgba(40, 167, 69, 0.1); color: #28a745; }
        .status-indicator.status-rejected { background: rgba(220, 53, 69, 0.1); color: #dc3545; }
        .status-indicator.status-draft { background: rgba(108, 117, 125, 0.1); color: #6c757d; }
        
        .question-actions-mini { display: flex; gap: 5px; }
        .btn-icon { width: 32px; height: 32px; border: 1px solid #e9ecef; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; position: relative; }
        .btn-icon:hover { border-color: #667eea; background: #f8f9ff; }
        .comment-count { position: absolute; top: -6px; right: -6px; background: #dc3545; color: white; border-radius: 10px; padding: 2px 6px; font-size: 10px; min-width: 16px; text-align: center; }
        
        .question-preview { margin-bottom: 15px; }
        .question-content-preview { color: #6c757d; line-height: 1.5; font-size: 14px; }
        
        .question-footer-review { display: flex; justify-content: space-between; align-items: center; }
        .creator-info { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #6c757d; }
        .review-actions { display: flex; gap: 8px; }
        
        .review-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; padding: 20px; background: white; border-radius: 16px; }
        .pagination-info { color: #6c757d; font-size: 14px; }
        .pagination-controls { display: flex; gap: 5px; }
        .page-btn { padding: 8px 12px; border: 1px solid #e9ecef; background: white; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; }
        .page-btn:hover { border-color: #667eea; background: #f8f9ff; }
        .page-btn.active { background: #667eea; color: white; border-color: #667eea; }
        .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .review-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal-content-large { background: white; border-radius: 16px; width: 90vw; max-width: 1200px; max-height: 90vh; overflow: auto; }
        .modal-content-large .modal-header { padding: 25px 30px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center; }
        .modal-content-large .modal-body { padding: 0; }
        
        .detail-review-content { }
        .review-tabs { display: flex; background: #f8f9fa; }
        .tab-btn { padding: 15px 25px; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.3s ease; }
        .tab-btn.active { background: white; border-bottom-color: #667eea; color: #667eea; }
        
        .tab-content { min-height: 400px; }
        .tab-pane { display: none; padding: 30px; }
        .tab-pane.active { display: block; }
        
        .detailed-question h3 { margin-bottom: 20px; color: #2c3e50; }
        .question-metadata { display: flex; gap: 25px; margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 12px; }
        .meta-item { font-size: 14px; color: #6c757d; }
        
        .clinical-case, .answer-choices-detailed, .explanation-detailed { margin-bottom: 25px; }
        .clinical-case h4, .answer-choices-detailed h4, .explanation-detailed h4 { color: #667eea; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
        .clinical-case { background: #f0f7ff; padding: 20px; border-radius: 12px; }
        .choice { padding: 10px 15px; margin-bottom: 8px; border: 1px solid #e9ecef; border-radius: 8px; }
        .choice.correct { background: rgba(40, 167, 69, 0.1); border-color: #28a745; color: #155724; }
        
        .ai-analysis { }
        .analysis-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; }
        .metric-card { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px; }
        .metric-title { font-size: 13px; color: #6c757d; margin-bottom: 10px; }
        .metric-score { font-size: 24px; font-weight: 700; }
        .metric-score.excellent { color: #28a745; }
        .metric-score.good { color: #17a2b8; }
        .metric-score.fair { color: #ffc107; }
        .metric-score.poor { color: #dc3545; }
        
        .analysis-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
        .analysis-section h5 { color: #2c3e50; margin-bottom: 10px; }
        .analysis-section ul { padding-left: 20px; }
        .analysis-section li { margin-bottom: 5px; color: #6c757d; }
        
        .review-comments { }
        .comment-form { margin-bottom: 25px; }
        .comment-input { width: 100%; min-height: 100px; padding: 15px; border: 2px solid #e9ecef; border-radius: 12px; resize: vertical; }
        .comment-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
        .comment-type { padding: 8px 12px; border: 1px solid #e9ecef; border-radius: 8px; }
        
        .detail-review-actions { padding: 25px 30px; background: #f8f9fa; border-top: 1px solid #e9ecef; display: flex; gap: 15px; justify-content: center; }
        .btn-lg { padding: 15px 30px; font-size: 16px; }
        
        @media (max-width: 1024px) { 
            .review-container { grid-template-columns: 250px 1fr; }
            .analysis-metrics { grid-template-columns: 1fr; }
            .analysis-details { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) { 
            .review-container { grid-template-columns: 1fr; }
            .review-sidebar { order: 2; }
            .toolbar-left, .toolbar-right { flex-direction: column; gap: 10px; }
            .search-box input { width: 100%; }
            .question-header-review { flex-direction: column; gap: 15px; }
            .question-status-section { flex-direction: row; align-items: center; }
        }
    `;
    document.head.appendChild(style);
}

function addReviewStyles() {
    // This function is replaced by addAdvancedReviewStyles
    addAdvancedReviewStyles();
}

function addAnalyticsStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .analytics-container { max-width: 1200px; margin: 0 auto; }
        .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .analytics-card { background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); overflow: hidden; }
        .analytics-card.full-width { grid-column: 1 / -1; }
        .performance-metrics { padding: 30px; }
        .metric-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f1f3f4; }
        .metric-item:last-child { border-bottom: none; }
        .metric-label { color: #6c757d; font-size: 14px; }
        .metric-value { font-weight: 600; color: #2c3e50; font-size: 16px; }
    `;
    document.head.appendChild(style);
}
// Mob
ile Optimization Functions
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Touch event handlers for better mobile experience
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

// Optimize charts for mobile
function optimizeChartsForMobile() {
    if (isMobile()) {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.style.height = '200px';
        });
    }
}

// Form enhancement functions
function updateDifficultyDisplay(value) {
    const display = document.getElementById('currentDifficulty');
    if (!display) return;
    
    let label = '';
    if (value <= 3) label = `초급 (${value})`;
    else if (value <= 6) label = `중급 (${value})`;
    else label = `고급 (${value})`;
    
    display.textContent = label;
}

function adjustCount(delta) {
    const input = document.getElementById('count');
    if (!input) return;
    
    const current = parseInt(input.value) || 1;
    const newValue = Math.max(1, Math.min(20, current + delta));
    input.value = newValue;
    
    updateEstimatedTime();
}

function updateEstimatedTime() {
    const count = parseInt(document.getElementById('count')?.value) || 1;
    const difficulty = parseInt(document.getElementById('difficultySlider')?.value) || 5;
    const questionType = document.getElementById('questionType')?.value || 'multiple_choice';
    
    let baseTime = 30; // seconds per question
    
    // Adjust for difficulty
    if (difficulty <= 3) baseTime *= 0.8;
    else if (difficulty >= 7) baseTime *= 1.5;
    
    // Adjust for question type
    const typeMultipliers = {
        'multiple_choice': 1,
        'scenario_based': 1.5,
        'case_study': 2,
        'image_based': 1.8,
        'calculation': 1.3,
        'diagnosis': 1.7
    };
    
    baseTime *= (typeMultipliers[questionType] || 1);
    
    const totalTime = Math.ceil(baseTime * count);
    const estimatedTimeElement = document.getElementById('estimatedTime');
    
    if (estimatedTimeElement) {
        estimatedTimeElement.textContent = `(예상 ${totalTime}초)`;
    }
}

function updateSpecialties() {
    const subject = document.getElementById('subject')?.value;
    const specialtySelect = document.getElementById('specialty');
    
    if (!specialtySelect) return;
    
    const specialties = {
        'internal': ['심장내과', '소화기내과', '호흡기내과', '신장내과', '내분비내과'],
        'surgery': ['일반외과', '흉부외과', '신경외과', '정형외과', '성형외과'],
        'nursing': ['성인간호', '아동간호', '모성간호', '정신간호', '지역사회간호'],
        'pharmacy': ['임상약학', '약물치료학', '약제학', '생약학', '독성학'],
        'pediatrics': ['신생아학', '소아심장학', '소아신경학', '소아감염학', '소아내분비학'],
        'obstetrics': ['산과학', '부인과학', '생식내분비학', '모체태아의학', '부인종양학'],
        'psychiatry': ['일반정신의학', '아동정신의학', '노인정신의학', '중독정신의학', '법정신의학'],
        'emergency': ['응급의학', '중환자의학', '독성학', '외상학', '재해의학']
    };
    
    specialtySelect.innerHTML = '<option value="">세부 전공 선택</option>';
    
    if (subject && specialties[subject]) {
        specialtySelect.disabled = false;
        specialties[subject].forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            specialtySelect.appendChild(option);
        });
    } else {
        specialtySelect.disabled = true;
    }
}

function updateQuestionSettings() {
    updateEstimatedTime();
}

function addKeyword(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const keyword = input.value.trim();
        
        if (keyword) {
            const tagsContainer = document.getElementById('keywordTags');
            if (tagsContainer) {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.innerHTML = `
                    ${keyword}
                    <span class="remove" onclick="removeKeyword(this)">×</span>
                `;
                tagsContainer.appendChild(tag);
                input.value = '';
            }
        }
    }
}

function removeKeyword(element) {
    element.parentElement.remove();
}

function switchMode(mode) {
    const modes = document.querySelectorAll('.mode-btn');
    const contents = document.querySelectorAll('.mode-content');
    
    modes.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.getElementById(`${mode}Mode`).classList.add('active');
}

function toggleImageOptions() {
    const checkbox = document.getElementById('includeImages');
    const isChecked = checkbox.checked;
    
    // Add image-specific options if needed
    console.log('Image options toggled:', isChecked);
}

function generateAdvancedQuestions() {
    const btn = document.querySelector('.btn-generate');
    const progressDiv = document.getElementById('generationProgress');
    const resultDiv = document.getElementById('generationResult');
    
    if (!btn || !progressDiv) return;
    
    // Show loading state
    btn.classList.add('loading');
    btn.disabled = true;
    
    // Hide result and show progress
    if (resultDiv) resultDiv.style.display = 'none';
    progressDiv.style.display = 'block';
    
    // Simulate generation process
    simulateGeneration();
}

function simulateGeneration() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    const remainingTime = document.getElementById('remainingTime');
    
    const steps = [
        { percent: 20, text: '의료 전문 지식 데이터베이스를 분석하고 있습니다...', time: 35 },
        { percent: 50, text: '문제 구조를 설계하고 있습니다...', time: 25 },
        { percent: 80, text: '품질 검증을 수행하고 있습니다...', time: 10 },
        { percent: 100, text: '생성이 완료되었습니다!', time: 0 }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            
            if (progressFill) progressFill.style.width = `${step.percent}%`;
            if (progressText) progressText.textContent = step.text;
            if (progressPercent) progressPercent.textContent = `${step.percent}%`;
            if (remainingTime) remainingTime.textContent = `${step.time}초`;
            
            // Update step indicators
            const stepElements = document.querySelectorAll('.progress-steps .step');
            if (stepElements[currentStep]) {
                stepElements[currentStep].classList.add('active');
            }
            
            currentStep++;
            
            if (currentStep < steps.length) {
                setTimeout(updateProgress, 2000);
            } else {
                setTimeout(showGenerationResult, 1000);
            }
        }
    };
    
    updateProgress();
}

function showGenerationResult() {
    const progressDiv = document.getElementById('generationProgress');
    const resultDiv = document.getElementById('generationResult');
    const btn = document.querySelector('.btn-generate');
    
    if (progressDiv) progressDiv.style.display = 'none';
    if (resultDiv) resultDiv.style.display = 'block';
    
    if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
    
    // Scroll to result
    if (resultDiv) {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cancelGeneration() {
    const progressDiv = document.getElementById('generationProgress');
    const btn = document.querySelector('.btn-generate');
    
    if (progressDiv) progressDiv.style.display = 'none';
    
    if (btn) {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function previewSettings() {
    const settings = {
        subject: document.getElementById('subject')?.value,
        specialty: document.getElementById('specialty')?.value,
        difficulty: document.getElementById('difficultySlider')?.value,
        questionType: document.getElementById('questionType')?.value,
        count: document.getElementById('count')?.value,
        language: document.getElementById('language')?.value
    };
    
    alert(`설정 미리보기:\n전공: ${settings.subject}\n난이도: ${settings.difficulty}\n문제 수: ${settings.count}`);
}

function saveAsTemplate() {
    alert('템플릿이 저장되었습니다.');
}

function resetAdvancedForm() {
    if (confirm('모든 설정을 초기화하시겠습니까?')) {
        document.querySelectorAll('.generation-form input, .generation-form select, .generation-form textarea').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else if (element.type === 'range') {
                element.value = 5;
            } else if (element.id === 'count') {
                element.value = 1;
            } else {
                element.value = '';
            }
        });
        
        document.getElementById('keywordTags').innerHTML = '';
        updateDifficultyDisplay(5);
        updateEstimatedTime();
    }
}

// Initialize mobile optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addTouchSupport();
    optimizeChartsForMobile();
    
    // Add event listeners for form enhancements
    const difficultySlider = document.getElementById('difficultySlider');
    if (difficultySlider) {
        difficultySlider.addEventListener('input', (e) => updateDifficultyDisplay(e.target.value));
    }
    
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', updateSpecialties);
    }
    
    const questionTypeSelect = document.getElementById('questionType');
    if (questionTypeSelect) {
        questionTypeSelect.addEventListener('change', updateQuestionSettings);
    }
    
    const countInput = document.getElementById('count');
    if (countInput) {
        countInput.addEventListener('change', updateEstimatedTime);
    }
    
    // Initialize default values
    updateEstimatedTime();
});
// 
Show table scroll hint on mobile
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

// Add scroll event listener to performance table
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

// Enhanced mobile detection with user agent
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isMobile();
}

// Optimize page loading for mobile
function optimizeForMobile() {
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
        
        // Optimize chart rendering
        optimizeChartsForMobile();
    }
}

// Call mobile optimization when page loads
document.addEventListener('DOMContentLoaded', function() {
    optimizeForMobile();
});

// Re-optimize when window is resized
window.addEventListener('resize', function() {
    optimizeChartsForMobile();
    if (isMobile()) {
        showTableScrollHint();
    }
});// Sw
ipe gesture support for mobile navigation
let touchStartX = 0;
let touchEndX = 0;

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - could open mobile menu
            if (isMobile() && !document.getElementById('mobileNavMenu').classList.contains('active')) {
                toggleMobileNav();
            }
        } else {
            // Swipe left - could close mobile menu
            if (isMobile() && document.getElementById('mobileNavMenu').classList.contains('active')) {
                closeMobileNav();
            }
        }
    }
}

// Add swipe event listeners
document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, { passive: true });

// Prevent double-tap zoom on buttons
document.addEventListener('touchend', function(e) {
    if (e.target.matches('.btn, .nav-item, .mode-btn')) {
        e.preventDefault();
    }
});

// Optimize scroll performance on mobile
let ticking = false;

function updateScrollPosition() {
    // Add scroll-based optimizations here if needed
    ticking = false;
}

document.addEventListener('scroll', function() {
    if (!ticking && isMobile()) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
    }
}, { passive: true });

// Mobile-specific form validation
function validateMobileForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
            
            // Show mobile-friendly error message
            if (isMobile()) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'mobile-error-msg';
                errorMsg.textContent = '이 필드는 필수입니다';
                errorMsg.style.cssText = `
                    color: #e74c3c;
                    font-size: 12px;
                    margin-top: 5px;
                    animation: fadeIn 0.3s ease;
                `;
                
                // Remove existing error message
                const existingError = input.parentNode.querySelector('.mobile-error-msg');
                if (existingError) {
                    existingError.remove();
                }
                
                input.parentNode.appendChild(errorMsg);
                
                // Remove error message when user starts typing
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                    const errorMsg = this.parentNode.querySelector('.mobile-error-msg');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }, { once: true });
            }
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Mobile-friendly notifications
function showMobileNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `mobile-notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#667eea'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Enhanced mobile menu with keyboard navigation
function enhanceMobileNavigation() {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-menu .nav-item');
    
    mobileNavItems.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = mobileNavItems[index + 1] || mobileNavItems[0];
                nextItem.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = mobileNavItems[index - 1] || mobileNavItems[mobileNavItems.length - 1];
                prevItem.focus();
            } else if (e.key === 'Escape') {
                closeMobileNav();
            }
        });
    });
}

// Initialize enhanced mobile features
document.addEventListener('DOMContentLoaded', function() {
    enhanceMobileNavigation();
    
    // Add mobile-specific event listeners
    if (isMobileDevice()) {
        // Prevent context menu on long press for better UX
        document.addEventListener('contextmenu', function(e) {
            if (e.target.matches('.btn, .nav-item, .mode-btn, .metric-card')) {
                e.preventDefault();
            }
        });
        
        // Add haptic feedback simulation (visual feedback)
        document.addEventListener('touchstart', function(e) {
            if (e.target.matches('.btn, .nav-item, .mode-btn')) {
                e.target.style.opacity = '0.8';
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            if (e.target.matches('.btn, .nav-item, .mode-btn')) {
                setTimeout(() => {
                    e.target.style.opacity = '';
                }, 150);
            }
        }, { passive: true });
    }
});

// Mobile performance monitoring
function monitorMobilePerformance() {
    if (isMobileDevice() && 'performance' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
                if (entry.entryType === 'navigation') {
                    console.log('Mobile page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
                }
            });
        });
        
        observer.observe({ entryTypes: ['navigation'] });
    }
}

// Initialize performance monitoring
monitorMobilePerformance();