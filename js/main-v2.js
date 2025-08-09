/**
 * AI Question Generator v2.0 - Enhanced Client Application
 * Real-time Collaboration & Gemini AI Integration
 */

// Application Configuration
const APP_CONFIG = {
    apiBaseUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api',
    wsUrl: window.location.hostname === 'localhost' ? 'ws://localhost:3000/ws' : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    version: '2.0.0',
    features: {
        realTimeCollaboration: true,
        aiGeneration: true,
        offlineSupport: true,
        notifications: true
    }
};

// Application State
class AppState {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.questions = [];
        this.collaborationSessions = [];
        this.notifications = [];
        this.isOnline = navigator.onLine;
        this.ws = null;
        this.isGenerating = false;
    }
}

const appState = new AppState();

// API Service
class APIService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            };

            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    // AI Generation API
    async generateQuestion(params) {
        return this.request('/ai/generate', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    async generateBatch(params) {
        return this.request('/ai/generate-batch', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }

    async enhanceQuestion(questionData, enhancements) {
        return this.request('/ai/enhance', {
            method: 'POST',
            body: JSON.stringify({ questionData, enhancements })
        });
    }

    async validateQuestion(questionData) {
        return this.request('/ai/validate', {
            method: 'POST',
            body: JSON.stringify({ questionData })
        });
    }

    // Questions API
    async getQuestions(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/questions${query ? '?' + query : ''}`);
    }

    async saveQuestion(questionData) {
        return this.request('/questions', {
            method: 'POST',
            body: JSON.stringify(questionData)
        });
    }

    async updateQuestion(id, updates) {
        return this.request(`/questions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates)
        });
    }

    async approveQuestion(id, comment = '') {
        return this.request(`/questions/${id}/approve`, {
            method: 'POST',
            body: JSON.stringify({ comment })
        });
    }

    async rejectQuestion(id, reason) {
        return this.request(`/questions/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    }

    // Analytics API
    async getDashboardData() {
        return this.request('/analytics/dashboard');
    }

    async getQuestionAnalytics(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/analytics/questions${query ? '?' + query : ''}`);
    }

    // Health Check
    async checkHealth() {
        return this.request('/health');
    }
}

const apiService = new APIService(APP_CONFIG.apiBaseUrl);

// WebSocket Service for Real-time Features
class WebSocketService {
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.eventHandlers = new Map();
    }

    connect(userId, userName) {
        try {
            console.log('🔌 Connecting to WebSocket...', this.wsUrl);
            this.ws = new WebSocket(this.wsUrl);

            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.reconnectAttempts = 0;
                
                // Authenticate user
                this.send('auth', {
                    userId: userId || 'anonymous',
                    userName: userName || 'Anonymous User',
                    userRole: 'examiner'
                });

                this.updateConnectionStatus('connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('❌ Invalid WebSocket message:', error);
                }
            };

            this.ws.onclose = (event) => {
                console.log('❌ WebSocket disconnected:', event.code, event.reason);
                this.updateConnectionStatus('disconnected');
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.updateConnectionStatus('error');
            };

            appState.ws = this;

        } catch (error) {
            console.error('❌ Failed to connect WebSocket:', error);
            this.updateConnectionStatus('error');
        }
    }

    send(type, data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        } else {
            console.warn('⚠️ WebSocket not connected, message not sent:', type);
        }
    }

    handleMessage(message) {
        const { type, data } = message;
        console.log('📨 WebSocket message:', type, data);

        // Handle system messages
        switch (type) {
            case 'connection':
                console.log('🔗 Connection established:', data.clientId);
                break;

            case 'auth_success':
                console.log('🔐 Authentication successful');
                break;

            case 'error':
                console.error('❌ WebSocket error:', data.error);
                this.showNotification('WebSocket Error', data.error, 'error');
                break;

            case 'collaboration_update':
                this.handleCollaborationUpdate(data);
                break;

            case 'new_comment':
                this.handleNewComment(data);
                break;

            case 'typing_indicator':
                this.handleTypingIndicator(data);
                break;

            case 'participant_joined':
                this.handleParticipantJoined(data);
                break;

            case 'participant_left':
                this.handleParticipantLeft(data);
                break;

            case 'user_status_change':
                this.handleUserStatusChange(data);
                break;
        }

        // Call custom event handlers
        if (this.eventHandlers.has(type)) {
            this.eventHandlers.get(type).forEach(handler => handler(data));
        }
    }

    on(eventType, handler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType).push(handler);
    }

    joinRoom(roomId, roomType = 'question') {
        this.send('join_room', { roomId, roomType });
    }

    leaveRoom(roomId) {
        this.send('leave_room', { roomId });
    }

    updateQuestion(roomId, questionId, field, value) {
        this.send('question_update', {
            roomId,
            questionId,
            field,
            value,
            operation: 'update'
        });
    }

    addComment(roomId, questionId, content, parentId = null) {
        this.send('comment', {
            roomId,
            questionId,
            content,
            parentId
        });
    }

    startTyping(roomId, questionId) {
        this.send('typing', {
            roomId,
            questionId,
            isTyping: true
        });
    }

    stopTyping(roomId, questionId) {
        this.send('typing', {
            roomId,
            questionId,
            isTyping: false
        });
    }

    handleCollaborationUpdate(data) {
        // Update UI based on collaboration changes
        if (data.questionId && data.changes) {
            this.updateQuestionInUI(data.questionId, data.changes);
        }
        
        this.showNotification(
            'Collaboration Update',
            `${data.author.userName} updated the question`,
            'info'
        );
    }

    handleNewComment(data) {
        this.addCommentToUI(data);
        this.showNotification(
            'New Comment',
            `${data.author.userName}: ${data.content.substring(0, 50)}...`,
            'info'
        );
    }

    handleTypingIndicator(data) {
        this.updateTypingIndicator(data.userId, data.userName, data.isTyping);
    }

    handleParticipantJoined(data) {
        this.updateParticipantsList('add', data);
        this.showNotification(
            'Participant Joined',
            `${data.userName} joined the session`,
            'success'
        );
    }

    handleParticipantLeft(data) {
        this.updateParticipantsList('remove', data);
        this.showNotification(
            'Participant Left',
            `${data.userName} left the session`,
            'info'
        );
    }

    handleUserStatusChange(data) {
        this.updateUserStatus(data.userId, data.status);
    }

    updateConnectionStatus(status) {
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.className = `connection-status ${status}`;
            indicator.title = `Connection: ${status}`;
        }
    }

    showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add to container
        const container = document.getElementById('notifications-container') || 
                         this.createNotificationContainer();
        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Close button handler
        notification.querySelector('.notification-close').onclick = () => {
            notification.remove();
        };
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        document.body.appendChild(container);
        return container;
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect(appState.currentUser?.id, appState.currentUser?.name);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Max reconnection attempts reached');
            this.updateConnectionStatus('failed');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

