# AI 기반 시험 문제 출제 지원 시스템 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 프로젝트명
AI 기반 시험 문제 출제 지원 시스템 (AI Question Generation Support System)

### 1.2 프로젝트 목적
한국보건의료인국가시험원의 출제 업무 효율성을 향상시키고 문제 품질의 일관성을 확보하기 위한 AI 기반 지능형 출제 지원 시스템 구축

### 1.3 대상 사용자
- **주 사용자**: 출제위원 (의사, 치과의사, 한의사, 약사, 간호사 분야 전문가)
- **관리자**: 국시원 시험 관리 담당자
- **검토자**: 외부 검토 위원

### 1.4 비즈니스 목표
- 출제위원 업무시간 50% 단축
- 연간 3억원 인건비 절감
- 출제 기간 30% 단축
- 문제 품질 일관성 95% 향상

## 2. 시스템 아키텍처

### 2.1 기술 스택
- **AI/ML**: OpenAI GPT-4 API + 의료 전문 Fine-tuning
- **백엔드**: Python Django + Django REST Framework
- **데이터베이스**: PostgreSQL + Redis (캐싱)
- **프론트엔드**: React.js + TypeScript + Material-UI
- **클라우드**: AWS EC2 + RDS + S3 + CloudFront
- **보안**: OAuth 2.0 + JWT + AES-256 암호화
- **배포**: Docker + Kubernetes + CI/CD (GitHub Actions)

### 2.2 시스템 구성요소
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Engine     │
│   (React)       │◄──►│   (Django)      │◄──►│   (GPT-4 API)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   Database      │    │   ML Pipeline   │
│   Interface     │    │   (PostgreSQL)  │    │   (Training)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 3. 핵심 기능 정의

### 3.1 문제 생성 AI 모듈
**기능**: 출제 기준과 난이도를 입력받아 초안 문제 자동 생성

**세부 기능**:
- 과거 10년간 출제 데이터 학습
- 의료 전문 용어 특화 자연어처리
- 정답/오답 보기 논리적 구성
- 문제 유형별 템플릿 지원

**입력**:
- 과목 분야 (예: 내과학, 외과학, 간호학 등)
- 난이도 (상/중/하)
- 문제 유형 (객관식 5지선다, 상황형 문제 등)
- 학습 목표 키워드

**출력**:
- 문제 본문
- 5개 선택지 (정답 1개, 오답 4개)
- 해설
- 예상 난이도 점수

### 3.2 난이도 조정 시스템
**기능**: IRT 모델을 활용한 문제 난이도 자동 측정 및 조정

**세부 기능**:
- 문항반응이론(IRT) 기반 난이도 측정
- 과거 데이터 기반 정답률 예측
- 전체 시험의 난이도 분포 균형 조정
- 실시간 난이도 피드백

### 3.3 품질 검증 모듈
**기능**: 생성된 문제의 품질과 정확성 자동 검증

**세부 기능**:
- 벡터 유사도 분석을 통한 중복성 검사
- 문법/의학적 정확성 검증
- 출제 가이드라인 준수 검토
- 논리적 오류 탐지

### 3.4 협업 도구
**기능**: 출제위원 간 효율적 협업 지원

**세부 기능**:
- 실시간 문제 공유 및 피드백
- 버전 관리 시스템
- 댓글 및 수정 제안
- 승인 워크플로우

## 4. 사용자 인터페이스 설계

### 4.1 메인 대시보드
- 진행 중인 출제 현황
- 개인 업무 할당량
- 시스템 사용 통계
- 공지사항 및 알림

### 4.2 문제 생성 페이지
- AI 생성 조건 설정 패널
- 생성된 문제 미리보기
- 실시간 편집 도구
- 난이도 시각화 차트

### 4.3 검토 및 승인 페이지
- 문제 목록 및 필터링
- 상세 검토 인터페이스
- 피드백 및 수정 요청
- 승인/반려 버튼

### 4.4 통계 및 분석 페이지
- 출제 현황 대시보드
- 품질 지표 모니터링
- 사용자별 성과 분석
- 시스템 효율성 리포트

## 5. 데이터베이스 설계

### 5.1 주요 테이블 구조

