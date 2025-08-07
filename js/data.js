// Mock Data for AI Question Generator Prototype
// 2025년도 한국보건의료인국가시험원 대국민 혁신제안 공모전 제출용

const mockData = {
    users: [
        {
            id: 1,
            username: "dr_kim_internal",
            email: "kim.internal@hospital.co.kr",
            name: "김철수",
            role: "examiner",
            specialty: "내과학",
            department: "내과",
            hospital: "서울대학교병원",
            experience_years: 15,
            total_questions_created: 245,
            average_rating: 4.3,
            created_at: "2023-01-15",
            last_login: "2025-08-07T09:30:00Z",
            profile_image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=40&h=40&fit=crop&crop=face"
        },
        {
            id: 2,
            username: "prof_lee_surgery",
            email: "lee.surgery@medical.ac.kr",
            name: "이영희",
            role: "examiner",
            specialty: "외과학",
            department: "외과",
            hospital: "연세대학교 의과대학",
            experience_years: 22,
            total_questions_created: 189,
            average_rating: 4.7,
            created_at: "2023-02-20",
            last_login: "2025-08-07T08:45:00Z",
            profile_image: "https://images.unsplash.com/photo-1594824723358-85883d3ece7d?w=40&h=40&fit=crop&crop=face"
        },
        {
            id: 3,
            username: "nurse_park_rn",
            email: "park.rn@nursing.org",
            name: "박민정",
            role: "examiner",
            specialty: "간호학",
            department: "간호학과",
            hospital: "고려대학교 간호대학",
            experience_years: 12,
            total_questions_created: 156,
            average_rating: 4.1,
            created_at: "2023-03-10",
            last_login: "2025-08-07T10:15:00Z",
            profile_image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face"
        }
    ],
    
    questions: [
        {
            id: 1,
            title: "급성 심근경색 진단",
            content: "65세 남자 환자가 흉통을 주소로 응급실에 내원하였다. 심전도에서 V1-V4 유도에 ST분절 상승이 관찰되고, troponin I 수치가 15.2 ng/mL(정상 <0.04)로 상승되어 있다. 이 환자의 가장 적절한 초기 치료는?",
            subject_id: 1,
            subject_name: "내과학",
            difficulty_level: 7,
            difficulty_label: "상",
            question_type: "multiple_choice",
            created_by: 1,
            creator_name: "김철수",
            ai_generated: false,
            status: "approved",
            tags: ["심혈관", "응급의학", "심근경색"],
            estimated_solve_time: 180,
            choices: [
                {
                    id: 1,
                    choice_text: "즉시 경피적 관상동맥중재술(PCI) 시행",
                    is_correct: true,
                    order_num: 1,
                    explanation: "ST분절 상승 심근경색에서는 12시간 이내 PCI가 1차 치료입니다."
                },
                {
                    id: 2,
                    choice_text: "혈전용해제 투여 후 경과 관찰",
                    is_correct: false,
                    order_num: 2,
                    explanation: "PCI가 가능한 상황에서는 혈전용해제보다 PCI가 우선됩니다."
                },
                {
                    id: 3,
                    choice_text: "항응고제 투여 후 24시간 후 재평가",
                    is_correct: false,
                    order_num: 3,
                    explanation: "급성기에는 즉시 재관류 치료가 필요합니다."
                },
                {
                    id: 4,
                    choice_text: "관상동맥조영술 후 수술적 치료 결정",
                    is_correct: false,
                    order_num: 4,
                    explanation: "응급상황에서는 PCI가 1차 선택입니다."
                },
                {
                    id: 5,
                    choice_text: "내과적 치료 후 안정화 대기",
                    is_correct: false,
                    order_num: 5,
                    explanation: "ST분절 상승 심근경색은 응급 재관류가 필요합니다."
                }
            ],
            explanation: "ST분절 상승 심근경색(STEMI)의 경우 증상 발생 12시간 이내에 경피적 관상동맥중재술(Primary PCI)을 시행하는 것이 표준 치료입니다. 이 환자는 전벽 심근경색으로 추정되며, 즉시 PCI를 통한 재관류 치료가 필요합니다.",
            created_at: "2025-07-15T14:30:00Z",
            updated_at: "2025-07-20T09:15:00Z"
        },
        {
            id: 2,
            title: "수술 전 금식 시간",
            content: "전신마취 하에 복강경 담낭절제술을 받을 예정인 45세 여자 환자의 수술 전 금식 시간으로 가장 적절한 것은?",
            subject_id: 2,
            subject_name: "외과학",
            difficulty_level: 4,
            difficulty_label: "중",
            question_type: "multiple_choice",
            created_by: 2,
            creator_name: "이영희",
            ai_generated: true,
            status: "approved",
            tags: ["마취", "수술전처치", "복강경수술"],
            estimated_solve_time: 120,
            choices: [
                {
                    id: 6,
                    choice_text: "고형식 6시간, 맑은 액체 2시간",
                    is_correct: true,
                    order_num: 1,
                    explanation: "현재 권고되는 표준 금식 시간입니다."
                },
                {
                    id: 7,
                    choice_text: "고형식 12시간, 맑은 액체 8시간",
                    is_correct: false,
                    order_num: 2,
                    explanation: "과도한 금식으로 탈수 위험이 있습니다."
                },
                {
                    id: 8,
                    choice_text: "고형식 8시간, 맑은 액체 4시간",
                    is_correct: false,
                    order_num: 3,
                    explanation: "현재 지침보다 긴 금식 시간입니다."
                },
                {
                    id: 9,
                    choice_text: "고형식 4시간, 맑은 액체 1시간",
                    is_correct: false,
                    order_num: 4,
                    explanation: "흡인 위험이 높아집니다."
                },
                {
                    id: 10,
                    choice_text: "모든 음식과 액체 12시간 금식",
                    is_correct: false,
                    order_num: 5,
                    explanation: "불필요한 장시간 금식입니다."
                }
            ],
            explanation: "미국마취과학회(ASA) 지침에 따르면 전신마취 전 고형식 6시간, 맑은 액체 2시간 금식이 표준입니다. 이는 흡인성 폐렴을 예방하면서도 과도한 금식으로 인한 탈수와 저혈당을 방지할 수 있는 적절한 시간입니다.",
            created_at: "2025-07-18T11:20:00Z",
            updated_at: "2025-07-19T14:30:00Z",
            ai_generation_params: {
                model: "gpt-4",
                prompt_type: "surgery_basic",
                difficulty_target: "medium",
                generation_time: 23.5
            }
        }
    ],

    subjects: [
        { id: 1, name: "내과학", code: "INT", category: "의사", total_questions: 850, active_questions: 720 },
        { id: 2, name: "외과학", code: "SUR", category: "의사", total_questions: 650, active_questions: 580 },
        { id: 3, name: "성인간호학", code: "ANR", category: "간호사", total_questions: 720, active_questions: 650 },
        { id: 4, name: "약리학", code: "PHA", category: "약사", total_questions: 480, active_questions: 420 },
        { id: 5, name: "소아과학", code: "PED", category: "의사", total_questions: 380, active_questions: 340 },
        { id: 6, name: "산부인과학", code: "OBG", category: "의사", total_questions: 420, active_questions: 380 }
    ],

    dashboardStats: {
        total_questions: 1847,
        approved_questions: 1650,
        pending_review: 142,
        draft_questions: 55,
        total_users: 87,
        active_examiners: 65,
        ai_generated_questions: 423,
        human_generated_questions: 1424,
        avg_generation_time: 28.3,
        success_rate: 94.2,
        user_satisfaction: 4.2,
        daily_active_users: 23
    },

    monthlyData: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월'],
        ai_generated: [12, 18, 25, 32, 28, 35, 45, 23],
        human_generated: [33, 34, 42, 39, 40, 39, 44, 28]
    },

    recentActivities: [
        {
            id: 1,
            user_name: "김철수",
            action: "질문 승인",
            target: "급성 심근경색 진단",
            timestamp: "2025-08-07T09:30:00Z",
            icon: "check-circle",
            color: "green"
        },
        {
            id: 2,
            user_name: "이영희",
            action: "AI 질문 생성",
            target: "수술 전 금식 시간",
            timestamp: "2025-08-07T08:45:00Z",
            icon: "robot",
            color: "blue"
        },
        {
            id: 3,
            user_name: "박민정",
            action: "질문 작성",
            target: "혈압 측정 시 주의사항",
            timestamp: "2025-08-07T08:15:00Z",
            icon: "edit",
            color: "orange"
        }
    ],

    examinerPerformance: [
        {
            examiner_name: "김철수",
            total_questions: 245,
            approved_rate: 87.3,
            avg_rating: 4.3,
            monthly_target: 20,
            monthly_completed: 18,
            efficiency_score: 92.5
        },
        {
            examiner_name: "이영희",
            total_questions: 189,
            approved_rate: 94.1,
            avg_rating: 4.7,
            monthly_target: 15,
            monthly_completed: 16,
            efficiency_score: 96.8
        },
        {
            examiner_name: "박민정",
            total_questions: 156,
            approved_rate: 81.4,
            avg_rating: 4.1,
            monthly_target: 12,
            monthly_completed: 11,
            efficiency_score: 85.2
        }
    ],

    notifications: [
        {
            id: 1,
            title: "시스템 업데이트 예정",
            message: "8월 10일 오후 6시부터 2시간 동안 시스템 점검이 예정되어 있습니다.",
            type: "info",
            created_at: "2025-08-07T09:00:00Z",
            is_read: false
        },
        {
            id: 2,
            title: "AI 모델 업데이트 완료",
            message: "의학 전문용어 처리 성능이 15% 향상된 새로운 AI 모델이 적용되었습니다.",
            type: "success",
            created_at: "2025-08-06T14:30:00Z",
            is_read: true
        }
    ]
};

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

function getStatusBadgeClass(status) {
    const statusMap = {
        'approved': 'success',
        'pending': 'warning',
        'draft': 'info',
        'rejected': 'danger'
    };
    return statusMap[status] || 'secondary';
}

function getDifficultyLabel(level) {
    if (level <= 3) return '하';
    if (level <= 6) return '중';
    return '상';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockData;
}