const wsService = new WebSocketService(APP_CONFIG.wsUrl);

// Enhanced UI Manager
class UIManager {
    constructor() {
        this.currentPage = 'dashboard';
        this.loadingStates = new Set();
        this.modals = new Map();
    }

    // Page Navigation (Enhanced)
    switchPage(pageId) {
        console.log('🔄 Switching to page:', pageId);
        
        // Remove active class from all nav items and pages
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        
        // Add active class to clicked nav item
        const clickedNav = document.querySelector(`[data-page="${pageId}"]`);
        if (clickedNav) {
            clickedNav.classList.add('active');
        }
        
        // Show corresponding page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            appState.currentPage = pageId;
            
            // Load page-specific content
            this.loadPageContent(pageId);
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    async loadPageContent(pageId) {
        switch(pageId) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'generator':
                await this.loadGeneratorPage();
                break;
            case 'review':
                await this.loadReviewPage();
                break;
            case 'analytics':
                await this.loadAnalyticsPage();
                break;
        }
    }

    // Loading States
    showLoading(elementId, message = 'Loading...') {
        const element = document.getElementById(elementId);
        if (element) {
            this.loadingStates.add(elementId);
            element.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            element.classList.add('loading');
        }
    }

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element && this.loadingStates.has(elementId)) {
            this.loadingStates.delete(elementId);
            element.classList.remove('loading');
        }
    }

    // Dashboard
    async loadDashboard() {
        try {
            this.showLoading('dashboard-content', 'Loading dashboard data...');
            
            const response = await apiService.getDashboardData();
            if (response.success) {
                this.renderDashboard(response.data);
                this.setupDashboardCharts(response.data);
            }
            
            this.hideLoading('dashboard-content');
        } catch (error) {
            console.error('❌ Failed to load dashboard:', error);
            this.showError('dashboard-content', 'Failed to load dashboard data');
        }
    }

    renderDashboard(data) {
        // Update overview cards
        this.updateCard('total-questions', data.overview.totalQuestions);
        this.updateCard('total-users', data.overview.totalUsers);
        this.updateCard('active-sessions', data.overview.activeSessions);
        this.updateCard('today-generated', data.overview.todayGenerated);

        // Update trends
        this.updateTrend('weekly-growth', data.overview.weeklyGrowth);
        this.updateTrend('monthly-growth', data.overview.monthlyGrowth);

        // Update AI performance
        this.updateMetric('ai-quality-score', data.aiPerformance.averageQualityScore);
        this.updateMetric('ai-response-time', data.aiPerformance.averageGenerationTime + 's');
        this.updateMetric('ai-success-rate', (data.aiPerformance.successRate * 100).toFixed(1) + '%');

        console.log('✅ Dashboard updated successfully');
    }

    updateCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    }

    updateTrend(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value > 0 ? `+${value}%` : `${value}%`;
            element.className = value > 0 ? 'trend positive' : 'trend negative';
        }
    }

    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    // Generator Page
    async loadGeneratorPage() {
        console.log('📝 Loading generator page...');
        // Initialize AI generation form
        this.setupGeneratorForm();
    }

    setupGeneratorForm() {
        const form = document.getElementById('ai-generation-form');
        if (form) {
            form.addEventListener('submit', this.handleGenerateQuestion.bind(this));
        }

        // Setup real-time validation
        const inputs = form?.querySelectorAll('input, select, textarea');
        inputs?.forEach(input => {
            input.addEventListener('input', this.validateGenerationForm);
        });
    }

    async handleGenerateQuestion(event) {
        event.preventDefault();
        
        if (appState.isGenerating) {
            console.log('⏳ Generation already in progress...');
            return;
        }

        const formData = new FormData(event.target);
        const params = {
            specialty: formData.get('specialty'),
            difficulty: formData.get('difficulty'),
            questionType: formData.get('questionType'),
            topic: formData.get('topic'),
            keywords: formData.get('keywords')?.split(',').map(k => k.trim()).filter(k => k),
            learningObjectives: formData.get('learningObjectives')?.split(',').map(o => o.trim()).filter(o => o)
        };

        try {
            console.log('🧠 Generating question with Gemini AI...', params);
            appState.isGenerating = true;
            this.showGenerationProgress();

            const response = await apiService.generateQuestion(params);
            
            if (response.success) {
                console.log('✅ Question generated successfully');
                this.showGeneratedQuestion(response.data);
                this.hideGenerationProgress();
            } else {
                throw new Error(response.message || 'Generation failed');
            }

        } catch (error) {
            console.error('❌ Question generation failed:', error);
            this.showGenerationError(error.message);
        } finally {
            appState.isGenerating = false;
            this.hideGenerationProgress();
        }
    }

    showGenerationProgress() {
        const progressContainer = document.getElementById('generation-progress');
        if (progressContainer) {
            progressContainer.innerHTML = `
                <div class="generation-progress">
                    <div class="progress-header">
                        <h3>🧠 AI 문제 생성 중...</h3>
                        <p>Gemini AI가 고품질 의료시험 문제를 생성하고 있습니다.</p>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-steps">
                        <div class="step active">✅ 매개변수 분석 완료</div>
                        <div class="step active">🔄 AI 모델 처리 중...</div>
                        <div class="step">⏳ 품질 검증 대기</div>
                        <div class="step">⏳ 최종 검토 대기</div>
                    </div>
                </div>
            `;
            progressContainer.classList.add('visible');
        }

        // Simulate progress updates
        setTimeout(() => {
            const steps = progressContainer?.querySelectorAll('.step');
            if (steps && steps[2]) {
                steps[2].classList.add('active');
                steps[2].innerHTML = '✅ 품질 검증 완료';
            }
        }, 3000);

        setTimeout(() => {
            const steps = progressContainer?.querySelectorAll('.step');
            if (steps && steps[3]) {
                steps[3].classList.add('active');
                steps[3].innerHTML = '🔄 최종 검토 중...';
            }
        }, 6000);
    }

    hideGenerationProgress() {
        const progressContainer = document.getElementById('generation-progress');
        if (progressContainer) {
            progressContainer.classList.remove('visible');
        }
    }

    showGeneratedQuestion(questionData) {
        const resultContainer = document.getElementById('generation-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="generated-question">
                    <div class="question-header">
                        <h3>✨ 생성된 문제</h3>
                        <div class="quality-score">
                            <span class="score">품질 점수: ${(questionData.qualityScore?.overall * 100 || 85).toFixed(1)}%</span>
                        </div>
                    </div>
                    
                    <div class="question-content">
                        <h4>${questionData.title}</h4>
                        <div class="question-text">${questionData.content}</div>
                        
                        <div class="choices">
                            ${questionData.choices.map((choice, index) => `
                                <div class="choice ${choice.isCorrect ? 'correct' : ''}">
                                    <span class="choice-number">${index + 1}</span>
                                    <span class="choice-text">${choice.text}</span>
                                    ${choice.isCorrect ? '<span class="correct-indicator">✓ 정답</span>' : ''}
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="explanation">
                            <h5>해설</h5>
                            <p>${questionData.overallExplanation}</p>
                        </div>
                        
                        <div class="metadata">
                            <span>난이도: ${questionData.estimatedDifficulty}</span>
                            <span>예상 답안 시간: ${questionData.estimatedAnswerTime}</span>
                            <span>생성 시간: ${questionData.metadata?.generatedAt}</span>
                        </div>
                    </div>
                    
                    <div class="question-actions">
                        <button class="btn btn-primary" onclick="uiManager.saveQuestion('${JSON.stringify(questionData).replace(/'/g, '\\\'').replace(/"/g, '&quot;')}')">
                            💾 문제 저장
                        </button>
                        <button class="btn btn-secondary" onclick="uiManager.enhanceQuestion('${questionData.id}')">
                            🔧 문제 개선
                        </button>
                        <button class="btn btn-outline" onclick="uiManager.shareQuestion('${questionData.id}')">
                            📤 공유하기
                        </button>
                    </div>
                </div>
            `;
            resultContainer.classList.add('visible');
        }
    }

    showGenerationError(errorMessage) {
        const resultContainer = document.getElementById('generation-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="generation-error">
                    <h3>❌ 문제 생성 실패</h3>
                    <p>${errorMessage}</p>
                    <button class="btn btn-primary" onclick="uiManager.retryGeneration()">
                        🔄 다시 시도
                    </button>
                </div>
            `;
            resultContainer.classList.add('visible');
        }
    }

    async saveQuestion(questionDataStr) {
        try {
            const questionData = JSON.parse(questionDataStr.replace(/&quot;/g, '"'));
            console.log('💾 Saving question...', questionData.title);

            const response = await apiService.saveQuestion(questionData);
            if (response.success) {
                wsService.showNotification('Success', 'Question saved successfully!', 'success');
                appState.questions.push(response.data);
            }
        } catch (error) {
            console.error('❌ Failed to save question:', error);
            wsService.showNotification('Error', 'Failed to save question', 'error');
        }
    }

    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">⚠️</div>
                    <h3>오류 발생</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">새로고침</button>
                </div>
            `;
            element.classList.add('error');
        }
    }

    // Charts Setup
    setupDashboardCharts(data) {
        // Implementation will be added in next iteration
        console.log('📊 Setting up dashboard charts...');
    }
}

const uiManager = new UIManager();

// Global functions for HTML compatibility
function switchPage(pageId) {
    uiManager.switchPage(pageId);
}

// Generation mode switching
function switchGenerationMode(mode) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.mode-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.generation-mode-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.getElementById(`${mode}-generation`).classList.add('active');
}

