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
                
                // Load page-specific content
                switch(pageId) {
                    case 'generator':
                        loadGeneratorPage();
                        break;
                    case 'review':
                        loadReviewPage();
                        break;
                    case 'analytics':
                        loadAnalyticsPage();
                        break;
                    default:
                        loadDashboard();
                }
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
    const generatorPage = document.getElementById('generator-page');
    if (!generatorPage) return;
    
    generatorPage.innerHTML = `
        <div class="page-header">
            <h2>AI 문제 생성</h2>
            <p>인공지능 기술을 활용하여 고품질의 시험 문제를 빠르게 생성하세요</p>
        </div>
        
        <div class="generator-container">
            <div class="generator-form-card">
                <div class="card-header">
                    <h3><i class="fas fa-robot"></i> 문제 생성 설정</h3>
                </div>
                <div class="generator-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="subject">과목 선택</label>
                            <select id="subject" class="form-control">
                                <option value="">과목을 선택하세요</option>
                                <option value="internal">내과학</option>
                                <option value="surgery">외과학</option>
                                <option value="nursing">성인간호학</option>
                                <option value="pharmacy">약리학</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="difficulty">난이도</label>
                            <select id="difficulty" class="form-control">
                                <option value="easy">하 (1-3)</option>
                                <option value="medium" selected>중 (4-6)</option>
                                <option value="hard">상 (7-10)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="questionType">문제 유형</label>
                            <select id="questionType" class="form-control">
                                <option value="multiple_choice" selected>객관식 5지선다</option>
                                <option value="scenario_based">상황형 문제</option>
                                <option value="case_study">사례 분석형</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="count">생성할 문제 수</label>
                            <select id="count" class="form-control">
                                <option value="1" selected>1개</option>
                                <option value="3">3개</option>
                                <option value="5">5개</option>
                                <option value="10">10개</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="keywords">주요 키워드 (선택사항)</label>
                        <input type="text" id="keywords" class="form-control" placeholder="예: 심근경색, 응급처치, 진단">
                        <small class="form-text">쉼표로 구분하여 여러 키워드를 입력하세요</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="context">추가 설명 (선택사항)</label>
                        <textarea id="context" class="form-control" rows="3" placeholder="특별한 요구사항이나 상황 설정이 있다면 입력하세요"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-primary btn-generate" onclick="generateQuestions()">
                            <i class="fas fa-magic"></i>
                            AI 문제 생성
                        </button>
                        <button class="btn btn-secondary" onclick="resetForm()">
                            <i class="fas fa-redo"></i>
                            초기화
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="generation-result" id="generationResult" style="display: none;">
                <div class="card-header">
                    <h3><i class="fas fa-check-circle"></i> 생성 결과</h3>
                </div>
                <div id="generatedQuestions"></div>
            </div>
        </div>
    `;
    
    // Add CSS for generator
    addGeneratorStyles();
}

function loadReviewPage() {
    const reviewPage = document.getElementById('review-page');
    if (!reviewPage) return;
    
    reviewPage.innerHTML = `
        <div class="page-header">
            <h2>검토 및 승인</h2>
            <p>생성된 문제들을 검토하고 승인하여 시험에 활용할 수 있도록 관리하세요</p>
        </div>
        
        <div class="review-container">
            <div class="review-filters">
                <div class="filter-group">
                    <label>상태</label>
                    <select class="filter-select">
                        <option value="all">전체</option>
                        <option value="pending">검토 대기</option>
                        <option value="approved">승인됨</option>
                        <option value="rejected">반려됨</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>과목</label>
                    <select class="filter-select">
                        <option value="all">전체</option>
                        <option value="internal">내과학</option>
                        <option value="surgery">외과학</option>
                        <option value="nursing">간호학</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>생성 방식</label>
                    <select class="filter-select">
                        <option value="all">전체</option>
                        <option value="ai">AI 생성</option>
                        <option value="manual">수동 작성</option>
                    </select>
                </div>
            </div>
            
            <div class="questions-list">
                ${generateReviewQuestions()}
            </div>
        </div>
    `;
    
    addReviewStyles();
}

function loadAnalyticsPage() {
    const analyticsPage = document.getElementById('analytics-page');
    if (!analyticsPage) return;
    
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

// Add dynamic styles
function addGeneratorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .generator-container { max-width: 1200px; margin: 0 auto; }
        .generator-form-card { background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin-bottom: 30px; }
        .generator-form { padding: 30px; }
        .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50; }
        .form-control { width: 100%; padding: 12px 16px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
        .form-control:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
        .form-text { font-size: 12px; color: #6c757d; margin-top: 5px; }
        .form-actions { display: flex; gap: 15px; margin-top: 30px; }
        .btn-generate { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .generation-result { background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); margin-top: 30px; }
        .generated-question { padding: 30px; }
        .question-header { display: flex; gap: 10px; margin-bottom: 20px; }
        .question-badge, .difficulty-badge, .subject-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .question-badge.ai-generated { background: rgba(17, 153, 142, 0.1); color: #11998e; }
        .difficulty-badge.medium { background: rgba(52, 152, 219, 0.1); color: #3498db; }
        .subject-badge { background: rgba(102, 126, 234, 0.1); color: #667eea; }
        .question-content { margin: 20px 0; }
        .choices { margin: 20px 0; }
        .choice { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; margin-bottom: 8px; border: 2px solid #f1f3f4; }
        .choice.correct { background: rgba(46, 204, 113, 0.05); border-color: #2ecc71; }
        .choice-number { font-weight: 600; min-width: 20px; }
        .explanation { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .question-actions { display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f3f4; }
        @media (max-width: 768px) { .form-row { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
}

function addReviewStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .review-container { max-width: 1200px; margin: 0 auto; }
        .review-filters { background: white; padding: 20px 30px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 30px; display: flex; gap: 30px; align-items: end; }
        .filter-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #2c3e50; font-size: 13px; }
        .questions-list { display: flex; flex-direction: column; gap: 20px; }
        .question-card { background: white; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; }
        .question-card-header { padding: 25px 30px 15px; display: flex; justify-content: between; align-items: flex-start; }
        .question-info h4 { margin-bottom: 10px; color: #2c3e50; }
        .question-meta { display: flex; gap: 15px; align-items: center; flex-wrap: wrap; }
        .question-meta .badge { font-size: 11px; padding: 4px 8px; }
        .ai-badge { background: rgba(17, 153, 142, 0.1); color: #11998e; }
        .manual-badge { background: rgba(245, 87, 108, 0.1); color: #f5576c; }
        .question-preview { padding: 0 30px 15px; color: #6c757d; }
        .question-actions { padding: 20px 30px; background: #f8f9fa; display: flex; gap: 10px; }
        .status-badge { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .status-badge.success { background: rgba(46, 204, 113, 0.1); color: #2ecc71; }
        .status-badge.warning { background: rgba(230, 126, 34, 0.1); color: #e67e22; }
        .status-badge.info { background: rgba(52, 152, 219, 0.1); color: #3498db; }
    `;
    document.head.appendChild(style);
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