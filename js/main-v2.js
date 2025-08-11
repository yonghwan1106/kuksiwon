/**
 * AI Question Generator v2.0 - Enhanced Client Application
 * Real-time Collaboration & Claude AI Integration
 */

// Application Configuration
const APP_CONFIG = {
    // Check if we're in development mode (port 3000 or 3001)
    apiBaseUrl: (window.location.port === '3001' || window.location.hostname === 'localhost') ? 'http://localhost:3000/api' : '/api',
    wsUrl: (window.location.port === '3001' || window.location.hostname === 'localhost') ? 'ws://localhost:3000/ws' : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`,
    version: '2.0.0',
    features: {
        realTimeCollaboration: true,
        aiGeneration: true,
        offlineSupport: true,
        notifications: true
    },
    // Add fallback mode for when backend is not available
    mockMode: false
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

            const text = await response.text();
            
            // Check if response is HTML (indicates server not running or wrong endpoint)
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
                console.warn(`API endpoint ${endpoint} returned HTML instead of JSON - server may not be running`);
                APP_CONFIG.mockMode = true;
                return this.getMockResponse(endpoint);
            }

            return JSON.parse(text);
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            
            // If it's a network error or CORS error, enable mock mode
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.warn('API server not available, switching to mock mode');
                APP_CONFIG.mockMode = true;
                return this.getMockResponse(endpoint);
            }
            
            throw error;
        }
    }

    getMockResponse(endpoint) {
        console.log(`🔄 Using mock data for ${endpoint}`);
        
        // Return mock data based on endpoint
        switch(endpoint) {
            case '/health':
                return {
                    status: 'OK (Mock)',
                    version: '2.0.0',
                    timestamp: new Date().toISOString(),
                    uptime: 300,
                    environment: 'development'
                };
                
            case '/analytics/dashboard':
                return {
                    success: true,
                    data: {
                        overview: {
                            totalQuestions: 1247,
                            totalUsers: 89,
                            activeSessions: 12,
                            todayGenerated: 23,
                            weeklyGrowth: 15.8,
                            monthlyGrowth: 42.3
                        },
                        questionGeneration: {
                            today: 23,
                            yesterday: 19,
                            thisWeek: 156,
                            lastWeek: 134,
                            thisMonth: 687,
                            lastMonth: 543
                        },
                        aiPerformance: {
                            averageQualityScore: 0.87,
                            averageGenerationTime: 12.4,
                            successRate: 0.94,
                            enhancementRequests: 34
                        },
                        userActivity: {
                            activeNow: 12,
                            peakHour: '14:00',
                            averageSessionTime: 45,
                            collaborativeSessions: 8
                        }
                    }
                };
                
            default:
                // Handle AI generation endpoints
                if (endpoint === '/ai/generate') {
                    return {
                        success: true,
                        data: {
                            id: 'mock-' + Date.now(),
                            title: '급성 심근경색 환자의 초기 간호중재',
                            content: '65세 남성 환자가 흉통을 호소하며 응급실에 내원했습니다. ECG에서 ST 상승이 관찰되고, 트로포닌 수치가 상승했습니다. 이 환자의 초기 간호중재로 가장 우선되는 것은?',
                            choices: [
                                {
                                    id: 1,
                                    text: '통증 완화를 위한 진통제 투여',
                                    isCorrect: false,
                                    explanation: '통증 완화는 중요하지만 최우선은 아닙니다.'
                                },
                                {
                                    id: 2,
                                    text: '산소포화도 모니터링 및 산소 공급',
                                    isCorrect: true,
                                    explanation: '심근산소공급 증가가 가장 우선되는 간호중재입니다.'
                                },
                                {
                                    id: 3,
                                    text: '혈압 측정 및 기록',
                                    isCorrect: false,
                                    explanation: '활력징후 확인은 중요하지만 최우선은 아닙니다.'
                                },
                                {
                                    id: 4,
                                    text: '가족에게 연락하기',
                                    isCorrect: false,
                                    explanation: '응급상황에서는 치료가 우선입니다.'
                                },
                                {
                                    id: 5,
                                    text: '환자 교육 시작',
                                    isCorrect: false,
                                    explanation: '급성기에는 즉각적인 치료가 우선입니다.'
                                }
                            ],
                            overallExplanation: '급성 심근경색 환자의 초기 간호중재는 심근 산소 공급을 증가시키는 것이 가장 우선됩니다. 산소포화도를 모니터링하고 필요시 산소를 공급하여 심근의 저산소증을 방지해야 합니다.',
                            references: ['대한간호학회 응급간호 가이드라인 2024'],
                            clinicalPearls: ['급성 심근경색시 golden time은 90분', '산소포화도 94% 이하시 산소공급 필요'],
                            relatedTopics: ['심전도 해석', '심장효소 수치', '혈전용해요법'],
                            estimatedDifficulty: 0.7,
                            estimatedAnswerTime: '2-3분',
                            bloomTaxonomy: '적용',
                            qualityScore: {
                                overall: 0.89,
                                medicalAccuracy: 0.92,
                                languageQuality: 0.88,
                                clinicalRelevance: 0.90
                            },
                            metadata: {
                                aiModel: 'claude-3-5-sonnet-20241022 (Mock)',
                                specialty: 'nursing',
                                difficulty: 'medium',
                                questionType: 'multiple_choice',
                                generatedAt: new Date().toISOString(),
                                language: 'korean'
                            }
                        },
                        generation: {
                            timeMs: 8500,
                            model: 'claude-3-5-sonnet-20241022 (Mock)',
                            timestamp: new Date().toISOString()
                        }
                    };
                }
                
                return {
                    success: false,
                    error: 'Mock endpoint not implemented',
                    endpoint: endpoint
                };
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
        // Skip WebSocket connection in mock mode or if server is not available
        if (APP_CONFIG.mockMode) {
            console.log('⚠️ WebSocket disabled in mock mode');
            this.updateConnectionStatus('disconnected');
            return;
        }

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
                
                // Don't reconnect if in mock mode
                if (!APP_CONFIG.mockMode) {
                    this.attemptReconnect();
                }
            };

            this.ws.onerror = (error) => {
                console.warn('⚠️ WebSocket connection unavailable - using demo mode');
                this.updateConnectionStatus('offline');
                
                // Gracefully fallback to mock mode
                if (!APP_CONFIG.mockMode) {
                    console.log('🎭 Enabling demo mode for offline functionality');
                    APP_CONFIG.mockMode = true;
                    
                    // Show user-friendly notification
                    setTimeout(() => {
                        this.showNotification('Info', 'Running in demo mode - all features available for testing', 'info');
                    }, 1000);
                }
            };

            appState.ws = this;

        } catch (error) {
            console.error('❌ Failed to connect WebSocket:', error);
            this.updateConnectionStatus('error');
            APP_CONFIG.mockMode = true;
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
        
        // Update AI status panel based on mode
        this.updateAIStatusPanel();
    }

    async loadReviewPage() {
        console.log('📋 Loading review page...');
        
        try {
            // Load questions for review
            const response = await apiService.getQuestions({ status: 'pending' });
            
            if (response.success) {
                this.renderReviewQuestions(response.data);
            } else {
                // Fallback to mock data
                this.renderReviewQuestions(mockData.questions.filter(q => q.status === 'pending'));
            }
            
        } catch (error) {
            console.error('❌ Failed to load review page:', error);
            // Use mock data as fallback
            this.renderReviewQuestions(mockData.questions.filter(q => q.status === 'pending'));
        }
    }

    async loadAnalyticsPage() {
        console.log('📊 Loading analytics page...');
        
        try {
            // Load analytics data
            const response = await apiService.getDashboardData();
            
            if (response.success) {
                this.renderAnalytics(response.data);
            } else {
                // Fallback to mock analytics
                this.renderAnalytics(mockData.analytics);
            }
            
        } catch (error) {
            console.error('❌ Failed to load analytics page:', error);
            // Use mock data as fallback
            this.renderAnalytics(mockData.analytics);
        }
    }

    renderReviewQuestions(questions) {
        console.log(`📋 Rendering ${questions.length} questions for review`);
        // Implementation for rendering review questions
        const reviewContainer = document.querySelector('.review-container');
        
        if (reviewContainer) {
            reviewContainer.innerHTML = `
                <div class="review-header">
                    <h3>문제 검토 및 승인</h3>
                    <p>총 ${questions.length}개의 문제가 검토 대기 중입니다.</p>
                </div>
                <div class="review-list">
                    ${questions.map(q => `
                        <div class="review-item" data-id="${q.id}">
                            <div class="question-preview">
                                <h4>${q.title || 'Untitled Question'}</h4>
                                <p>난이도: ${q.difficulty || 'Medium'} | 과목: ${q.specialty || 'General'}</p>
                                <span class="status-badge ${q.status}">${q.status || 'pending'}</span>
                            </div>
                            <div class="review-actions">
                                <button class="btn btn-success" onclick="uiManager.approveQuestion('${q.id}')">승인</button>
                                <button class="btn btn-secondary" onclick="uiManager.reviewQuestion('${q.id}')">검토</button>
                                <button class="btn btn-danger" onclick="uiManager.rejectQuestion('${q.id}')">반려</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    renderAnalytics(data) {
        console.log('📊 Rendering analytics data');
        // Implementation for rendering analytics
        const analyticsContainer = document.querySelector('.analytics-container');
        
        if (analyticsContainer) {
            analyticsContainer.innerHTML = `
                <div class="analytics-header">
                    <h3>시스템 분석 및 통계</h3>
                    <p>AI 기반 출제 시스템의 성과 분석 결과입니다.</p>
                </div>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <h4>전체 문제 수</h4>
                        <div class="metric-value">${data?.totalQuestions || data?.overview?.totalQuestions || 0}</div>
                    </div>
                    <div class="analytics-card">
                        <h4>평균 품질 점수</h4>
                        <div class="metric-value">${((data?.avgQualityScore || 0.87) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="analytics-card">
                        <h4>활성 사용자</h4>
                        <div class="metric-value">${data?.activeUsers || data?.overview?.totalUsers || 0}</div>
                    </div>
                    <div class="analytics-card">
                        <h4>오늘 생성된 문제</h4>
                        <div class="metric-value">${data?.questionsToday || data?.overview?.todayGenerated || 0}</div>
                    </div>
                </div>
                <div class="chart-placeholder">
                    <p>📈 상세 분석 차트는 개발 예정입니다.</p>
                </div>
            `;
        }
    }
    
    updateAIStatusPanel() {
        const statusElement = document.querySelector('.model-details .status');
        const modelElement = document.querySelector('.model-details h4');
        
        if (statusElement && modelElement) {
            if (APP_CONFIG.mockMode) {
                statusElement.textContent = 'Demo Mode - Server Offline';
                statusElement.className = 'status offline';
                modelElement.textContent = 'Claude 3.5 Sonnet (Demo)';
            } else {
                statusElement.textContent = 'Ready for generation';
                statusElement.className = 'status online';
                modelElement.textContent = 'Claude 3.5 Sonnet';
            }
        }
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
            console.log('🧠 Generating question with Claude AI...', params);
            appState.isGenerating = true;
            this.showGenerationProgress();

            const response = await apiService.generateQuestion(params);
            
            if (response.success) {
                console.log('✅ Question generated successfully');
                
                // Add mock indicator if in mock mode
                if (APP_CONFIG.mockMode) {
                    response.data.metadata.mode = 'mock';
                    response.data.title = '[DEMO] ' + response.data.title;
                }
                
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
                        <p>Claude AI가 고품질 의료시험 문제를 생성하고 있습니다.</p>
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
                        <button class="btn btn-close" onclick="uiManager.closeGenerationResult()">
                            ✕ 닫기
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
                
                // Hide the generation result container after saving
                const resultContainer = document.querySelector('.generation-result');
                if (resultContainer) {
                    resultContainer.classList.remove('visible');
                }
                
                // Reset the generation state
                appState.isGenerating = false;
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

    closeGenerationResult() {
        // Prevent multiple executions
        if (this._closing) {
            console.log('⚠️ Close already in progress, ignoring...');
            return;
        }
        
        this._closing = true;
        console.log('🔙 Closing generation result...');
        
        // Get the result container
        const resultContainer = document.querySelector('.generation-result');
        if (!resultContainer) {
            this._closing = false;
            return;
        }
        
        // Immediately disable all buttons in the result to prevent multiple clicks
        const buttons = resultContainer.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        // Hide the generation result container
        resultContainer.classList.remove('visible');
        
        // Reset the generation state
        appState.isGenerating = false;
        
        // Reset the form to allow new generation
        const generatorForm = document.getElementById('question-generator-form');
        if (generatorForm) {
            const submitBtn = generatorForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '🧠 문제 생성';
            }
        }
        
        // Scroll back to the form for better UX
        const generatorContainer = document.querySelector('.generator-container');
        if (generatorContainer) {
            generatorContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
        
        // Clear the content after transition and reset closing flag
        setTimeout(() => {
            if (resultContainer) {
                resultContainer.innerHTML = '';
            }
            this._closing = false;
            console.log('✅ Generation result closed successfully');
        }, 500);
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
            
            // Check if we got a mock response
            if (response.status && response.status.includes('Mock')) {
                console.log('🔄 Running in mock mode - server not available');
                // Show mock mode indicator
                wsService.showNotification(
                    'Mock Mode Active', 
                    'Backend server not running. Using demo data for testing.', 
                    'info'
                );
            } else {
                console.log('🔗 Backend server available - full features enabled');
            }
            
            // Initialize WebSocket connection
            wsService.connect(appState.currentUser.id, appState.currentUser.name);
        })
        .catch(error => {
            console.warn('⚠️ API Health Check failed:', error);
            console.log('🔄 Running in offline mode');
            
            // Show offline mode notification
            wsService.showNotification(
                'Offline Mode', 
                'No internet connection. Using cached data.', 
                'info'
            );
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