// Form utilities
function resetGenerationForm() {
    const form = document.getElementById('ai-generation-form');
    if (form) {
        form.reset();
        // Clear any validation messages
        const hints = form.querySelectorAll('.field-hint');
        hints.forEach(hint => hint.style.color = '#6b7280');
    }
}

function loadTemplate() {
    // Mock template loading
    wsService.showNotification('Template Loaded', 'Default medical template loaded successfully', 'success');
    
    document.getElementById('specialty').value = 'nursing';
    document.getElementById('topic').value = '급성 심근경색 환자의 간호중재';
    document.getElementById('difficulty').value = 'medium';
    document.getElementById('keywords').value = 'ECG 모니터링, 산소요법, 활력징후, 흉통 사정';
}

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

// Application Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing AI Question Generator v2.0...');
    
    // Initialize current user (in production, this would come from authentication)
    appState.currentUser = {
        id: 'user_001',
        name: '박용환 교수',
        role: 'examiner',
        specialty: 'nursing'
    };

    // Check API health
    apiService.checkHealth()
        .then(response => {
            console.log('✅ API Health Check:', response);
            // Initialize WebSocket connection
            wsService.connect(appState.currentUser.id, appState.currentUser.name);
        })
        .catch(error => {
            console.warn('⚠️ API Health Check failed:', error);
            // Continue with offline mode
        });

    // Load initial page content
    uiManager.loadPageContent('dashboard');

    // Setup online/offline event listeners
    window.addEventListener('online', () => {
        console.log('🌐 Back online');
        appState.isOnline = true;
        wsService.connect(appState.currentUser.id, appState.currentUser.name);
    });

    window.addEventListener('offline', () => {
        console.log('📴 Gone offline');
        appState.isOnline = false;
        wsService.disconnect();
    });

    // Setup periodic data refresh
    setInterval(() => {
        if (appState.isOnline && appState.currentPage === 'dashboard') {
            uiManager.loadDashboard();
        }
    }, 30000); // Refresh every 30 seconds

    console.log('✅ Application initialized successfully');
});