```sql
-- 사용자 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'examiner', 'admin', 'reviewer'
    specialty VARCHAR(50), -- 전문 분야
    created_at TIMESTAMP DEFAULT NOW()
);

-- 문제 테이블
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    difficulty_level INTEGER, -- 1-10 스케일
    question_type VARCHAR(30), -- 'multiple_choice', 'scenario_based'
    created_by INTEGER REFERENCES users(id),
    ai_generated BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'approved', 'rejected'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 선택지 테이블
CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    order_num INTEGER NOT NULL
);

-- AI 생성 로그
CREATE TABLE ai_generation_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    input_parameters JSONB,
    generated_content JSONB,
    processing_time INTEGER, -- milliseconds
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. API 설계

### 6.1 인증 관련 API
```
POST /api/auth/login - 사용자 로그인
POST /api/auth/logout - 사용자 로그아웃
GET /api/auth/profile - 사용자 프로필 조회
PUT /api/auth/profile - 사용자 프로필 수정
```

### 6.2 문제 생성 API
```
POST /api/questions/generate - AI 문제 생성 요청
GET /api/questions/ - 문제 목록 조회
GET /api/questions/{id} - 특정 문제 조회
PUT /api/questions/{id} - 문제 수정
DELETE /api/questions/{id} - 문제 삭제
POST /api/questions/{id}/approve - 문제 승인
POST /api/questions/{id}/reject - 문제 반려
```

### 6.3 분석 및 통계 API
```
GET /api/analytics/dashboard - 대시보드 데이터
GET /api/analytics/difficulty-distribution - 난이도 분포
GET /api/analytics/user-performance - 사용자 성과
GET /api/analytics/system-efficiency - 시스템 효율성
```

## 7. 보안 요구사항

### 7.1 데이터 보안
- 모든 데이터베이스 연결 SSL/TLS 암호화
- 민감 정보 AES-256 암호화 저장
- 정기적 데이터 백업 및 복구 테스트
- 접근 로그 모니터링

### 7.2 사용자 보안
- 이중 인증(2FA) 지원
- 역할 기반 접근 제어 (RBAC)
- 세션 타임아웃 관리
- 비밀번호 정책 강화

### 7.3 시스템 보안
- API 요청 제한 (Rate Limiting)
- SQL Injection 방지
- XSS 공격 차단
- CSRF 토큰 검증

## 8. 성능 요구사항

### 8.1 응답 시간
- 일반 페이지 로딩: 3초 이내
- AI 문제 생성: 30초 이내
- 데이터베이스 쿼리: 1초 이내
- API 응답: 500ms 이내

### 8.2 처리량
- 동시 사용자: 100명
- 일일 문제 생성: 500건
- 데이터베이스 동시 연결: 200개
- API 요청: 초당 1000건

### 8.3 확장성
- 수평적 확장 지원
- 로드 밸런서 구성
- 데이터베이스 샤딩 고려
- CDN 활용

## 9. 테스트 계획

### 9.1 단위 테스트
- 각 모듈별 기능 테스트
- API 엔드포인트 테스트
- 데이터베이스 CRUD 테스트
- AI 모델 정확성 테스트

### 9.2 통합 테스트
- 프론트엔드-백엔드 연동
- AI 엔진 통합 테스트
- 사용자 워크플로우 테스트
- 외부 API 연동 테스트

### 9.3 성능 테스트
- 부하 테스트
- 스트레스 테스트
- 동시성 테스트
- 메모리 누수 테스트

### 9.4 사용자 테스트
- 출제위원 파일럿 테스트
- 사용성 테스트
- 접근성 테스트
- 모바일 호환성 테스트

## 10. 배포 및 운영

### 10.1 배포 전략
- 단계적 배포 (Blue-Green Deployment)
- 자동화된 CI/CD 파이프라인
- 롤백 계획 수립
- 모니터링 도구 구축

### 10.2 운영 지원
- 24/7 시스템 모니터링
- 자동 알람 시스템
- 정기적 백업 및 복구
- 성능 최적화

### 10.3 유지보수
- 월간 보안 패치
- 분기별 기능 업데이트
- 연간 시스템 점검
- 사용자 피드백 반영

## 11. 위험 관리

### 11.1 기술적 위험
- **위험**: AI 모델 정확성 부족
  - **대응**: 전문가 검토 단계 필수화, 지속적 모델 개선
- **위험**: 시스템 성능 저하
  - **대응**: 성능 모니터링, 자동 스케일링 구현

### 11.2 운영적 위험
- **위험**: 사용자 저항
  - **대응**: 단계적 교육, 인센티브 제공
- **위험**: 예산 초과
  - **대응**: 단계별 개발, ROI 지속 모니터링

### 11.3 보안 위험
- **위험**: 데이터 유출
  - **대응**: 강화된 보안 체계, 정기 보안 감사
- **위험**: 시스템 해킹
  - **대응**: 침입 탐지 시스템, 보안 교육

## 12. 프로젝트 일정

### 12.1 1단계: 기반 구축 (1-3개월)
- 시스템 아키텍처 설계
- 개발 환경 구축
- 기본 AI 모델 개발
- 데이터베이스 설계 및 구축

### 12.2 2단계: 핵심 기능 개발 (4-6개월)
- 문제 생성 AI 모듈 구현
- 웹 인터페이스 개발
- 품질 검증 시스템 구축
- 단위 및 통합 테스트

### 12.3 3단계: 파일럿 테스트 (7-9개월)
- 간호사 시험 대상 시범 운영
- 출제위원 교육 프로그램
- 피드백 수집 및 개선
- 성능 최적화

### 12.4 4단계: 전면 도입 (10-12개월)
- 전 직종 확대 적용
- 고도화 기능 추가
- 운영 체계 안정화
- 효과성 평가

## 13. 성공 지표

### 13.1 정량적 지표
- 출제위원 업무시간 단축률: 50% 달성
- 문제 생성 소요시간: 기존 대비 70% 단축
- 시스템 사용률: 출제위원 90% 이상 활용
- 사용자 만족도: 5점 만점 중 4.0 이상

### 13.2 정성적 지표
- 문제 품질 일관성 향상
- 출제위원 업무 만족도 증가
- 시험 신뢰도 제고
- 조직 혁신 문화 확산

## 14. 예산 계획

### 14.1 개발 비용 (1년)
- 인력비: 5억원 (개발자 5명 × 12개월)
- AI API 비용: 1억원
- 클라우드 인프라: 5천만원
- 라이선스 및 도구: 3천만원
- **총 개발비**: 6.8억원

### 14.2 운영 비용 (연간)
- 클라우드 비용: 2억원
- AI API 비용: 1.5억원
- 유지보수: 1억원
- **총 운영비**: 4.5억원

### 14.3 ROI 분석
- 연간 절감 효과: 3억원 (인건비) + 1억원 (시간비용)
- 투자 회수 기간: 약 2년
- 5년 누적 효과: 15억원

이 PRD를 기반으로 실제 프로토타입을 구현하여 한국보건의료인국가시험원의 혁신적인 출제 지원 시스템을 구축할 수 있습니다.